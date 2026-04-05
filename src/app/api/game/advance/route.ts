import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ROUND_TIMELINE } from "@/lib/game-config";

const PHASE_ORDER = [
  "briefing",
  "open_forum",
  "caucus",
  "submit",
  "resolving",
] as const;

export async function POST(request: Request) {
  const { gameId } = await request.json();

  // Get current game state
  const { data: game } = await supabase
    .from("sim_games")
    .select()
    .eq("id", gameId)
    .single();

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Get current round
  const { data: currentRound } = await supabase
    .from("sim_rounds")
    .select()
    .eq("game_id", gameId)
    .eq("round_number", game.current_round)
    .single();

  // If no round exists or current round is resolved, start next round
  if (!currentRound || currentRound.phase === "resolved") {
    const nextRoundNum = game.current_round + 1;

    if (nextRoundNum > game.total_rounds) {
      // Game over
      await supabase
        .from("sim_games")
        .update({ status: "finished" })
        .eq("id", gameId);
      return NextResponse.json({ phase: "finished", round: game.current_round });
    }

    const timeline = ROUND_TIMELINE[nextRoundNum - 1];

    // Create new round
    const { data: newRound } = await supabase
      .from("sim_rounds")
      .insert({
        game_id: gameId,
        round_number: nextRoundNum,
        phase: "briefing",
        world_events: `Round ${nextRoundNum}: ${timeline.era} (${timeline.period})`,
        world_state_snapshot: game.world_state,
      })
      .select()
      .single();

    // Update game
    await supabase
      .from("sim_games")
      .update({ current_round: nextRoundNum, status: "running" })
      .eq("id", gameId);

    return NextResponse.json({ phase: "briefing", round: nextRoundNum, data: newRound });
  }

  // Advance to next phase
  const currentPhaseIdx = PHASE_ORDER.indexOf(
    currentRound.phase as (typeof PHASE_ORDER)[number]
  );
  if (currentPhaseIdx === -1 || currentPhaseIdx >= PHASE_ORDER.length - 1) {
    return NextResponse.json({
      phase: currentRound.phase,
      round: currentRound.round_number,
      message: "Cannot advance further — resolve the round first",
    });
  }

  const nextPhase = PHASE_ORDER[currentPhaseIdx + 1];

  await supabase
    .from("sim_rounds")
    .update({ phase: nextPhase })
    .eq("id", currentRound.id);

  return NextResponse.json({
    phase: nextPhase,
    round: currentRound.round_number,
  });
}
