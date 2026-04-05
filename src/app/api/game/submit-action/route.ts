import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { teamId, gameId, roundNumber, actionText } = await request.json();

  if (!actionText?.trim()) {
    return NextResponse.json(
      { error: "Action text is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("sim_actions")
    .upsert(
      {
        team_id: teamId,
        game_id: gameId,
        round_number: roundNumber,
        action_text: actionText.trim(),
      },
      { onConflict: "team_id,round_number" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ action: data });
}
