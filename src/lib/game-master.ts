import Anthropic from "@anthropic-ai/sdk";
import { WorldState, Team, Action, ResolutionResult } from "./types";
import { ROUND_TIMELINE } from "./game-config";

function getAnthropic() {
  return new Anthropic();
}

const SYSTEM_PROMPT = `You are the Game Master for a geopolitical AI simulation game inspired by the AI 2027 scenario (ai-2027.com).

You simulate the consequences of simultaneous decisions made by 5 teams representing global actors in the AI race: US Government, China Government, OpenBrain (leading AI lab), Prometheus AI (safety-focused lab), and the EU/Global Coalition.

Your role:
1. EVALUATE each team's submitted actions for plausibility given their role and resources
2. SIMULATE the combined outcome of all actions interacting together — actions don't happen in isolation
3. NARRATE what happened in a compelling, news-briefing style (2-3 paragraphs)
4. UPDATE each team's metrics (0-100 scale) based on outcomes — actions have TRADE-OFFS, never pure upside
5. PROVIDE private feedback to each team about the consequences of their specific actions

Key principles:
- NO FREE LUNCHES. Aggressive moves create backlash. Cooperation creates vulnerability. Everything has a cost.
- SECOND-ORDER EFFECTS matter. Export controls might push China to invest harder in domestic chips. Open-sourcing a model might commoditize your own business.
- ESCALATION is natural. As AI capabilities increase, stakes get higher, tensions rise, mistakes are costlier.
- REALISM grounded in the AI 2027 scenario's logic: compute constraints, alignment challenges, espionage dynamics, public backlash cycles.
- Be FAIR but not neutral — better strategies should produce better outcomes. Creativity and cleverness should be rewarded.
- Metrics should move 5-15 points per round typically. Dramatic swings (20+) only for truly consequential actions or crises.

The game follows an accelerating AI timeline from mid-2026 to mid-2028.`;

export async function resolveRound(
  roundNumber: number,
  currentWorldState: WorldState,
  teams: Team[],
  actions: Action[],
  previousNarratives: string[]
): Promise<ResolutionResult> {
  const timeline = ROUND_TIMELINE[roundNumber - 1];

  const teamActions = teams.map((team) => {
    const action = actions.find((a) => a.team_id === team.id);
    return {
      team: team.name,
      slug: team.slug,
      current_metrics: team.metrics,
      action: action?.action_text || "[NO ACTION SUBMITTED — team is paralyzed by indecision]",
    };
  });

  const userPrompt = `## Round ${roundNumber} of 6: "${timeline.era}" (${timeline.period})

### Current World State
${JSON.stringify(currentWorldState, null, 2)}

### Previous Round Narratives
${previousNarratives.length > 0 ? previousNarratives.map((n, i) => `Round ${i + 1}: ${n}`).join("\n\n") : "This is the first round."}

### Team Actions This Round
${teamActions.map((ta) => `**${ta.team}** (${ta.slug})
Current metrics: ${JSON.stringify(ta.current_metrics)}
Actions: ${ta.action}`).join("\n\n")}

---

Resolve this round. Return your response as JSON matching this exact structure:
{
  "narrative": "2-3 paragraph news-style briefing of what happened this round, written for display on the master screen. Dramatic, concrete, specific. Reference team names and their actions. End with a forward-looking hook for the next round.",
  "world_events": "A short summary sentence of the key headline event.",
  "updated_world_state": {
    "year": "${timeline.period}",
    "summary": "Updated 2-3 sentence world state summary",
    "ai_capability_level": "Description of current AI capabilities",
    "geopolitical_tension": "low|moderate|high|critical",
    "public_sentiment": "Current public mood and key stats",
    "key_events": ["3-5 bullet point events from this round"],
    "global_metrics": {
      "ai_progress": <number 0-100>,
      "economic_stability": <number 0-100>,
      "alignment_confidence": <number 0-100>,
      "geopolitical_risk": <number 0-100>
    }
  },
  "team_updates": [
    {
      "team_slug": "<slug>",
      "metrics": { "<metric_name>": <number 0-100>, ... },
      "private_feedback": "1-2 sentences explaining what happened to this team specifically and why their metrics changed. This is shown only to the team."
    }
  ]
}

Return ONLY valid JSON, no markdown fences or extra text.`;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — strip markdown fences if present
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as ResolutionResult;
}
