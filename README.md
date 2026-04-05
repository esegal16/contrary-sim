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
| **Prometheus AI** | Safety-focused frontier lab (Anthropic analog) | Prove safe AI can win, shape regulation, maintain public trust |
| **EU & Global Coalition** | EU Commission + allied nations | Establish global AI governance, prevent unilateral dominance |

### Round Structure (~6 min each, 6 rounds total)

1. **Briefing** (30s) -- Master screen shows updated world state
2. **Open Forum** (2 min) -- All teams discuss publicly, UN-style
3. **Private Caucus** (2 min) -- Teams break out for side deals and scheming
4. **Submit Actions** (1-2 min) -- Each team privately submits 1-3 strategic actions
5. **Resolution** -- Claude processes all actions, narrates outcomes, updates metrics

Each round covers ~6 months, from mid-2026 through mid-2028. The AI escalates: early rounds are about positioning, late rounds get existential.

## How It Works

- **Master view** (`/master`) -- displayed on a TV. Shows world state, global metrics, team scores, phase controls.
- **Team terminals** (`/team`) -- one per team on a phone/laptop. Shows private briefing, metrics, action input.
- **Rules** (`/rules`) -- full game manual with scenario context.
- **Briefings** (`/briefing`) -- classified per-team instructions with intel, assets, vulnerabilities, and strategy guides.

Teams join via 6-character codes displayed on the master screen. All state syncs in real-time via Supabase.

The game master is Claude (Sonnet), prompted with the full world state, all teams' metrics, action history, and the AI 2027 scenario logic. It evaluates plausibility, simulates interactions between all teams' actions, and produces narrative outcomes with metric updates.

## Tech Stack

- **Frontend:** Next.js 16 + Tailwind CSS
- **Backend:** Supabase (Postgres + Realtime)
- **AI:** Anthropic Claude API (game master resolution)
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

- `sim_games` -- game state, current round, world state JSON
- `sim_teams` -- team roles, metrics, join codes, secret briefings
- `sim_rounds` -- round phases, narratives, world state snapshots
- `sim_actions` -- team submissions per round
- `sim_messages` -- inter-team private messages (optional)

All tables have Supabase Realtime enabled for live sync between master and team views.

## Key Design Decisions

- **Natural language actions** -- teams type what they want to do in plain English. The LLM interprets intent, which allows creative strategies the designers didn't anticipate.
- **Simultaneous submission** -- all teams submit privately before resolution. This creates a prisoner's dilemma dynamic where public posturing can diverge from private action.
- **Asymmetric win conditions** -- each team optimizes different metrics. There's no single leaderboard, which means "winning" looks different for everyone and creates natural tension.
- **Escalating timeline** -- the AI 2027 scenario provides a plausible escalation arc. Early rounds feel strategic; late rounds feel urgent.

## License

MIT
