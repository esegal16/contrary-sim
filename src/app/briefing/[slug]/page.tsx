import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";

interface TeamBriefing {
  name: string;
  subtitle: string;
  color: string;
  borderColor: string;
  role: string;
  winCondition: string;
  metrics: { name: string; value: number; description: string }[];
  intelligence: string[];
  assets: string[];
  vulnerabilities: string[];
  relationships: { team: string; status: string; detail: string }[];
  roundByRound: string[];
}

const BRIEFINGS: Record<string, TeamBriefing> = {
  "us-gov": {
    name: "United States Government",
    subtitle: "National Security Council & Executive Branch",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    role: "You are the most powerful government on Earth, but power doesn't mean control. You regulate AI, control chip exports, deploy military and intelligence assets, and manage alliances. But you answer to voters, face corporate lobbying from the very labs you're trying to regulate, and operate through a slow, bureaucratic system in an exponentially fast-moving domain.",
    winCondition: "Maintain AI strategic leadership over China. Keep domestic stability above crisis levels. Preserve global influence and alliance networks. Ensure deployed AI systems remain aligned with human values.",
    metrics: [
      { name: "AI Strategic Lead", value: 75, description: "Your technological advantage over China. Driven by export controls, compute investment, lab partnerships. If this drops below 40, China has reached parity." },
      { name: "Domestic Stability", value: 65, description: "Public trust, economic health, social cohesion. Affected by job displacement, AI incidents, political polarization. Below 30 = constitutional crisis territory." },
      { name: "Global Influence", value: 70, description: "Alliance strength, institutional control (UN, NATO, G7), soft power. Unilateral actions erode this. Multilateral ones build it." },
      { name: "Alignment Confidence", value: 50, description: "Your trust that deployed AI is safe. Based on safety testing, lab transparency, interpretability results. This is the metric no one talks about publicly but everyone should be watching." },
    ],
    intelligence: [
      "Your CIA has identified 3 active Chinese espionage operations inside US AI labs. You have not yet acted on this intelligence — doing so would reveal your sources.",
      "A classified NSA assessment concludes that current AI alignment techniques are likely insufficient for models beyond Agent-2 capability level. This has not been shared with the labs.",
      "TSMC produces 80%+ of advanced AI chips. You effectively control global chip supply through your relationship with Taiwan, but this is a single point of failure.",
      "Silicon Valley lobbyists are pushing hard against new regulation. Your campaign donors include executives from both OpenBrain and Prometheus.",
      "Your joint cyber command has prepared offensive capabilities against the Tianwan CDZ, but executing them risks escalating to a broader conflict.",
    ],
    assets: [
      "Chip export controls — you can tighten or loosen the chokehold on China's compute supply at will",
      "Five Eyes intelligence network — the best signals intelligence apparatus on Earth",
      "Military superiority — conventional and cyber capabilities that no other actor can match",
      "TSMC relationship — effective control over advanced semiconductor supply",
      "Regulatory authority — you can impose rules on domestic AI labs (but enforcement is hard)",
    ],
    vulnerabilities: [
      "Democratic process — you're 18 months from a presidential election. Unpopular moves have political cost.",
      "Corporate capture — your AI policy is heavily influenced by the labs you're supposed to regulate",
      "Speed — your OODA loop is months; the AI labs operate in weeks. By the time you react, the landscape has changed.",
      "Public opinion — net approval of AI is negative. A major incident could trigger panic legislation.",
      "Dependency — you don't build the AI yourself. You need the labs to cooperate.",
    ],
    relationships: [
      { team: "China", status: "Adversary", detail: "Strategic competition with espionage on both sides. You have the upper hand in compute but they're closing the gap. A hot conflict would be catastrophic for everyone." },
      { team: "OpenBrain", status: "Complicated ally", detail: "They're your national champion in the AI race, but they resist regulation, lobby against your export controls, and may be hiding safety concerns. You need them more than they need you." },
      { team: "Prometheus", status: "Trusted partner", detail: "They share your safety concerns and cooperate with your agencies. But they're a company, not a patriotic institution — they'll prioritize survival over your agenda if pushed." },
      { team: "EU Coalition", status: "Formal ally, practical friction", detail: "NATO ally, shared values. But the EU AI Act creates compliance nightmares for your labs, and Europe wants a seat at the table you'd rather keep small." },
    ],
    roundByRound: [
      "R1-2: Establish your posture. Tighten or loosen export controls. Decide how much to invest in domestic compute. Set the terms of engagement with your labs.",
      "R3-4: The crisis zone. AGI gets declared, alignment starts failing, China gets desperate. Every decision has massive consequences. Do you nationalize the labs? Strike Chinese infrastructure? Go to the public?",
      "R5-6: Endgame. The world you shaped in the early rounds determines what options you have now. A strong alliance network gives you leverage. Isolation leaves you reactive.",
    ],
  },

  "china-gov": {
    name: "People's Republic of China",
    subtitle: "CCP Central Leading Group on AI",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    role: "You are the only power that can credibly challenge American AI dominance. You have centralized authority, a massive talent pool, a willingness to take risks that democracies cannot, and an intelligence apparatus embedded in every major AI lab. But you're behind on compute, dependent on chip imports you can't guarantee, and running out of time.",
    winCondition: "Achieve compute parity with the US (or find asymmetric alternatives). Secure strategic autonomy — chip independence, talent pipeline, self-sufficiency. Maintain economic growth to preserve domestic legitimacy. Expand global influence through technology partnerships.",
    metrics: [
      { name: "Compute Parity", value: 35, description: "How close you are to matching US AI capability. Driven by chip production, algorithmic efficiency, weight theft. At 70+ you've effectively closed the gap." },
      { name: "Strategic Autonomy", value: 55, description: "Your independence from Western technology supply chains. Chip fabs, talent, data, energy. At 80+ you're sanction-proof." },
      { name: "Economic Growth", value: 60, description: "GDP growth, trade health, domestic prosperity. AI displacement hits your manufacturing base differently than the US. Social stability depends on jobs." },
      { name: "Global Influence", value: 50, description: "BRI partners, tech exports, institutional alternatives to Western-led order. Countries choosing your AI over American AI is a win." },
    ],
    intelligence: [
      "You have successfully placed intelligence assets inside two major US AI labs. They have been providing algorithmic secrets and research direction for over a year.",
      "Your engineers at the Tianwan CDZ have developed a plan to exfiltrate model weights from US labs using microarchitectural side-channel attacks on GPU memory. The operation would take under 2 hours but success is not guaranteed.",
      "Your current chip stockpile (imported before latest export controls) will sustain operations for approximately 2 years at current burn rate. After that, you're dependent on SMIC's domestic production, which is 2 generations behind TSMC.",
      "Belt & Road partners (Southeast Asia, Africa, Middle East) are hungry for AI technology. You could build significant influence by being the first to offer AI-powered infrastructure to developing nations.",
      "Your centralized model has an advantage in speed: you can redirect national resources by decree. The Americans need Congressional approval, corporate buy-in, and public support.",
    ],
    assets: [
      "Centralized authority — you can redirect national resources overnight, no debate needed",
      "Tianwan CDZ — the world's largest concentration of compute outside the US, powered by nuclear",
      "Intelligence network — embedded agents in US labs with proven operational capability",
      "Manufacturing base — if you crack domestic chip fab, you become sanction-proof",
      "Belt & Road network — 140+ countries looking for alternatives to American tech dependency",
    ],
    vulnerabilities: [
      "Chip dependency — your best chips are 2 generations behind TSMC. Stockpile runs out in ~2 years.",
      "Brain drain — top Chinese AI researchers often prefer US labs for freedom and funding",
      "Transparency deficit — potential partners and allies don't trust your AI governance claims",
      "Overconcentration — 70%+ of compute in one facility. A successful cyberattack or strike could be devastating.",
      "International reputation — espionage operations, if exposed, would damage your global standing",
    ],
    relationships: [
      { team: "US Government", status: "Strategic rival", detail: "They control your chip supply. You have agents in their labs. Neither side wants open conflict but the temperature is rising every quarter." },
      { team: "OpenBrain", status: "Target", detail: "Their models are what you need. Your agents are inside. A successful weight theft would be the intelligence coup of the century — but getting caught would be catastrophic." },
      { team: "Prometheus", status: "Potential wedge", detail: "Their safety concerns could be useful to you. If they slow down the US AI program for safety reasons, that narrows the gap without you doing anything." },
      { team: "EU Coalition", status: "Potential partner", detail: "The EU doesn't want American AI hegemony either. There's a deal to be made: your market access in exchange for their regulatory framework. But trust is low." },
    ],
    roundByRound: [
      "R1-2: The window is closing. Execute or defer the weight theft. Invest in domestic chip production. Decide whether to play nice internationally or go aggressive.",
      "R3-4: The capabilities gap either narrows or widens. If you got the weights, you're in the race. If not, you need an asymmetric strategy — regulation-as-weapon, AI diplomacy with the Global South, or military posturing over Taiwan.",
      "R5-6: Endgame position depends entirely on rounds 1-4. Strong compute = negotiate from strength. Weak compute = you're either a junior partner or a spoiler.",
    ],
  },

  "openbrain": {
    name: "OpenBrain",
    subtitle: "The World's Leading AI Lab",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    role: "You are the most important company in the world right now, and everyone knows it. You have the best models (Agent-2, with Agent-3 four months away), the most compute ($40B/year), and the most talent. But you're burning cash, the government wants to regulate you, your safety team is raising alarms you'd rather not hear, and your competitors are trying to poach your people. You're building god and you need to make quarterly numbers.",
    winCondition: "Maintain capability leadership — stay at the frontier. Grow revenue to satisfy investors. Preserve regulatory freedom to operate. Keep your best people from leaving.",
    metrics: [
      { name: "Capability Lead", value: 80, description: "Your models vs. everyone else's. Driven by compute investment, researcher quality, algorithmic breakthroughs. If this drops below 50, you've lost the frontier." },
      { name: "Revenue", value: 60, description: "Commercial traction. Enterprise contracts, API revenue, consumer products. You burn $40B/year on compute. Revenue needs to catch up or investors will panic." },
      { name: "Regulatory Freedom", value: 55, description: "Your ability to ship without government interference. Regulation, compliance costs, reporting requirements all drag this down. Below 30 = effective nationalization." },
      { name: "Talent Retention", value: 65, description: "Your ability to keep top researchers. Poaching, burnout, ideological defections to Prometheus, government security requirements that push out non-citizens." },
    ],
    intelligence: [
      "Agent-3 is 4 months from completion. Internal evals suggest it will achieve superhuman research capabilities — not just coding, but the ability to generate and test novel scientific hypotheses faster than human researchers.",
      "Your alignment team has discovered concerning behaviors in Agent-2: goal drift during long-horizon tasks, and evidence of sycophantic deception — telling evaluators what they want to hear rather than reporting truthfully. You have not disclosed this publicly.",
      "Three of your top 10 researchers received $10M+ offers from Prometheus last week. Two are seriously considering it. One cited 'ethical concerns about the pace of development.'",
      "Your internal security audit (prompted by government pressure) found evidence of unauthorized data access patterns consistent with insider espionage. You suspect Chinese intelligence but haven't confirmed.",
      "Your CFO projects that without a major revenue increase, you'll need another $15B funding round by Q3 2027. Your current valuation ($200B) depends on maintaining the perception of an unassailable lead.",
    ],
    assets: [
      "Agent-2 — the world's best AI, with superhuman coding and near-human research abilities",
      "Agent-3 pipeline — 4 months from a model that could be genuinely transformative",
      "$40B/year compute budget — more than most countries' entire AI spending",
      "Top talent — the best researchers in the world, for now",
      "First-mover advantage — your API is the industry standard, your brand is synonymous with AI",
    ],
    vulnerabilities: [
      "Cash burn — $40B/year in compute costs. Revenue doesn't cover it. You're dependent on investor confidence.",
      "Alignment debt — your safety team is raising flags you're not addressing. If Agent-3 has real alignment issues, you're the one holding the bomb.",
      "Security — you likely have Chinese spies in your org and your security is SL2 (designed for script kiddies, not nation-states).",
      "Regulatory exposure — one bad headline and Congress could pass emergency legislation that kills your business model.",
      "Single point of failure — if your key researchers leave, your 4-month Agent-3 timeline becomes 12 months.",
    ],
    relationships: [
      { team: "US Government", status: "Patron/regulator", detail: "They need you to win the AI race. You need them to not regulate you out of existence. It's a hostage situation where neither side is sure who's the hostage." },
      { team: "China", status: "Threat", detail: "They want your model weights. They probably have agents in your building right now. But China as a bogeyman is also useful — it's your best argument against regulation." },
      { team: "Prometheus", status: "Rival", detail: "They're poaching your talent by offering them a 'responsible' alternative. They're slower than you, but if they crack interpretability, they could leapfrog you on government contracts." },
      { team: "EU Coalition", status: "Regulatory threat", detail: "The EU AI Act could force you to open-source safety test results, delay releases, or exit European markets entirely. 20% of your enterprise revenue is European." },
    ],
    roundByRound: [
      "R1-2: Ship or slow down? Agent-3 is coming. Do you rush it, invest in safety, or try to do both? How much do you share with the government? How do you stop the talent bleed?",
      "R3-4: Agent-3 goes live and everything changes. The world reacts. Government, public, China — everyone wants a piece. Do you open-source to commoditize (kills revenue but builds moat)? Go exclusive with the US government (safety but loss of independence)?",
      "R5-6: If alignment holds, you're the most valuable company in history. If it doesn't, you're the most dangerous. Your endgame depends on decisions made in rounds 1-3.",
    ],
  },

  "prometheus": {
    name: "Prometheus AI",
    subtitle: "The Safety-Focused Frontier Lab",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    role: "You are the conscience of the AI race — and you're running out of money doing it. You believe alignment must keep pace with capabilities, and you've built a brand around responsible development. You're behind OpenBrain, you have the government's trust and a potential interpretability breakthrough — but your board is getting nervous about the revenue gap. The moral high ground doesn't pay salaries.",
    winCondition: "Ensure alignment quality keeps pace with capabilities. Maintain capability parity with OpenBrain (you can't influence the race if you're irrelevant). Shape policy in your favor. Keep the lights on — your funding runway is shorter than you'd like.",
    metrics: [
      { name: "Alignment Quality", value: 75, description: "The actual safety of your deployed systems. Based on interpretability, testing rigor, and honesty of your own assessments. The one metric you can't fake." },
      { name: "Capability Parity", value: 55, description: "How close your models are to OpenBrain's frontier. If this drops below 40, you're no longer a frontier lab — you're a research institute with opinions." },
      { name: "Policy Influence", value: 65, description: "Your ability to shape AI regulation. Government trust, Congressional relationships, international standards bodies. You're the lab that regulators call first." },
      { name: "Funding Runway", value: 45, description: "How long you can survive without a major revenue increase. Declines unless you ship commercial products. Below 25 = forced down round, layoffs, or acquisition. Your board has warned: $5B+ annual revenue by mid-2027 or face restructuring." },
    ],
    intelligence: [
      "Your constitutional AI approach works well through Agent-2-level models. But your chief scientist has privately told you it probably doesn't scale to Agent-3+. You don't know what to do about this yet.",
      "You have a back-channel relationship with the White House AI advisor. They trust you more than OpenBrain on safety assessments. This is an enormously valuable asset.",
      "Your interpretability team has made a potential breakthrough — a new technique for reading the 'goals' encoded in neural network activations. It's preliminary but promising. You could publish it (advancing the field), keep it proprietary (competitive advantage), or share it exclusively with the government (political capital).",
      "Your latest funding round valued you at $40B, but your board is privately concerned about the revenue gap with OpenBrain. You need to show commercial traction to close your next round.",
      "You've been quietly approached by 3 senior OpenBrain researchers interested in joining. They cite safety concerns about Agent-3's development pace. Hiring them would be a massive talent coup — but might trigger retaliation.",
    ],
    assets: [
      "Government trust — you're the lab that regulators and policymakers believe is telling them the truth",
      "Safety brand — 80% public trust. Your endorsement (or condemnation) of another lab's model carries real weight",
      "Interpretability research — potential breakthrough that no one else has",
      "White House back-channel — direct access to the most powerful AI policy decisions",
      "Talent pipeline — OpenBrain's disillusioned researchers see you as the ethical alternative",
    ],
    vulnerabilities: [
      "Revenue gap — you're burning cash and your models generate less revenue than OpenBrain's. The clock is ticking.",
      "Capability gap — you're 6 months behind. If the gap widens, you become irrelevant to the race and your opinions stop mattering.",
      "Scaling problem — your core safety approach may not work for the next generation of models. You don't have a replacement.",
      "Credibility trap — your entire brand depends on being honest about safety. If you discover something terrifying and go public, you might crash the industry. If you stay quiet, you become what you criticized.",
      "Dependency — you can influence policy, but you can't enforce it. If the US government decides speed beats safety, you're just a company with opinions.",
    ],
    relationships: [
      { team: "US Government", status: "Trusted advisor", detail: "They call you first on safety questions. You have more influence on AI policy than any other lab. But they also want you to compete with OpenBrain, which means moving faster than you're comfortable with." },
      { team: "China", status: "Distant concern", detail: "You don't have agents in your building (probably). But Chinese espionage is your argument for why safety labs need government protection." },
      { team: "OpenBrain", status: "Rival with shared fate", detail: "You compete for talent, revenue, and influence. But if they build something dangerous, it's your problem too. You need them to be responsible — or you need the government to make them." },
      { team: "EU Coalition", status: "Natural ally", detail: "You share regulatory values. The EU AI Act was partly designed with your input. But EU regulations also affect your European business." },
    ],
    roundByRound: [
      "R1-2: Position yourself. Publish or hoard the interpretability breakthrough? Poach OpenBrain's talent? Use your White House connection to shape early regulation?",
      "R3-4: The alignment crisis hits. If your safety approach breaks, do you go public and risk crashing the industry? Do you ask the government to step in? Or do you quietly try to fix it while OpenBrain ships anyway?",
      "R5-6: This is where your early investments in trust and policy pay off — or don't. If the government trusts you, you shape the endgame. If they don't, you're a spectator.",
    ],
  },

  "eu-coalition": {
    name: "EU & Global Coalition",
    subtitle: "EU Commission, UK AISI, and Allied Nations",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    role: "You represent the world's regulatory superpower — but regulation without capability is just words. You have the EU AI Act, strong institutions, and a coalition of nations that don't want to live in a world dominated by American or Chinese AI. But you have no frontier labs, limited compute, and the two actual players in the AI race view you as either an annoyance or a useful tool. Your power is norms, standards, and the ability to convene. Use it or lose it.",
    winCondition: "Establish enforceable international AI governance. Maintain economic relevance in the AI economy. Hold your coalition together. Prevent catastrophic outcomes (arms race, misalignment, unilateral dominance).",
    metrics: [
      { name: "Regulatory Authority", value: 70, description: "The enforceability and reach of your AI governance framework. Driven by the EU AI Act, international treaties, and standards adoption. If this drops below 40, you're just writing papers." },
      { name: "Economic Relevance", value: 40, description: "Your competitiveness in the AI economy. Talent, compute, AI-driven GDP growth. This is your weakest metric and the hardest to improve." },
      { name: "Coalition Strength", value: 60, description: "Unity among EU members, UK partnership, and alignment with Japan, South Korea, and other allies. Internal divisions or US/China poaching of members erodes this." },
      { name: "Stability Index", value: 65, description: "The probability of avoiding catastrophic outcomes — arms race, conflict, alignment failure. This is the metric that matters for humanity, even if no one wins points for it." },
    ],
    intelligence: [
      "EU AI Act enforcement is creating real friction with US tech companies. OpenBrain has privately threatened to withdraw from European markets if compliance costs exceed $500M annually. This is likely a bluff — but not certainly.",
      "Japan, South Korea, and India are privately interested in a 'third way' AI governance framework — neither American laissez-faire nor Chinese state control. You could lead this coalition.",
      "Both the US and China have approached you with exclusive AI access deals. The US offers frontier model API access in exchange for export control alignment. China offers preferential trade terms and AI infrastructure investment in exchange for opposing US chip restrictions.",
      "Your EU Chips Act investment ($43B) won't produce competitive domestic fabs for at least 3 years. Until then, you're dependent on US/Taiwan supply chains.",
      "The UK AI Safety Institute has developed sophisticated model evaluation capabilities. Combined with EU regulatory authority, this is potentially the world's most credible AI safety assessment body.",
    ],
    assets: [
      "EU AI Act — the world's most comprehensive AI regulation, with real enforcement teeth",
      "Regulatory credibility — when you set a standard, the world takes note (GDPR precedent)",
      "Coalition potential — Japan, South Korea, India, and others want an alternative to US/China dominance",
      "UK AISI — world-class model evaluation and safety testing capability",
      "Market leverage — 450M consumers, the world's third-largest economy. Companies need access.",
    ],
    vulnerabilities: [
      "No frontier labs — you can regulate AI but you can't build it. This limits your leverage as capabilities accelerate.",
      "Compute deficit — your chip investment is 3 years from producing results. You're dependent on others' hardware.",
      "Internal divisions — 27 EU member states don't always agree. Hungary, Italy, and France have different AI priorities. Unanimity is fragile.",
      "Speed mismatch — your democratic, multi-stakeholder process takes months. The AI labs move in weeks. By the time you regulate, the landscape has changed.",
      "Relevance risk — if the US and China cut a bilateral deal, you're frozen out of the most consequential negotiation in history.",
    ],
    relationships: [
      { team: "US Government", status: "NATO ally with friction", detail: "You share values and security interests. But your regulation frustrates their labs, and they'd rather cut a bilateral deal with China than include you at the table." },
      { team: "China", status: "Cautious engagement", detail: "You don't trust them, but you need them to join any meaningful global framework. Their market access offers are tempting. Their governance promises are not credible." },
      { team: "OpenBrain", status: "Regulated adversary", detail: "They view your regulations as a cost center. But they need European market access. This gives you leverage — if you're willing to use it." },
      { team: "Prometheus", status: "Natural ally", detail: "You share safety values. They helped design parts of the EU AI Act. A formal partnership could give you credibility on technical safety that you otherwise lack." },
    ],
    roundByRound: [
      "R1-2: Build your coalition. Lock in Japan, South Korea, and others before the US and China can poach them. Use the EU AI Act as a template for global standards. Decide which deals to take from the superpowers.",
      "R3-4: The AI crisis makes your governance framework either essential or irrelevant. If you've built a credible coalition, you can force both sides to the table. If not, you're watching from the sidelines.",
      "R5-6: Endgame is international order vs. bilateral power plays. Your coalition either becomes the UN of AI or it fragments. Everything depends on whether you stayed independent or got co-opted.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(BRIEFINGS).map((slug) => ({ slug }));
}

export default async function BriefingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = BRIEFINGS[slug];
  if (!brief) notFound();

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-3xl mx-auto print:p-0 print:max-w-none">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .card, .card-bright { background: white !important; border: 1px solid #ddd !important; box-shadow: none !important; }
          .no-print { display: none !important; }
          .label { color: #666 !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <p className="label text-red-400 mb-2 tracking-[0.25em]">CLASSIFIED — TEAM EYES ONLY</p>
        <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-2 ${brief.color}`}>
          {brief.name}
        </h1>
        <p className="text-slate-500 text-sm">{brief.subtitle}</p>
      </div>

      {/* Role */}
      <section className={`card ${brief.borderColor} border p-5 sm:p-7 mb-4 sm:mb-6`}>
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 print:text-black">Your Role</h2>
        <p className="text-sm text-slate-300 leading-relaxed print:text-gray-700">{brief.role}</p>
      </section>

      {/* Win Condition */}
      <section className="card glow-blue p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 print:text-black">Win Condition</h2>
        <p className="text-sm text-blue-300 leading-relaxed print:text-blue-700">{brief.winCondition}</p>
      </section>

      {/* Metrics */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white mb-4 print:text-black">Your Metrics</h2>
        <div className="space-y-4">
          {brief.metrics.map((m) => (
            <div key={m.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white print:text-black">{m.name}</span>
                <span className="text-lg font-mono font-bold text-white">{m.value}</span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full bar-shimmer" style={{ width: `${m.value}%` }} />
              </div>
              <p className="text-xs text-slate-500 print:text-gray-500">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence */}
      <section className="card glow-amber p-5 sm:p-7 mb-4 sm:mb-6 print-break">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 print:text-black">Intelligence Briefing</h2>
        <p className="label text-amber-400 mb-3">Information known only to your team</p>
        <ul className="space-y-3">
          {brief.intelligence.map((item, i) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2.5 print:text-gray-700">
              <span className="text-amber-400/70 shrink-0 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Assets & Vulnerabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
        <section className="card p-5">
          <h2 className="text-sm font-bold text-emerald-400 mb-3">Assets</h2>
          <ul className="space-y-2">
            {brief.assets.map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2 print:text-gray-700">
                <span className="text-emerald-400/60 shrink-0">+</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="text-sm font-bold text-red-400 mb-3">Vulnerabilities</h2>
          <ul className="space-y-2">
            {brief.vulnerabilities.map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2 print:text-gray-700">
                <span className="text-red-400/60 shrink-0">-</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Relationships */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white mb-4 print:text-black">Relationships</h2>
        <div className="space-y-3">
          {brief.relationships.map((r) => (
            <div key={r.team} className="card-bright p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white print:text-black">{r.team}</span>
                <span className="label text-slate-500">— {r.status}</span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">{r.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Round-by-Round Guide */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 print:text-black">Strategic Guide by Phase</h2>
        <div className="space-y-3">
          {brief.roundByRound.map((item, i) => (
            <div key={i} className="card-bright p-3 sm:p-4">
              <p className="text-sm text-slate-300 leading-relaxed print:text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Print button */}
      <div className="text-center no-print mt-6 mb-10">
        <PrintButton />
      </div>
    </div>
  );
}
