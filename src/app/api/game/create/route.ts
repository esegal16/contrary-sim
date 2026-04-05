import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_TEAMS, INITIAL_WORLD_STATE } from "@/lib/game-config";

export async function POST(request: Request) {
  const { name } = await request.json();

  // Create game
  const { data: game, error: gameError } = await supabase
    .from("sim_games")
    .insert({
      name: name || "AI Geopolitics Simulation",
      status: "lobby",
      current_round: 0,
      total_rounds: 6,
      world_state: INITIAL_WORLD_STATE,
      config: { scenario: "ai-2027", round_duration_seconds: 120 },
    })
    .select()
    .single();

  if (gameError) {
    return NextResponse.json({ error: gameError.message }, { status: 500 });
  }

  // Create teams
  const teams = DEFAULT_TEAMS.map((t) => ({
    game_id: game.id,
    slug: t.slug,
    name: t.name,
    role_description: t.role_description,
    secret_briefing: t.secret_briefing,
    metrics: t.starting_metrics,
  }));

  const { data: createdTeams, error: teamsError } = await supabase
    .from("sim_teams")
    .insert(teams)
    .select();

  if (teamsError) {
    return NextResponse.json({ error: teamsError.message }, { status: 500 });
  }

  return NextResponse.json({ game, teams: createdTeams });
}
