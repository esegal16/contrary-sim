"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Game, Team, Round } from "@/lib/types";
import { MetricDelta } from "@/components/metric-delta";
import { CountdownTimer } from "@/components/countdown-timer";
import { PHASE_DURATIONS } from "@/lib/game-config";

const PHASE_INSTRUCTIONS: Record<string, string> = {
  briefing: "Review the briefing above. The open forum is about to begin.",
  open_forum: "Discuss openly with all teams. Make your case. Propose deals. Posture.",
  caucus: "Break out for private conversations. Make side deals.",
  submit: "Submit your team's actions for this round below.",
  resolving: "The simulation is processing all teams' actions...",
  resolved: "See what happened this round. Check your updated metrics.",
};

export default function TeamView() {
  const [team, setTeam] = useState<Team | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [actionText, setActionText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pastRounds, setPastRounds] = useState<Round[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadTeamState = useCallback(async (teamId: string) => {
    const { data: teamData } = await supabase
      .from("sim_teams").select().eq("id", teamId).single();
    if (!teamData) return;
    setTeam(teamData as Team);

    const { data: gameData } = await supabase
      .from("sim_games").select().eq("id", teamData.game_id).single();
    if (gameData) {
      setGame(gameData as Game);
      if (gameData.current_round > 0) {
        const { data: roundData } = await supabase
          .from("sim_rounds").select().eq("game_id", gameData.id).eq("round_number", gameData.current_round).single();
        if (roundData) setCurrentRound(roundData as Round);

        const { data: existing } = await supabase
          .from("sim_actions").select().eq("team_id", teamId).eq("round_number", gameData.current_round).single();
        if (existing) { setSubmitted(true); setActionText(existing.action_text); }
        else { setSubmitted(false); setActionText(""); }
      }
    }
  }, []);

  const handleJoin = async () => {
    setJoining(true);
    const { data } = await supabase
      .from("sim_teams").select().eq("join_code", joinCode.trim().toLowerCase()).single();
    if (data) { localStorage.setItem("teamId", data.id); await loadTeamState(data.id); }
    else { alert("Invalid join code"); }
    setJoining(false);
  };

  useEffect(() => {
    const teamId = new URLSearchParams(window.location.search).get("team") || localStorage.getItem("teamId");
    if (teamId) loadTeamState(teamId);
  }, [loadTeamState]);

  useEffect(() => {
    if (!team || !game) return;
    const channel = supabase
      .channel(`team-${team.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_games", filter: `id=eq.${game.id}` }, (payload) => {
        if (payload.new) setGame(payload.new as Game);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_teams", filter: `id=eq.${team.id}` }, (payload) => {
        if (payload.new) setTeam(payload.new as Team);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_rounds", filter: `game_id=eq.${game.id}` }, (payload) => {
        if (payload.new) {
          const round = payload.new as Round;
          if (round.round_number === game.current_round || round.round_number === game.current_round + 1) {
            setCurrentRound(round);
            if (round.round_number > (currentRound?.round_number || 0)) { setSubmitted(false); setActionText(""); }
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [team?.id, game?.id, game?.current_round, team, game, currentRound?.round_number]);

  // Poll for game/round updates every 3s (doesn't touch action text)
  useEffect(() => {
    if (!team || !game) return;
    const interval = setInterval(async () => {
      const [gameRes, teamRes] = await Promise.all([
        supabase.from("sim_games").select().eq("id", game.id).single(),
        supabase.from("sim_teams").select().eq("id", team.id).single(),
      ]);
      if (gameRes.data) {
        const g = gameRes.data as Game;
        setGame(g);
        if (g.current_round > 0) {
          const { data: roundData } = await supabase
            .from("sim_rounds").select().eq("game_id", g.id).eq("round_number", g.current_round).single();
          if (roundData) {
            const r = roundData as Round;
            // If we moved to a new round, reset submission state
            if (r.round_number > (currentRound?.round_number || 0)) {
              setSubmitted(false);
              setActionText("");
            }
            setCurrentRound(r);
          }
        }
      }
      if (teamRes.data) setTeam(teamRes.data as Team);

      // Load past resolved rounds for history
      const { data: resolvedRounds } = await supabase
        .from("sim_rounds")
        .select()
        .eq("game_id", game.id)
        .eq("phase", "resolved")
        .order("round_number", { ascending: false });
      if (resolvedRounds) setPastRounds(resolvedRounds as Round[]);
    }, 3000);
    return () => clearInterval(interval);
  }, [team?.id, game?.id, game?.current_round, currentRound?.round_number, team, game]);

  const submitAction = async () => {
    if (!team || !game || !actionText.trim()) return;
    setSubmitting(true);
    await fetch("/api/game/submit-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: team.id, gameId: game.id, roundNumber: game.current_round, actionText: actionText.trim() }),
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  // Join screen
  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)]" />
        <div className="w-full max-w-sm relative z-10">
          <p className="label text-blue-400 text-center mb-2 tracking-[0.2em]">Team Terminal</p>
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            CONTRARY
          </h1>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter join code"
            autoComplete="off"
            autoCapitalize="none"
            className="w-full bg-[var(--color-card)] border border-[var(--color-border-bright)] rounded-xl px-4 py-3.5 text-xl font-mono text-center mb-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 placeholder-slate-600 transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <button
            onClick={handleJoin}
            disabled={joining || !joinCode.trim()}
            className="w-full btn btn-primary py-3.5 text-base disabled:opacity-50"
          >
            {joining ? "Joining..." : "Join Game"}
          </button>
        </div>
      </div>
    );
  }

  const ws = game?.world_state;

  return (
    <div className="min-h-screen p-3 sm:p-4 max-w-2xl mx-auto pb-8">
      {/* Timer bar */}
      {currentRound && PHASE_DURATIONS[currentRound.phase] > 0 && currentRound.phase_started_at && (
        <div className="card-bright p-3 mb-3 sm:mb-4 flex items-center justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${
              currentRound.phase === "submit" ? "text-blue-400" : "text-slate-400"
            }`}>
              {currentRound.phase.replace("_", " ")}
            </p>
          </div>
          <CountdownTimer
            phaseStartedAt={currentRound.phase_started_at}
            durationSeconds={PHASE_DURATIONS[currentRound.phase]}
            compact
          />
        </div>
      )}

      {/* 1. Who You Are */}
      <div className="card p-4 sm:p-5 mb-3 sm:mb-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h1 className="text-lg sm:text-xl font-bold leading-tight text-white">{team.name}</h1>
          {game && (
            <span className="text-xs font-mono text-slate-500 shrink-0 bg-[var(--color-surface)] px-2 py-0.5 rounded">
              R{game.current_round}/{game.total_rounds}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{team.role_description}</p>
        {/* Secret objective */}
        {team.secret_objective && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
            <p className="label text-amber-400 mb-1">Secret Objective</p>
            <p className="text-xs text-slate-400">{team.secret_objective}</p>
          </div>
        )}
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {Object.entries(team.metrics).map(([key, value]) => (
          <div key={key} className="card p-2.5 sm:p-3">
            <p className="label mb-1">{key}</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">
                {value as number}
                <MetricDelta current={value as number} previous={team.previous_metrics?.[key] as number} />
              </p>
              <div className="flex-1 bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-700 bar-shimmer"
                  style={{ width: `${value as number}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. World State */}
      {ws && (
        <div className="card p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="label mb-1.5">World — {ws.year}</p>
          <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">{ws.summary}</p>
          <div className="flex gap-3 sm:gap-4 label">
            <span>AI: <span className="text-slate-300 font-mono">{ws.global_metrics.ai_progress}</span></span>
            <span>Econ: <span className="text-slate-300 font-mono">{ws.global_metrics.economic_stability}</span></span>
            <span>Risk: <span className="text-slate-300 font-mono">{ws.global_metrics.geopolitical_risk}</span></span>
          </div>
        </div>
      )}

      {/* Narrative (after resolution) */}
      {currentRound?.narrative && (
        <div className="card glow-blue p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="label text-blue-400 mb-1.5">What Happened</p>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {currentRound.narrative}
          </p>
        </div>
      )}

      {/* 4. Internal Briefing */}
      {team.secret_briefing && (
        <div className="card glow-amber p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="label text-amber-400 mb-1.5">
            {currentRound?.phase === "resolved" ? "Round Outcome — Your Eyes Only" : "Internal Briefing — Your Eyes Only"}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{team.secret_briefing}</p>
        </div>
      )}

      {/* 5. Action Input */}
      {currentRound?.phase === "submit" && (
        <div className={`card-bright p-3 sm:p-5 ${submitted ? "glow-green" : ""}`}>
          <p className="label mb-2 sm:mb-3">Your Actions This Round</p>
          <textarea
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            disabled={submitted}
            placeholder={`As ${team.name}, what do you do?\n\n- Impose export controls on...\n- Secretly negotiate with...\n- Invest $X billion in...`}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 sm:p-4 text-sm min-h-[140px] sm:min-h-[160px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 disabled:opacity-60 resize-none placeholder-slate-600 transition-all"
          />
          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
            <p className="label">
              {submitted ? <span className="text-emerald-400">Submitted. Waiting...</span> : "1-3 actions."}
            </p>
            <button
              onClick={submitAction}
              disabled={submitting || submitted || !actionText.trim()}
              className={`btn px-4 sm:px-5 py-2 text-sm shrink-0 ${
                submitted
                  ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800/50"
                  : "btn-primary disabled:opacity-50"
              }`}
            >
              {submitted ? "Submitted" : submitting ? "..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Waiting states */}
      {currentRound?.phase === "resolving" && (
        <div className="card glow-amber p-6 sm:p-8 text-center">
          <div className="text-xl sm:text-2xl mb-2 text-amber-400 animate-pulse-glow font-semibold">Simulating...</div>
          <p className="text-slate-500 text-xs sm:text-sm">Processing all teams&apos; actions.</p>
        </div>
      )}

      {game?.status === "lobby" && (
        <div className="card p-6 sm:p-8 text-center">
          <p className="text-lg sm:text-xl font-semibold text-yellow-400 mb-2">Waiting for game to start</p>
          <p className="text-slate-500 text-xs sm:text-sm">The game master will begin Round 1 shortly.</p>
        </div>
      )}

      {game?.status === "finished" && (
        <div className="space-y-3 sm:space-y-4">
          <div className="card glow-amber p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-2">GAME OVER</h2>
            <p className="text-slate-500 text-sm">Final metrics above. Check the master screen for the full analysis.</p>
          </div>
          {game.final_summary && (
            <div className="card glow-blue p-3 sm:p-5">
              <p className="label text-blue-400 mb-2">Post-Game Analysis</p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {game.final_summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Round History */}
      {pastRounds.length > 0 && game?.status !== "lobby" && (
        <div className="mt-3 sm:mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-secondary w-full py-2.5 text-xs sm:text-sm"
          >
            {showHistory ? "Hide" : "Show"} Round History ({pastRounds.length} round{pastRounds.length !== 1 ? "s" : ""})
          </button>
          {showHistory && (
            <div className="mt-2 space-y-2">
              {pastRounds.map((round) => (
                <div key={round.id} className="card p-3 sm:p-4">
                  <p className="label text-slate-500 mb-1">Round {round.round_number} — {round.world_state_snapshot?.year}</p>
                  <p className="text-xs text-slate-400 font-semibold mb-1.5">{round.world_events}</p>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{round.narrative}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
