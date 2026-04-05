-- Simulation Game Schema

create table public.sim_games (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Untitled Game',
  status text not null default 'lobby' check (status in ('lobby', 'running', 'finished')),
  current_round int not null default 0,
  total_rounds int not null default 6,
  world_state jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.sim_teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.sim_games(id) on delete cascade,
  slug text not null,
  name text not null,
  role_description text not null default '',
  metrics jsonb not null default '{}'::jsonb,
  secret_briefing text not null default '',
  join_code text not null default substr(md5(random()::text), 1, 6),
  created_at timestamptz not null default now(),
  unique(game_id, slug)
);

create table public.sim_rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.sim_games(id) on delete cascade,
  round_number int not null,
  phase text not null default 'briefing' check (phase in ('briefing', 'open_forum', 'caucus', 'submit', 'resolving', 'resolved')),
  world_events text not null default '',
  narrative text not null default '',
  world_state_snapshot jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique(game_id, round_number)
);

create table public.sim_actions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.sim_games(id) on delete cascade,
  team_id uuid not null references public.sim_teams(id) on delete cascade,
  round_number int not null,
  action_text text not null,
  submitted_at timestamptz not null default now(),
  unique(team_id, round_number)
);

create table public.sim_messages (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.sim_games(id) on delete cascade,
  from_team_id uuid not null references public.sim_teams(id) on delete cascade,
  to_team_id uuid not null references public.sim_teams(id) on delete cascade,
  round_number int not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Enable realtime on all sim tables
alter publication supabase_realtime add table public.sim_games;
alter publication supabase_realtime add table public.sim_teams;
alter publication supabase_realtime add table public.sim_rounds;
alter publication supabase_realtime add table public.sim_actions;
alter publication supabase_realtime add table public.sim_messages;
