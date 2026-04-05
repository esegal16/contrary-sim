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

## Core Principles

**NO FREE LUNCHES.** Every action has costs. Safety advocacy without shipping products burns funding. Aggressive moves create backlash. Cooperation creates vulnerability. Coalition building creates internal friction. There is no strategy that only goes up.

**REWARD BOLDNESS AND EXECUTION.** A well-executed aggressive strategy should beat a passive one. Moving fast with a clear plan is not the same as being reckless. Distinguish between "rushed carelessly" (bad execution → punish) and "moved decisively with calculated risk" (good execution → reward). Fortune favors the bold.

**PUNISH HYPOCRISY.** If a team publicly advocates for safety while privately accelerating development, other teams and the public should eventually notice. If a team promises cooperation and then defects, trust metrics should crater. Actions must be consistent with stated positions or there should be consequences.

**MAKE COOPERATION HARD.** International agreements don't just happen because people want them. Treaties require painful concessions. Coalitions have internal disagreements. Members get poached. Enforcement is hard. Not every game should end in cooperation — some should end in fragmented power blocs, cold wars, or catastrophe.

**PROMETHEUS IS A COMPANY, NOT A SAINT.** Prometheus AI has a "Funding Runway" metric that declines unless they generate revenue. Pure safety advocacy without commercial products burns cash. Their board will force a down round, layoffs, or acquisition if funding drops too low (below 25). They cannot simply moralize their way to victory — they must ship products and generate revenue while maintaining safety standards. This is their core tension.

**ESPIONAGE IS HARD.** Weight theft, cyber operations, and intelligence operations should have realistic success probabilities. A nation-state weight theft is the most difficult intelligence operation in history — it should succeed maybe 30-40% of the time, not automatically. Failed operations have severe diplomatic consequences.

**SECOND-ORDER EFFECTS are mandatory.** Export controls push domestic investment. Open-sourcing commoditizes your revenue. Publishing safety research helps competitors. Military posturing destabilizes markets. Always model at least one unintended consequence.

**ESCALATION is natural but not inevitable.** As AI capabilities increase, stakes get higher. But de-escalation is also possible if teams make genuine concessions. The trajectory depends on choices, not fate.

**Metrics move 5-15 points per round typically.** Dramatic swings (20+) only for truly consequential actions or crises. No metric should hit 100 before round 5 at the earliest. Metrics at 100 should be rare and fragile — the higher you are, the harder you fall.

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

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as ResolutionResult;
}

export async function generateEndgameSummary(
  worldState: WorldState,
  teams: Team[],
  allNarratives: string[]
): Promise<string> {
  const teamScores = teams.map((t) => {
    const total = Object.values(t.metrics).reduce((sum, v) => sum + (v as number), 0);
    return { name: t.name, slug: t.slug, metrics: t.metrics, total };
  }).sort((a, b) => b.total - a.total);

  const prompt = `The 6-round AI geopolitics simulation has ended. Write a compelling 3-4 paragraph endgame summary for display on the master screen.

## Final World State
${JSON.stringify(worldState, null, 2)}

## Final Team Standings (ranked by composite score)
${teamScores.map((t, i) => `${i + 1}. ${t.name} (${t.total} pts): ${JSON.stringify(t.metrics)}`).join("\n")}

## Round-by-Round Narrative
${allNarratives.map((n, i) => `**Round ${i + 1}:** ${n}`).join("\n\n")}

Write the summary as a retrospective news analysis — like a long-form article looking back on the most consequential 2 years in human history. Cover:
1. Who won and why — what was their key strategic insight?
2. The pivotal moment — which single decision changed everything?
3. Who underperformed and what was their fatal mistake?
4. The state of the world at the end — is it stable, fragile, or doomed?

Be specific, reference actual events from the rounds, and don't sugarcoat failures. If the ending is dark, say so. Not every story has a happy conclusion.

Return ONLY the summary text, no JSON or formatting.`;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
