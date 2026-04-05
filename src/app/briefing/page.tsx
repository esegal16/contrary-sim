import Link from "next/link";

const TEAMS = [
  { slug: "us-gov", name: "United States Government", color: "text-blue-400" },
  { slug: "china-gov", name: "People's Republic of China", color: "text-red-400" },
  { slug: "openbrain", name: "OpenBrain", color: "text-emerald-400" },
  { slug: "prometheus", name: "Prometheus AI", color: "text-purple-400" },
  { slug: "eu-coalition", name: "EU & Global Coalition", color: "text-amber-400" },
];

export default function BriefingIndex() {
  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <p className="label text-blue-400 mb-2 tracking-[0.2em]">Classified</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-3">
          Team Briefings
        </h1>
        <p className="text-slate-500 text-sm">Select your team to view private instructions.</p>
      </div>
      <div className="space-y-3">
        {TEAMS.map((team) => (
          <Link
            key={team.slug}
            href={`/briefing/${team.slug}`}
            className="card-bright p-4 sm:p-5 block hover:border-slate-600 transition-colors"
          >
            <p className={`font-semibold ${team.color}`}>{team.name}</p>
            <p className="text-xs text-slate-500 mt-1">View classified briefing</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
