import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resolveRound } from "@/lib/game-master";
import { Team, Action, Round } from "@/lib/types";

export async function POST(request: Request) {
  const { gameId } = await request.json();

  // Get game
  const { data: game } = await supabase
    .from("sim_games")
    .select()
    .eq("id", gameId)
    .single();

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Set round phase to resolving
  await supabase
    .from("sim_rounds")
    .update({ phase: "resolving" })
    .eq("game_id", gameId)
    .eq("round_number", game.current_round);

  // Get teams
  const { data: teams } = await supabase
    .from("sim_teams")
    .select()
    .eq("game_id", gameId);

  // Get actions for current round
  const { data: actions } = await supabase
    .from("sim_actions")
    .select()
    .eq("game_id", gameId)
    .eq("round_number", game.current_round);

  // Get previous narratives
  const { data: previousRounds } = await supabase
    .from("sim_rounds")
    .select("narrative")
    .eq("game_id", gameId)
    .lt("round_number", game.current_round)
    .order("round_number");

  const previousNarratives = (previousRounds || [])
    .map((r: Pick<Round, "narrative">) => r.narrative)
    .filter(Boolean);

  // Call LLM to resolve
  const result = await resolveRound(
    game.current_round,
    game.world_state,
    (teams || []) as Team[],
    (actions || []) as Action[],
    previousNarratives
  );

  // Update round with narrative
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

  // Update game world state
  await supabase
    .from("sim_games")
    .update({ world_state: result.updated_world_state })
    .eq("id", gameId);

  // Update each team's metrics
  for (const update of result.team_updates) {
    const team = (teams || []).find(
      (t: Team) => t.slug === update.team_slug
    );
    if (team) {
      await supabase
        .from("sim_teams")
        .update({
          metrics: update.metrics,
          secret_briefing: update.private_feedback,
        })
        .eq("id", team.id);
    }
  }

  return NextResponse.json({ result });
}
