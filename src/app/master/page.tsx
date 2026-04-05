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
  resolving: "RESOLVING...",
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
  low: "text-green-400",
  moderate: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-500",
};

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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_games", filter: `id=eq.${game.id}` },
        (payload) => {
          if (payload.new) setGame(payload.new as Game);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_teams", filter: `game_id=eq.${game.id}` },
        () => {
          supabase
            .from("sim_teams")
            .select()
            .eq("game_id", game.id)
            .then(({ data }) => {
              if (data) setTeams(data as Team[]);
            });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_rounds", filter: `game_id=eq.${game.id}` },
        (payload) => {
          if (payload.new) setCurrentRound(payload.new as Round);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sim_actions", filter: `game_id=eq.${game.id}` },
        () => {
          if (game.current_round > 0) {
            supabase
              .from("sim_actions")
              .select()
              .eq("game_id", game.id)
              .eq("round_number", game.current_round)
              .then(({ data }) => {
                if (data) setActions(data as Action[]);
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    await fetch("/api/game/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    });
    setLoading(false);
  };

  const resolveRound = async () => {
    if (!game) return;
    setLoading(true);
    await fetch("/api/game/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    });
    setLoading(false);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">CONTRARY SIM</h1>
          <p className="text-gray-400 text-lg sm:text-xl mb-8">AI Geopolitics Simulation</p>
          <button
            onClick={createGame}
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-500 text-white text-lg sm:text-xl px-8 py-4 rounded-lg font-semibold disabled:opacity-50 transition-colors"
          >
            {creating ? "Creating..." : "Create New Game"}
          </button>
        </div>
      </div>
    );
  }

  const ws = game.world_state;
  const timeline = game.current_round > 0 ? ROUND_TIMELINE[game.current_round - 1] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">CONTRARY SIM</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Game: {game.id.slice(0, 8)}</p>
        </div>
        {game.status === "lobby" && (
          <div className="text-right">
            <p className="text-yellow-400 text-sm sm:text-lg font-semibold mb-1">
              LOBBY
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Waiting for teams
            </p>
          </div>
        )}
        {currentRound && (
          <div className="text-right">
            <p className="text-lg sm:text-2xl font-bold">
              Round {game.current_round}/{game.total_rounds}
            </p>
            <p className="text-gray-400 text-xs sm:text-base">{timeline?.era}</p>
          </div>
        )}
      </div>

      {/* Phase Banner */}
      {currentRound && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Phase</p>
              <p className="text-xl sm:text-3xl font-bold text-blue-400">
                {PHASE_LABELS[currentRound.phase] || currentRound.phase}
              </p>
              <p className="text-gray-400 text-sm mt-1 hidden sm:block">
                {PHASE_DESCRIPTIONS[currentRound.phase]}
              </p>
            </div>
            {currentRound.phase === "submit" && (
              <div className="text-right">
                <p className="text-sm sm:text-lg font-semibold text-green-400">
                  {actions.length}/{teams.length}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">submitted</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* World State Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: "AI Progress", value: ws.global_metrics.ai_progress, color: "bg-blue-500" },
          { label: "Econ Stability", value: ws.global_metrics.economic_stability, color: "bg-green-500" },
          { label: "Alignment", value: ws.global_metrics.alignment_confidence, color: "bg-yellow-500" },
          { label: "Geo Risk", value: ws.global_metrics.geopolitical_risk, color: "bg-red-500" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-2xl sm:text-3xl font-bold">{m.value}</p>
            <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2 mt-2">
              <div
                className={`${m.color} h-1.5 sm:h-2 rounded-full transition-all`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* World Summary + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">World State — {ws.year}</p>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3">{ws.summary}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            AI Level: <span className="text-gray-300">{ws.ai_capability_level}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Tension:{" "}
            <span className={TENSION_COLORS[ws.geopolitical_tension]}>
              {ws.geopolitical_tension.toUpperCase()}
            </span>
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Key Events</p>
          <ul className="space-y-2">
            {ws.key_events.map((event, i) => (
              <li key={i} className="text-xs sm:text-sm text-gray-300 flex gap-2">
                <span className="text-blue-400 shrink-0">&#9656;</span>
                {event}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Narrative */}
      {currentRound?.narrative && (
        <div className="bg-gray-900 border border-blue-900 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="text-xs text-blue-400 uppercase tracking-widest mb-3">
            Round {currentRound.round_number} — What Happened
          </p>
          <p className="text-sm sm:text-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
            {currentRound.narrative}
          </p>
        </div>
      )}

      {/* Team Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 sm:mb-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4">
            <p className="font-bold text-xs sm:text-sm mb-2 truncate">{team.name}</p>
            <div className="space-y-1">
              {Object.entries(team.metrics).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-gray-500 truncate mr-2">{key}</span>
                  <span className="font-mono">{value as number}</span>
                </div>
              ))}
            </div>
            {currentRound?.phase === "submit" && (
              <div className="mt-2 pt-2 border-t border-gray-800">
                <span
                  className={`text-[10px] sm:text-xs ${
                    actions.some((a) => a.team_id === team.id)
                      ? "text-green-400"
                      : "text-gray-600"
                  }`}
                >
                  {actions.some((a) => a.team_id === team.id)
                    ? "Submitted"
                    : "Waiting..."}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Join Codes (lobby) */}
      {game.status === "lobby" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
            Team Join Codes — Share with players
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="text-center">
                <p className="text-xs sm:text-sm font-semibold mb-1 truncate">{team.name}</p>
                <p className="text-xl sm:text-2xl font-mono font-bold text-blue-400">
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
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-50 transition-colors"
          >
            {loading
              ? "Loading..."
              : game.current_round === 0
              ? "Start Game — Round 1"
              : game.current_round >= game.total_rounds
              ? "End Game"
              : `Start Round ${game.current_round + 1}`}
          </button>
        )}
        {currentRound &&
          currentRound.phase !== "resolved" &&
          currentRound.phase !== "resolving" && (
            <button
              onClick={advancePhase}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-50 transition-colors"
            >
              {loading ? "Loading..." : "Next Phase"}
            </button>
          )}
        {currentRound?.phase === "submit" && (
          <button
            onClick={resolveRound}
            disabled={loading || actions.length === 0}
            className="bg-amber-600 hover:bg-amber-500 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-50 transition-colors"
          >
            {loading ? "Simulating..." : `Resolve Round (${actions.length}/${teams.length})`}
          </button>
        )}
      </div>

      {/* Game over */}
      {game.status === "finished" && (
        <div className="bg-gray-900 border border-yellow-700 rounded-xl p-6 sm:p-8 mt-4 sm:mt-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4">SIMULATION COMPLETE</h2>
          <p className="text-gray-400 text-base sm:text-lg">Final world state: {ws.year}</p>
        </div>
      )}
    </div>
  );
}
