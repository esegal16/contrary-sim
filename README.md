# Contrary Sim

A multiplayer AI geopolitics simulation game built for the [Contrary Research](https://contrary.com) retreat. Five teams role-play as global actors navigating the AI race from 2026-2028. An LLM game master resolves each round based on all teams' simultaneous secret decisions.

**Live:** [contrary-sim.vercel.app](https://contrary-sim.vercel.app)

## The Game

Inspired by [AI 2027](https://ai-2027.com/) and Bridgewater's trading simulations. 15 players split into 5 teams, each representing a major actor in the global AI race:

| Team | Role | Win Condition |
|------|------|---------------|
| **United States Government** | NSC & executive branch | Maintain AI leadership, domestic stability, global influence |
| **People's Republic of China** | CCP Central Leading Group on AI | Close the compute gap, achieve strategic autonomy |
| **OpenBrain** | World's leading AI lab (OpenAI analog) | Stay at the frontier, grow revenue, keep regulatory freedom |
| **Prometheus AI** | Safety-focused frontier lab (Anthropic analog) | Prove safe AI can win commercially — while not running out of money |
| **EU & Global Coalition** | EU Commission + allied nations | Establish global AI governance, prevent unilateral dominance |

### Round Structure (~6 min each, 6 rounds total)

| Phase | Duration | What Happens |
|-------|----------|-------------|
| **Briefing** | 30s | Master screen shows updated world state and events |
| **Open Forum** | 2 min | All teams discuss publicly, UN-style. Posture, propose, bluff. |
| **Private Caucus** | 2 min | Teams break out for side deals and scheming |
| **Submit Actions** | 2 min | Each team privately submits 1-3 strategic actions |
| **Resolution** | ~15s | Claude processes all actions, narrates outcomes, updates metrics |

Each round covers ~6 months, from mid-2026 through mid-2028. The AI escalates: early rounds are about positioning, late rounds get existential.

## Game Mechanics

### Fog of War
The master screen (TV) hides all team metrics during gameplay. Teams can only see their own scores on their devices. Nobody knows how anyone else is doing — which means the open forum becomes a negotiation under uncertainty. Bluff about your position. Full metrics are revealed at the end of the game.

### Countdown Timers
Every timed phase has a visible countdown on both the master screen (large) and team devices (compact). Turns red at 15 seconds. Pulses when expired. The game master controls advancement manually — timers create urgency but don't auto-cut discussions.

### Secret Objectives
Each team has a hidden personal win condition visible only on their device, revealed to everyone at end-game. These create moments where a team's "weird" decisions suddenly make sense. Examples:
- *US Gov:* Bilateral agreement with China AND AI Lead above 70
- *China:* 3+ non-aligned partnerships AND Compute Parity above 65
- *OpenBrain:* Revenue above 80 AND first to deploy AGI
- *Prometheus:* Alignment framework as international standard AND Funding Runway above 50
- *EU:* Get both US AND China to sign a binding treaty

### Metric Deltas
After each round resolution, all metrics show `+12` or `-8` change indicators so teams can see the impact of their actions.

### Round History
Teams can expand a collapsible history panel showing all past rounds' narratives — no context gets lost mid-game.

### End-Game Summary
After round 6, a second LLM call generates a 3-4 paragraph retrospective analysis: who won and why, the pivotal moment, who underperformed, and the state of the world. Displayed on both the master screen and team devices.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page — Game Master or Join as Team |
| `/master` | Master view for TV — create game, control phases, resolve rounds |
| `/team` | Team terminal — join via code, see briefing, submit actions |
| `/rules` | Full game manual with AI 2027 scenario context |
| `/briefing` | Index of all 5 classified team briefings |
| `/briefing/[slug]` | Per-team briefing with intel, assets, vulnerabilities, strategy guide |

## Game Master Prompt Design

The LLM game master is tuned with specific principles:

- **Rewards boldness** — decisive execution beats passive safety. Moving fast with a plan is not the same as being reckless.
- **Punishes hypocrisy** — publicly advocating safety while privately accelerating development has consequences.
- **Makes cooperation hard** — treaties require concessions, coalitions have internal friction, enforcement is difficult.
- **Probabilistic espionage** — weight theft has ~30-40% success rate, not automatic. Failed operations have severe diplomatic costs.
- **Prometheus is a company** — "Funding Runway" declines without revenue. Pure moralizing without shipping products leads to acquisition or collapse.
- **Metric caps** — no metric hits 100 before round 5. The higher you climb, the harder you fall.

## Tech Stack

- **Frontend:** Next.js 16, Tailwind CSS, Inter + JetBrains Mono
- **Backend:** Supabase (Postgres + Realtime for live sync)
- **AI:** Anthropic Claude API (Sonnet for round resolution + end-game summary)
- **Hosting:** Vercel

## Setup

```bash
git clone https://github.com/esegal16/contrary-sim.git
cd contrary-sim
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
```

Set up the database (requires [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)):

```bash
supabase link --project-ref your_project_ref
supabase db push
```

Run locally:

```bash
npm run dev
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `sim_games` | Game state, current round, world state JSON, final summary |
| `sim_teams` | Team roles, metrics, previous metrics, join codes, secret briefings, secret objectives |
| `sim_rounds` | Round phases, phase timestamps, narratives, world state snapshots |
| `sim_actions` | Team submissions per round |
| `sim_messages` | Inter-team private messages (optional) |

All tables have Supabase Realtime enabled. The app also polls every 3s as a fallback.

## Design Decisions

- **Natural language actions** — teams type what they want to do in plain English. The LLM interprets intent, allowing creative strategies the designers didn't anticipate.
- **Simultaneous submission** — all teams submit privately before resolution. Public posturing can diverge from private action.
- **Asymmetric win conditions** — each team optimizes different metrics with different secret objectives. "Winning" looks different for everyone.
- **Fog of war** — hiding metrics from the master screen transforms the open forum from scoreboard-watching into genuine negotiation under uncertainty.
- **Escalating timeline** — the AI 2027 scenario provides a plausible escalation arc. Early rounds feel strategic; late rounds feel existential.

## License

MIT
