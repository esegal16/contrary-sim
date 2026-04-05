"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Game, Team, Round } from "@/lib/types";

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

  const loadTeamState = useCallback(async (teamId: string) => {
    const { data: teamData } = await supabase
      .from("sim_teams")
      .select()
      .eq("id", teamId)
      .single();

    if (!teamData) return;
    setTeam(teamData as Team);

    const { data: gameData } = await supabase
      .from("sim_games")
      .select()
      .eq("id", teamData.game_id)
      .single();

    if (gameData) {
      setGame(gameData as Game);

      if (gameData.current_round > 0) {
        const { data: roundData } = await supabase
          .from("sim_rounds")
          .select()
          .eq("game_id", gameData.id)
          .eq("round_number", gameData.current_round)
          .single();
        if (roundData) setCurrentRound(roundData as Round);

        const { data: existing } = await supabase
          .from("sim_actions")
          .select()
          .eq("team_id", teamId)
          .eq("round_number", gameData.current_round)
          .single();
        if (existing) {
          setSubmitted(true);
          setActionText(existing.action_text);
        } else {
          setSubmitted(false);
          setActionText("");
        }
      }
    }
  }, []);

  const handleJoin = async () => {
    setJoining(true);
    const { data } = await supabase
      .from("sim_teams")
      .select()
      .eq("join_code", joinCode.trim().toLowerCase())
      .single();

    if (data) {
      localStorage.setItem("teamId", data.id);
      await loadTeamState(data.id);
    } else {
      alert("Invalid join code");
    }
    setJoining(false);
  };

  useEffect(() => {
    const teamId =
      new URLSearchParams(window.location.search).get("team") ||
      localStorage.getItem("teamId");
    if (teamId) loadTeamState(teamId);
  }, [loadTeamState]);

  useEffect(() => {
    if (!team || !game) return;

    const channel = supabase
      .channel(`team-${team.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_games", filter: `id=eq.${game.id}` },
        (payload) => {
          if (payload.new) setGame(payload.new as Game);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_teams", filter: `id=eq.${team.id}` },
        (payload) => {
          if (payload.new) setTeam(payload.new as Team);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_rounds", filter: `game_id=eq.${game.id}` },
        (payload) => {
          if (payload.new) {
            const round = payload.new as Round;
            if (round.round_number === game.current_round || round.round_number === game.current_round + 1) {
              setCurrentRound(round);
              if (round.round_number > (currentRound?.round_number || 0)) {
                setSubmitted(false);
                setActionText("");
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [team?.id, game?.id, game?.current_round, team, game, currentRound?.round_number]);

  const submitAction = async () => {
    if (!team || !game || !actionText.trim()) return;
    setSubmitting(true);

    await fetch("/api/game/submit-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: team.id,
        gameId: game.id,
        roundNumber: game.current_round,
        actionText: actionText.trim(),
      }),
    });

    setSubmitted(true);
    setSubmitting(false);
  };

  // Join screen
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2 text-center">CONTRARY SIM</h1>
          <p className="text-gray-500 text-center mb-8">Enter your team join code</p>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="e.g. a3f2b1"
            autoComplete="off"
            autoCapitalize="none"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-2xl font-mono text-center mb-4 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <button
            onClick={handleJoin}
            disabled={joining || !joinCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
          >
            {joining ? "Joining..." : "Join Game"}
          </button>
        </div>
      </div>
    );
  }

  const ws = game?.world_state;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 sm:p-4 max-w-2xl mx-auto pb-8">
      {/* Team Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 mb-3 sm:mb-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
          <h1 className="text-lg sm:text-xl font-bold leading-tight">{team.name}</h1>
          {game && (
            <span className="text-xs sm:text-sm text-gray-500 shrink-0">
              R{game.current_round}/{game.total_rounds}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{team.role_description}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {Object.entries(team.metrics).map(([key, value]) => (
          <div key={key} className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 sm:p-3">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{key}</p>
            <div className="flex items-center gap-2 sm:gap-3 mt-1">
              <p className="text-xl sm:text-2xl font-bold font-mono">{value as number}</p>
              <div className="flex-1 bg-gray-800 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all"
                  style={{ width: `${value as number}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secret Briefing */}
      {team.secret_briefing && (
        <div className="bg-gray-900 border border-amber-900/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest mb-1.5 sm:mb-2">
            {currentRound?.phase === "resolved" ? "Round Outcome — Eyes Only" : "Intel Briefing — Eyes Only"}
          </p>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{team.secret_briefing}</p>
        </div>
      )}

      {/* Current Phase */}
      {currentRound && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-5 mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-xs text-blue-400 uppercase tracking-widest mb-1">
            {currentRound.phase.replace("_", " ")}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            {PHASE_INSTRUCTIONS[currentRound.phase]}
          </p>
        </div>
      )}

      {/* World State Summary */}
      {ws && currentRound && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1.5 sm:mb-2">
            World — {ws.year}
          </p>
          <p className="text-xs sm:text-sm text-gray-300 mb-2">{ws.summary}</p>
          <div className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
            <span>AI: {ws.global_metrics.ai_progress}</span>
            <span>Econ: {ws.global_metrics.economic_stability}</span>
            <span>Risk: {ws.global_metrics.geopolitical_risk}</span>
          </div>
        </div>
      )}

      {/* Narrative */}
      {currentRound?.narrative && (
        <div className="bg-gray-900 border border-blue-900 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-xs text-blue-400 uppercase tracking-widest mb-1.5 sm:mb-2">What Happened</p>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
            {currentRound.narrative}
          </p>
        </div>
      )}

      {/* Action Input */}
      {currentRound?.phase === "submit" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-5">
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-2 sm:mb-3">
            Your Actions This Round
          </p>
          <textarea
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            disabled={submitted}
            placeholder={`As ${team.name}, what do you do?\n\n- Impose export controls on...\n- Secretly negotiate with...\n- Invest $X billion in...`}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 text-sm min-h-[140px] sm:min-h-[160px] focus:outline-none focus:border-blue-500 disabled:opacity-60 resize-none"
          />
          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
            <p className="text-[10px] sm:text-xs text-gray-600">
              {submitted ? "Submitted. Waiting..." : "1-3 actions."}
            </p>
            <button
              onClick={submitAction}
              disabled={submitting || submitted || !actionText.trim()}
              className={`px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm transition-colors shrink-0 ${
                submitted
                  ? "bg-green-800 text-green-300"
                  : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white disabled:opacity-50"
              }`}
            >
              {submitted ? "Submitted" : submitting ? "..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Waiting states */}
      {currentRound?.phase === "resolving" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 text-center">
          <div className="animate-pulse text-xl sm:text-2xl mb-2">Simulating...</div>
          <p className="text-gray-500 text-xs sm:text-sm">Processing all teams&apos; actions.</p>
        </div>
      )}

      {game?.status === "lobby" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 text-center">
          <p className="text-lg sm:text-xl font-semibold text-yellow-400 mb-2">Waiting for game to start</p>
          <p className="text-gray-500 text-xs sm:text-sm">The game master will begin Round 1 shortly.</p>
        </div>
      )}

      {game?.status === "finished" && (
        <div className="bg-gray-900 border border-yellow-700 rounded-xl p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">GAME OVER</h2>
          <p className="text-gray-400 text-sm">Final metrics above.</p>
        </div>
      )}
    </div>
  );
}
