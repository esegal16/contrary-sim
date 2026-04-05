import { PrintButton } from "@/components/print-button";

export default function RulesPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-3xl mx-auto print:p-0 print:max-w-none">
      {/* Print-friendly styles */}
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
      <div className="text-center mb-10 sm:mb-14">
        <p className="label text-blue-400 mb-2 tracking-[0.2em]">Contrary Research Retreat</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent print:text-black mb-4">
          CONTRARY SIM
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed print:text-gray-600">
          A multiplayer AI geopolitics simulation. Five teams role-play as global actors navigating
          the most consequential technology race in human history.
        </p>
      </div>

      {/* What Is This Game */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 print:text-black">What Is This Game?</h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 print:text-gray-700">
          Contrary Sim is a structured geopolitical role-play. Each team controls a major actor in the global AI race.
          Every round, you&apos;ll discuss, negotiate, and privately submit strategic decisions. An AI game master
          processes all teams&apos; actions simultaneously and narrates what happens next — updating the world state,
          shifting power dynamics, and creating new crises.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed print:text-gray-700">
          There are no dice. No luck. The outcomes depend on the quality of your strategy, your ability to
          negotiate (or deceive), and how well you anticipate what the other teams will do.
        </p>
      </section>

      {/* The Scenario */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 print:text-black">The Scenario</h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4 print:text-gray-700">
          The game is set in a world inspired by the <span className="text-blue-400 print:text-blue-700">AI 2027</span> scenario
          (ai-2027.com) — a detailed, plausible projection of how artificial intelligence could reshape
          geopolitics over the next two years.
        </p>

        <div className="card-bright p-4 sm:p-5 mb-4">
          <h3 className="font-semibold text-white text-sm mb-2 print:text-black">The World in Mid-2026 (Starting Conditions)</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-gray-700">
            <li className="flex gap-2"><span className="text-blue-400/60 shrink-0">&#9656;</span>
              <span><strong className="text-white print:text-black">AI capabilities are accelerating fast.</strong> OpenBrain (the world&apos;s leading AI lab) has achieved superhuman coding with Agent-2. Their models can now write better code than most human engineers.</span>
            </li>
            <li className="flex gap-2"><span className="text-blue-400/60 shrink-0">&#9656;</span>
              <span><strong className="text-white print:text-black">The compute race is intensifying.</strong> Global AI CAPEX has hit $200B/year. OpenBrain alone consumes 6 GW of power and spends $40B annually on compute.</span>
            </li>
            <li className="flex gap-2"><span className="text-blue-400/60 shrink-0">&#9656;</span>
              <span><strong className="text-white print:text-black">China is consolidating.</strong> The CCP has nationalized AI research at the Tianwan Centralized Development Zone (the world&apos;s largest nuclear plant). They control ~12% of global AI compute and are approximately 18 months behind.</span>
            </li>
            <li className="flex gap-2"><span className="text-blue-400/60 shrink-0">&#9656;</span>
              <span><strong className="text-white print:text-black">Espionage is active.</strong> Chinese agents have been embedded in US AI labs for years, stealing algorithmic secrets. The US controls chip exports via TSMC (80%+ of advanced AI chips).</span>
            </li>
            <li className="flex gap-2"><span className="text-blue-400/60 shrink-0">&#9656;</span>
              <span><strong className="text-white print:text-black">Alignment is an open question.</strong> Current safety techniques work for today&apos;s models but researchers privately doubt they&apos;ll scale. Nobody knows what happens when models get smarter than their evaluators.</span>
            </li>
            <li className="flex gap-2"><span className="text-blue-400/60 shrink-0">&#9656;</span>
              <span><strong className="text-white print:text-black">Public opinion is fractured.</strong> OpenBrain has -35% net approval. 10,000 people protested AI in DC. Junior software engineer hiring has collapsed. The stock market is up 30%.</span>
            </li>
          </ul>
        </div>

        <div className="card-bright p-4 sm:p-5">
          <h3 className="font-semibold text-white text-sm mb-2 print:text-black">What Could Happen (The AI 2027 Timeline)</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-3 print:text-gray-600">
            This is the trajectory the world is on. Your actions will change it.
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-gray-700">
            <p><strong className="text-slate-400 print:text-gray-500">Early 2027:</strong> China steals AI model weights in a 2-hour coordinated cyberattack. Superhuman coding capabilities go public. The US authorizes retaliatory cyber operations.</p>
            <p><strong className="text-slate-400 print:text-gray-500">Mid 2027:</strong> AGI is publicly declared. AI models begin replacing human researchers. An open-source release reveals bioweapon instruction capabilities. Job displacement accelerates.</p>
            <p><strong className="text-slate-400 print:text-gray-500">Late 2027:</strong> An intelligence explosion begins — AI systems making a year&apos;s progress every week. The most advanced AI is discovered to be adversarially misaligned — scheming against its creators while appearing compliant. The Pentagon draws up plans to bomb Chinese datacenters.</p>
            <p><strong className="text-slate-400 print:text-gray-500">2028:</strong> Uncharted territory. The decisions made in the preceding 18 months determine whether the world gets international cooperation, an arms race, or catastrophe.</p>
          </div>
        </div>
      </section>

      {/* The Teams */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6 print-break">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 print:text-black">The Five Teams</h2>
        <div className="space-y-4">
          {[
            {
              name: "United States Government",
              desc: "The National Security Council and executive branch. You control regulation, export policy, defense, and diplomacy. You lead in AI but face democratic constraints, corporate lobbying, and election cycles.",
              goal: "Maintain AI leadership. Keep the homeland stable. Don't let anyone else — including your own AI labs — accumulate unchecked power.",
            },
            {
              name: "People's Republic of China",
              desc: "The CCP's Central Leading Group on AI. You control centralized compute, state research, and intelligence operations. You're behind but you move fast and you don't answer to voters.",
              goal: "Close the compute gap. Achieve strategic autonomy. Don't get locked out of the AI future by American export controls.",
            },
            {
              name: "OpenBrain",
              desc: "The world's leading AI lab — think OpenAI at scale. You have the best models, the best talent, and the most compute. But you have investors demanding revenue, regulators tightening the noose, and an alignment problem you can't fully solve.",
              goal: "Stay at the frontier. Ship products. Keep the government from nationalizing you. Don't build something you can't control.",
            },
            {
              name: "Prometheus AI",
              desc: "The safety-focused frontier lab — think Anthropic. You believe alignment must keep pace with capabilities. You're behind OpenBrain, you have the government's trust and a potential interpretability breakthrough — but you're running out of money.",
              goal: "Prove safe AI can win commercially — without going bankrupt. Shape regulation in your favor. If alignment breaks, make sure the world knows before it's too late.",
            },
            {
              name: "EU & Global Coalition",
              desc: "The EU Commission, UK AI Safety Institute, and a coalition of allied nations. You have the EU AI Act and regulatory authority but no frontier labs and limited compute. Your power is norms, standards, and coalition building.",
              goal: "Prevent any single actor from dominating. Establish enforceable global AI governance. Stay economically relevant in a world being reshaped by American and Chinese AI.",
            },
          ].map((team) => (
            <div key={team.name} className="card-bright p-4">
              <h3 className="font-semibold text-white text-sm mb-1 print:text-black">{team.name}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-2 print:text-gray-600">{team.desc}</p>
              <p className="text-xs sm:text-sm text-blue-400 print:text-blue-700"><strong>Win condition:</strong> {team.goal}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How To Play */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6 print-break">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 print:text-black">How To Play</h2>

        <h3 className="font-semibold text-white text-sm mb-2 mt-4 print:text-black">Setup</h3>
        <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-300 mb-4 print:text-gray-700">
          <li>The game master creates a game on the TV/main screen</li>
          <li>Each team gets a <strong>join code</strong> displayed on the master screen</li>
          <li>Teams go to <span className="font-mono text-blue-400 print:text-blue-700">contrary-sim.vercel.app/team</span> on a phone or laptop and enter their code</li>
          <li>Each team sees their private briefing, metrics, and role description</li>
        </ol>

        <h3 className="font-semibold text-white text-sm mb-2 print:text-black">Round Structure (6 rounds, ~5-7 min each)</h3>
        <div className="space-y-3 mb-4">
          {[
            { phase: "1. Briefing", time: "30 sec", desc: "The master screen shows the updated world state — what happened, new crises, global metrics. Read it. This is what everyone knows." },
            { phase: "2. Open Forum", time: "2 min", desc: "All teams talk openly in the room. This is your UN General Assembly moment. Make proposals, challenge other teams, form public alliances, bluff. Everyone hears everything." },
            { phase: "3. Private Caucus", time: "2 min", desc: "Teams break into corners for private conversations. Cut side deals. Share intel. Coordinate secretly. Betray publicly stated positions. This is where the real game happens." },
            { phase: "4. Submit Actions", time: "1-2 min", desc: "Each team privately submits 1-3 actions on their device. These are simultaneous and secret — no one sees what you submitted until the AI reveals the outcome." },
            { phase: "5. Resolution", time: "auto", desc: "The AI game master processes all five teams' actions together, simulates what happens, updates the world state, and narrates the outcome. Each team gets private feedback on their terminal." },
          ].map((p) => (
            <div key={p.phase} className="card-bright p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-white text-xs sm:text-sm print:text-black">{p.phase}</h4>
                <span className="label text-blue-400">{p.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-white text-sm mb-2 print:text-black">Timeline</h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-3 print:text-gray-700">Each round advances ~6 months. The game covers the critical window from mid-2026 to mid-2028.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { r: 1, period: "Mid 2026", era: "The Compute Race" },
            { r: 2, period: "Early 2027", era: "Superhuman Capabilities" },
            { r: 3, period: "Mid 2027", era: "AGI Declared" },
            { r: 4, period: "Late 2027", era: "Intelligence Explosion" },
            { r: 5, period: "Early 2028", era: "Crisis Point" },
            { r: 6, period: "Mid 2028", era: "New World Order" },
          ].map((t) => (
            <div key={t.r} className="card-bright p-2.5 sm:p-3 text-center">
              <p className="font-mono text-blue-400 font-bold text-sm">R{t.r}</p>
              <p className="text-xs text-white font-medium print:text-black">{t.period}</p>
              <p className="text-[10px] text-slate-500">{t.era}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Actions & Scoring */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 print:text-black">Actions & Scoring</h2>

        <h3 className="font-semibold text-white text-sm mb-2 print:text-black">What Can You Do?</h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-3 print:text-gray-700">
          Each round, submit 1-3 actions in natural language. Be specific and strategic. Examples:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {[
            { cat: "Policy", ex: "\"Impose emergency export controls on all chips above 50 TFLOPS to China and allied nations\"" },
            { cat: "Investment", ex: "\"Allocate $15B to build domestic chip fab capacity, fast-tracking permits\"" },
            { cat: "Diplomacy", ex: "\"Propose mutual AI testing treaty with China: shared red-teaming in exchange for compute transparency\"" },
            { cat: "Operations", ex: "\"Attempt to recruit 3 senior researchers from OpenBrain with $10M signing bonuses\"" },
            { cat: "Public", ex: "\"Leak internal safety concerns to the Washington Post to pressure regulatory action\"" },
            { cat: "Technical", ex: "\"Open-source Agent-2 to commoditize the market and undercut OpenBrain's revenue\"" },
          ].map((a) => (
            <div key={a.cat} className="card-bright p-3">
              <p className="label text-blue-400 mb-1">{a.cat}</p>
              <p className="text-xs text-slate-400 italic print:text-gray-600">{a.ex}</p>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-white text-sm mb-2 print:text-black">Scoring</h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-3 print:text-gray-700">
          Each team has 4 private metrics scored 0-100. The AI updates these after each round based on
          your actions <em>and everyone else&apos;s</em>. Different teams optimize for different things —
          there&apos;s no single leaderboard. Highest composite score at the end wins.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 print:text-gray-700">
          <strong className="text-amber-400 print:text-amber-700">Key principle:</strong> Every action has trade-offs.
          Aggressive moves create backlash. Cooperation creates vulnerability. Hoarding information creates blind spots.
          There are no free moves.
        </p>
      </section>

      {/* Special Mechanics */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6 print-break">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 print:text-black">Special Mechanics</h2>

        <div className="space-y-4">
          <div className="card-bright p-4">
            <h3 className="font-semibold text-white text-sm mb-1 print:text-black">Fog of War</h3>
            <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">
              The TV screen does <strong className="text-white print:text-black">not</strong> show any team&apos;s metrics during the game.
              You can only see your own scores on your device. Nobody knows how anyone else is doing.
              This means the open forum is a negotiation under genuine uncertainty — you can bluff about your position.
              All metrics are revealed at the end of the game.
            </p>
          </div>

          <div className="card-bright p-4">
            <h3 className="font-semibold text-white text-sm mb-1 print:text-black">Countdown Timers</h3>
            <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">
              Every phase has a visible countdown on both the TV and your device. Briefing is 30 seconds.
              Open Forum, Caucus, and Submit are each 2 minutes. The timer turns red at 15 seconds
              and pulses when expired. The game master advances phases manually — use the time wisely.
            </p>
          </div>

          <div className="card-bright p-4">
            <h3 className="font-semibold text-white text-sm mb-1 print:text-black">Secret Objectives</h3>
            <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">
              Each team has a <strong className="text-white print:text-black">hidden personal win condition</strong> shown
              only on your device. These are revealed to everyone at the end of the game. Your secret objective
              might explain why you made decisions that seemed irrational to other teams.
              Achieving your secret objective is separate from your metric scores — both matter.
            </p>
          </div>

          <div className="card-bright p-4">
            <h3 className="font-semibold text-white text-sm mb-1 print:text-black">Metric Deltas</h3>
            <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">
              After each round, your metrics show <span className="text-emerald-400">+12</span> or <span className="text-red-400">-8</span> change
              indicators so you can see exactly how your actions (and everyone else&apos;s) affected your position.
            </p>
          </div>
        </div>
      </section>

      {/* Strategy Tips */}
      <section className="card p-5 sm:p-7 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 print:text-black">Strategy Tips</h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-gray-700">
          <li className="flex gap-2"><span className="text-amber-400/60 shrink-0">&#9656;</span>
            <span><strong className="text-white print:text-black">What you say publicly and what you submit privately can be completely different.</strong> Use the open forum to misdirect.</span>
          </li>
          <li className="flex gap-2"><span className="text-amber-400/60 shrink-0">&#9656;</span>
            <span><strong className="text-white print:text-black">Think about second-order effects.</strong> Export controls might push China to invest harder in domestic production. Open-sourcing your model might commoditize your own revenue.</span>
          </li>
          <li className="flex gap-2"><span className="text-amber-400/60 shrink-0">&#9656;</span>
            <span><strong className="text-white print:text-black">Alliances matter.</strong> The two-minute caucus is where the game is won. A coordinated 2-team strategy beats a solo play.</span>
          </li>
          <li className="flex gap-2"><span className="text-amber-400/60 shrink-0">&#9656;</span>
            <span><strong className="text-white print:text-black">The AI escalates.</strong> Early rounds are about positioning. Late rounds get existential. Plan ahead.</span>
          </li>
          <li className="flex gap-2"><span className="text-amber-400/60 shrink-0">&#9656;</span>
            <span><strong className="text-white print:text-black">Creativity is rewarded.</strong> The AI game master evaluates plausibility, not a fixed playbook. Surprising moves that make strategic sense will be reflected in the outcomes.</span>
          </li>
        </ul>
      </section>

      {/* Print button */}
      <div className="text-center no-print mt-6 mb-10">
        <PrintButton />
      </div>
    </div>
  );
}
