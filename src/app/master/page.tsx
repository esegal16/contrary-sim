"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Game, Team, Round, Action } from "@/lib/types";
import { ROUND_TIMELINE } from "@/lib/game-config";

const PHASE_LABELS: Record<string, string> = {
  briefing: "BRIEFING",
  open_forum: "OPEN FORUM",
  caucus: "PRIVATE CAUCUS",
  submit: "SUBMIT ACTIONS",
  resolving: "RESOLVING",
  resolved: "ROUND RESOLVED",
};

const PHASE_DESCRIPTIONS: Record<string, string> = {
  briefing: "Review the current world state and events.",
  open_forum: "All teams discuss openly — make your case, propose deals, posture.",
  caucus: "Break into private groups. Make side deals. Scheme.",
  submit: "Each team submits their actions privately.",
  resolving: "The simulation is processing all actions...",
  resolved: "See what happened.",
};

const TENSION_COLORS: Record<string, string> = {
  low: "text-emerald-400",
  moderate: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

const METRIC_COLORS = [
  { bar: "bg-blue-500", glow: "shadow-blue-500/20" },
  { bar: "bg-emerald-500", glow: "shadow-emerald-500/20" },
  { bar: "bg-amber-500", glow: "shadow-amber-500/20" },
  { bar: "bg-red-500", glow: "shadow-red-500/20" },
];

export default function MasterView() {
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadGame = useCallback(async (gameId: string) => {
    const [gameRes, teamsRes] = await Promise.all([
      supabase.from("sim_games").select().eq("id", gameId).single(),
      supabase.from("sim_teams").select().eq("game_id", gameId),
    ]);
    if (gameRes.data) setGame(gameRes.data as Game);
    if (teamsRes.data) setTeams(teamsRes.data as Team[]);

    if (gameRes.data?.current_round > 0) {
      const roundRes = await supabase
        .from("sim_rounds")
        .select()
        .eq("game_id", gameId)
        .eq("round_number", gameRes.data.current_round)
        .single();
      if (roundRes.data) setCurrentRound(roundRes.data as Round);

      const actionsRes = await supabase
        .from("sim_actions")
        .select()
        .eq("game_id", gameId)
        .eq("round_number", gameRes.data.current_round);
      if (actionsRes.data) setActions(actionsRes.data as Action[]);
    }
  }, []);

  useEffect(() => {
    const gameId = new URLSearchParams(window.location.search).get("game");
    if (gameId) loadGame(gameId);
  }, [loadGame]);

  useEffect(() => {
    if (!game) return;
    const channel = supabase
      .channel(`master-${game.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_games", filter: `id=eq.${game.id}` }, (payload) => {
        if (payload.new) setGame(payload.new as Game);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_teams", filter: `game_id=eq.${game.id}` }, () => {
        supabase.from("sim_teams").select().eq("game_id", game.id).then(({ data }) => { if (data) setTeams(data as Team[]); });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_rounds", filter: `game_id=eq.${game.id}` }, (payload) => {
        if (payload.new) setCurrentRound(payload.new as Round);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "sim_actions", filter: `game_id=eq.${game.id}` }, () => {
        if (game.current_round > 0) {
          supabase.from("sim_actions").select().eq("game_id", game.id).eq("round_number", game.current_round).then(({ data }) => { if (data) setActions(data as Action[]); });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [game?.id, game?.current_round, game]);

  const createGame = async () => {
    setCreating(true);
    const res = await fetch("/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Contrary Research Retreat — AI Geopolitics" }),
    });
    const data = await res.json();
    window.history.replaceState(null, "", `?game=${data.game.id}`);
    setGame(data.game as Game);
    setTeams(data.teams as Team[]);
    setCreating(false);
  };

  const advancePhase = async () => {
    if (!game) return;
    setLoading(true);
    await fetch("/api/game/advance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameId: game.id }) });
    setLoading(false);
  };

  const resolveRound = async () => {
    if (!game) return;
    setLoading(true);
    await fetch("/api/game/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameId: game.id }) });
    setLoading(false);
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        <div className="text-center relative z-10">
          <p className="label text-blue-400 mb-3 tracking-[0.2em]">Game Master Console</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            CONTRARY
          </h1>
          <button
            onClick={createGame}
            disabled={creating}
            className="btn btn-primary text-lg px-8 py-4 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create New Game"}
          </button>
        </div>
      </div>
    );
  }

  const ws = game.world_state;
  const timeline = game.current_round > 0 ? ROUND_TIMELINE[game.current_round - 1] : null;
  const globalMetrics = [
    { label: "AI Progress", value: ws.global_metrics.ai_progress, ...METRIC_COLORS[0] },
    { label: "Econ Stability", value: ws.global_metrics.economic_stability, ...METRIC_COLORS[1] },
    { label: "Alignment", value: ws.global_metrics.alignment_confidence, ...METRIC_COLORS[2] },
    { label: "Geo Risk", value: ws.global_metrics.geopolitical_risk, ...METRIC_COLORS[3] },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">CONTRARY</h1>
          <p className="text-slate-600 text-xs font-mono">{game.id.slice(0, 8)}</p>
        </div>
        {game.status === "lobby" && (
          <div className="card px-3 py-1.5 sm:px-4 sm:py-2">
            <p className="text-yellow-400 text-xs sm:text-sm font-semibold">LOBBY</p>
          </div>
        )}
        {currentRound && (
          <div className="text-right">
            <p className="text-lg sm:text-2xl font-bold font-mono text-white">
              {game.current_round}<span className="text-slate-600">/{game.total_rounds}</span>
            </p>
            <p className="text-slate-500 text-xs sm:text-sm">{timeline?.era}</p>
          </div>
        )}
      </div>

      {/* Phase Banner */}
      {currentRound && (
        <div className={`card-bright p-4 sm:p-6 mb-4 sm:mb-6 ${currentRound.phase === "resolving" ? "glow-amber" : "glow-blue"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="label mb-1">Current Phase</p>
              <p className={`text-xl sm:text-3xl font-bold ${currentRound.phase === "resolving" ? "text-amber-400 animate-pulse-glow" : "text-blue-400"}`}>
                {PHASE_LABELS[currentRound.phase] || currentRound.phase}
              </p>
              <p className="text-slate-500 text-sm mt-1 hidden sm:block">
                {PHASE_DESCRIPTIONS[currentRound.phase]}
              </p>
            </div>
            {currentRound.phase === "submit" && (
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                  {actions.length}<span className="text-slate-600">/{teams.length}</span>
                </p>
                <p className="label text-emerald-500 hidden sm:block">submitted</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* World State Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {globalMetrics.map((m) => (
          <div key={m.label} className="card p-3 sm:p-4">
            <p className="label mb-1.5">{m.label}</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-white">{m.value}</p>
            <div className="w-full bg-slate-800/50 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className={`${m.bar} h-1.5 rounded-full transition-all duration-700 bar-shimmer`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* World Summary + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="lg:col-span-2 card p-4 sm:p-5">
          <p className="label mb-2">World State — {ws.year}</p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3">{ws.summary}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
            <p className="text-slate-500">
              AI: <span className="text-slate-300">{ws.ai_capability_level}</span>
            </p>
            <p className="text-slate-500">
              Tension:{" "}
              <span className={TENSION_COLORS[ws.geopolitical_tension]}>
                {ws.geopolitical_tension.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="label mb-2">Key Events</p>
          <ul className="space-y-2">
            {ws.key_events.map((event, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-300 flex gap-2">
                <span className="text-blue-400/60 shrink-0 mt-0.5">&#9656;</span>
                {event}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Narrative */}
      {currentRound?.narrative && (
        <div className="card glow-blue p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="label text-blue-400 mb-3">
            Round {currentRound.round_number} — What Happened
          </p>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap">
            {currentRound.narrative}
          </p>
        </div>
      )}

      {/* Team Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {teams.map((team) => {
          const hasSubmitted = actions.some((a) => a.team_id === team.id);
          return (
            <div key={team.id} className={`card p-3 sm:p-4 ${currentRound?.phase === "submit" && hasSubmitted ? "glow-green" : ""}`}>
              <p className="font-semibold text-xs sm:text-sm mb-2 truncate text-white">{team.name}</p>
              <div className="space-y-1.5">
                {Object.entries(team.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-500 truncate mr-2">{key}</span>
                    <span className="font-mono font-semibold text-slate-300">{value as number}</span>
                  </div>
                ))}
              </div>
              {currentRound?.phase === "submit" && (
                <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                  <span className={`text-[10px] sm:text-xs font-medium ${hasSubmitted ? "text-emerald-400" : "text-slate-600"}`}>
                    {hasSubmitted ? "Submitted" : "Waiting..."}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Join Codes (lobby) */}
      {game.status === "lobby" && (
        <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="label mb-4">Team Join Codes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="text-center">
                <p className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 truncate">{team.name}</p>
                <p className="text-xl sm:text-2xl font-mono font-bold text-blue-400 tracking-wider">
                  {team.join_code}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {(game.status === "lobby" || currentRound?.phase === "resolved") && (
          <button
            onClick={advancePhase}
            disabled={loading}
            className="btn btn-primary px-5 sm:px-6 py-3 text-sm sm:text-base disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : game.current_round === 0
              ? "Start Game"
              : game.current_round >= game.total_rounds
              ? "End Game"
              : `Start Round ${game.current_round + 1}`}
          </button>
        )}
        {currentRound && currentRound.phase !== "resolved" && currentRound.phase !== "resolving" && (
          <button
            onClick={advancePhase}
            disabled={loading}
            className="btn btn-secondary px-5 sm:px-6 py-3 text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Loading..." : "Next Phase"}
          </button>
        )}
        {currentRound?.phase === "submit" && (
          <button
            onClick={resolveRound}
            disabled={loading || actions.length === 0}
            className="btn btn-amber px-5 sm:px-6 py-3 text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Simulating..." : `Resolve Round (${actions.length}/${teams.length})`}
          </button>
        )}
      </div>

      {/* Game over */}
      {game.status === "finished" && (
        <div className="card glow-amber p-6 sm:p-8 mt-4 sm:mt-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-3">
            SIMULATION COMPLETE
          </h2>
          <p className="text-slate-500">Final world state: {ws.year}</p>
        </div>
      )}
    </div>
  );
}
