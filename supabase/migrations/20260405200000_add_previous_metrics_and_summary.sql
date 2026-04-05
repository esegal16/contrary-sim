-- Add previous_metrics to track deltas between rounds
alter table public.sim_teams add column previous_metrics jsonb not null default '{}'::jsonb;

-- Add final_summary to games for end-game narrative
alter table public.sim_games add column final_summary text not null default '';
