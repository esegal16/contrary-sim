export interface Game {
  id: string;
  name: string;
  status: "lobby" | "running" | "finished";
  current_round: number;
  total_rounds: number;
  world_state: WorldState;
  config: GameConfig;
  created_at: string;
}

export interface Team {
  id: string;
  game_id: string;
  slug: string;
  name: string;
  role_description: string;
  metrics: Record<string, number>;
  secret_briefing: string;
  join_code: string;
  created_at: string;
}

export interface Round {
  id: string;
  game_id: string;
  round_number: number;
  phase: "briefing" | "open_forum" | "caucus" | "submit" | "resolving" | "resolved";
  world_events: string;
  narrative: string;
  world_state_snapshot: WorldState;
  resolved_at: string | null;
  created_at: string;
}

export interface Action {
  id: string;
  game_id: string;
  team_id: string;
  round_number: number;
  action_text: string;
  submitted_at: string;
}

export interface Message {
  id: string;
  game_id: string;
  from_team_id: string;
  to_team_id: string;
  round_number: number;
  content: string;
  created_at: string;
}

export interface WorldState {
  year: string;
  summary: string;
  ai_capability_level: string;
  geopolitical_tension: "low" | "moderate" | "high" | "critical";
  public_sentiment: string;
  key_events: string[];
  global_metrics: {
    ai_progress: number;
    economic_stability: number;
    alignment_confidence: number;
    geopolitical_risk: number;
  };
}

export interface GameConfig {
  scenario: string;
  round_duration_seconds: number;
}

export interface TeamDefinition {
  slug: string;
  name: string;
  role_description: string;
  secret_briefing: string;
  starting_metrics: Record<string, number>;
}

export interface ResolutionResult {
  narrative: string;
  world_events: string;
  updated_world_state: WorldState;
  team_updates: {
    team_slug: string;
    metrics: Record<string, number>;
    private_feedback: string;
  }[];
}
