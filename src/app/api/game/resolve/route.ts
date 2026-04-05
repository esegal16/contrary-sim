import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resolveRound, generateEndgameSummary } from "@/lib/game-master";
import { Team, Action, Round } from "@/lib/types";

export async function POST(request: Request) {
  const { gameId } = await request.json();

  const { data: game } = await supabase
    .from("sim_games")
    .select()
    .eq("id", gameId)
    .single();

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  await supabase
    .from("sim_rounds")
    .update({ phase: "resolving" })
    .eq("game_id", gameId)
    .eq("round_number", game.current_round);

  const { data: teams } = await supabase
    .from("sim_teams")
    .select()
    .eq("game_id", gameId);

  const { data: actions } = await supabase
    .from("sim_actions")
    .select()
    .eq("game_id", gameId)
    .eq("round_number", game.current_round);

  const { data: previousRounds } = await supabase
    .from("sim_rounds")
    .select("narrative")
    .eq("game_id", gameId)
    .lt("round_number", game.current_round)
    .order("round_number");

  const previousNarratives = (previousRounds || [])
    .map((r: Pick<Round, "narrative">) => r.narrative)
    .filter(Boolean);

  const result = await resolveRound(
    game.current_round,
    game.world_state,
    (teams || []) as Team[],
    (actions || []) as Action[],
    previousNarratives
  );

  await supabase
    .from("sim_rounds")
    .update({
      phase: "resolved",
      narrative: result.narrative,
      world_events: result.world_events,
      world_state_snapshot: result.updated_world_state,
      resolved_at: new Date().toISOString(),
    })
    .eq("game_id", gameId)
    .eq("round_number", game.current_round);

  await supabase
    .from("sim_games")
    .update({ world_state: result.updated_world_state })
    .eq("id", gameId);

  // Save previous metrics, then update to new metrics
  for (const update of result.team_updates) {
    const team = (teams || []).find(
      (t: Team) => t.slug === update.team_slug
    );
    if (team) {
      await supabase
        .from("sim_teams")
        .update({
          previous_metrics: team.metrics,
          metrics: update.metrics,
          secret_briefing: update.private_feedback,
        })
        .eq("id", team.id);
    }
  }

  // Generate end-game summary if this was the final round
  if (game.current_round >= game.total_rounds) {
    const updatedTeams = (teams || []).map((t: Team) => {
      const update = result.team_updates.find((u) => u.team_slug === t.slug);
      return update ? { ...t, metrics: update.metrics } : t;
    });

    const allNarratives = [...previousNarratives, result.narrative];

    const summary = await generateEndgameSummary(
      result.updated_world_state,
      updatedTeams as Team[],
      allNarratives
    );

    await supabase
      .from("sim_games")
      .update({ final_summary: summary, status: "finished" })
      .eq("id", gameId);

    return NextResponse.json({ result, final_summary: summary });
  }

  return NextResponse.json({ result });
}
