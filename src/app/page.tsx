import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Subtle radial gradient behind content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />

      <div className="text-center max-w-xl w-full relative z-10">
        <p className="label text-blue-400 mb-3 tracking-[0.2em]">AI Geopolitics Simulation</p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          CONTRARY
        </h1>
        <p className="text-slate-500 mb-12 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
          5 teams. 6 rounds. One AI game master.<br />Who shapes the future?
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/master"
            className="btn btn-primary text-base sm:text-lg px-8 py-3.5 w-64 text-center"
          >
            Game Master
          </Link>
          <Link
            href="/team"
            className="btn btn-secondary text-base sm:text-lg px-8 py-3.5 w-64 text-center"
          >
            Join as Team
          </Link>
        </div>
      </div>
    </div>
  );
}
