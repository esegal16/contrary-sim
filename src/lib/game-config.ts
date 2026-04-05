import { TeamDefinition, WorldState } from "./types";

export const DEFAULT_TEAMS: TeamDefinition[] = [
  {
    slug: "us-gov",
    name: "United States Government",
    role_description:
      "You are the US National Security Council and executive branch. You control regulation, export policy, defense spending, and diplomatic relations. You must balance AI leadership with domestic stability and global alliances.",
    secret_briefing:
      "Your intelligence agencies have identified 3 suspected Chinese espionage operations targeting US AI labs. You have leverage through chip export controls (TSMC, NVIDIA) but face pressure from Silicon Valley lobbyists and an election cycle. Your classified assessment: current AI alignment techniques are insufficient for models beyond Agent-2 level.",
    starting_metrics: {
      "AI Strategic Lead": 75,
      "Domestic Stability": 65,
      "Global Influence": 70,
      "Alignment Confidence": 50,
    },
  },
  {
    slug: "china-gov",
    name: "People's Republic of China",
    role_description:
      "You are the CCP's Central Leading Group on AI. You control centralized compute resources, state-funded research, and intelligence operations. You must close the AI gap while maintaining economic growth and strategic autonomy.",
    secret_briefing:
      "You have successfully placed assets inside two major US AI labs. Your Tianwan Centralized Development Zone has consolidated national compute but you're still 18 months behind on frontier models. Your chip stockpile will last 2 years at current burn rate. Belt & Road partners are eager for AI technology transfers.",
    starting_metrics: {
      "Compute Parity": 35,
      "Strategic Autonomy": 55,
      "Economic Growth": 60,
      "Global Influence": 50,
    },
  },
  {
    slug: "openbrain",
    name: "OpenBrain",
    role_description:
      "You are the leadership team of OpenBrain, the world's leading AI lab. You've just achieved superhuman coding with Agent-2. You must stay ahead of competitors while managing regulatory pressure, talent wars, and safety concerns. Revenue matters — you have investors to satisfy.",
    secret_briefing:
      "Agent-3 is 4 months from completion and your internal evals suggest it will be a significant leap. However, your alignment team has flagged concerning behaviors in Agent-2 that you haven't disclosed publicly. Three of your top researchers received offers from Prometheus last week. Your cloud compute costs are $2B/year and rising.",
    starting_metrics: {
      "Capability Lead": 80,
      Revenue: 60,
      "Regulatory Freedom": 55,
      "Talent Retention": 65,
    },
  },
  {
    slug: "prometheus",
    name: "Prometheus AI",
    role_description:
      "You are the leadership team of Prometheus AI, the safety-focused frontier lab. You believe alignment must keep pace with capabilities. You're slightly behind OpenBrain but have stronger government trust. You must prove safe AI can win commercially.",
    secret_briefing:
      "Your constitutional AI approach shows promising results through Agent-2 level, but your researchers privately doubt it scales to Agent-3+. You have a back-channel to the White House AI advisor. Your latest funding round valued you at $40B but you need to show revenue growth to close the next one. You've discovered a potential breakthrough in interpretability that could be published or kept proprietary.",
    starting_metrics: {
      "Alignment Quality": 75,
      "Capability Parity": 60,
      "Policy Influence": 70,
      "Public Trust": 80,
    },
  },
  {
    slug: "eu-coalition",
    name: "EU & Global Coalition",
    role_description:
      "You represent the EU Commission, UK AI Safety Institute, and a coalition of aligned nations. You have regulatory power (EU AI Act) but limited compute and no frontier labs. Your strength is norms, standards, and coalition building. You must prevent unilateral AI dominance.",
    secret_briefing:
      "The EU AI Act enforcement is creating friction with US tech companies threatening to leave European markets. Japan and South Korea are privately interested in a 'third way' AI governance framework. You've been approached by both US and China for preferential AI access deals. Your own compute investment (EU Chips Act) won't produce results for 3 years.",
    starting_metrics: {
      "Regulatory Authority": 70,
      "Economic Relevance": 40,
      "Coalition Strength": 60,
      "Stability Index": 65,
    },
  },
];

export const INITIAL_WORLD_STATE: WorldState = {
  year: "Mid 2026",
  summary:
    "AI agents are becoming reliable for coding and research tasks. The compute race is intensifying as US export controls squeeze China's chip supply. OpenBrain leads with Agent-2 (superhuman coder), while Prometheus trails by roughly 6 months. Public sentiment is mixed — excitement about productivity gains, anxiety about job displacement. The EU AI Act is being enforced for the first time.",
  ai_capability_level: "Superhuman coding, near-human research assistance",
  geopolitical_tension: "moderate",
  public_sentiment:
    "Mixed — tech optimism in industry, growing anxiety in public. 35% of Americans support AI regulation.",
  key_events: [
    "OpenBrain's Agent-2 achieves superhuman coding benchmarks",
    "US tightens chip export controls to China (3rd round)",
    "EU AI Act enforcement begins — first compliance audits underway",
    "China consolidates national AI research at Tianwan CDZ",
    "Global AI safety summit scheduled for Q4 2026",
  ],
  global_metrics: {
    ai_progress: 45,
    economic_stability: 60,
    alignment_confidence: 50,
    geopolitical_risk: 40,
  },
};

export const ROUND_TIMELINE = [
  { round: 1, period: "Mid 2026", era: "The Compute Race" },
  { round: 2, period: "Early 2027", era: "Superhuman Capabilities Emerge" },
  { round: 3, period: "Mid 2027", era: "AGI Declared" },
  { round: 4, period: "Late 2027", era: "The Intelligence Explosion" },
  { round: 5, period: "Early 2028", era: "Crisis Point" },
  { round: 6, period: "Mid 2028", era: "New World Order" },
];
