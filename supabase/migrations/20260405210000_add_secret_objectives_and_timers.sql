-- Secret objectives for each team (revealed at end-game)
alter table public.sim_teams add column secret_objective text not null default '';

-- Track when each phase started for countdown timers
alter table public.sim_rounds add column phase_started_at timestamptz not null default now();
