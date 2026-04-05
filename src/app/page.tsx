import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-xl w-full">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-3">CONTRARY SIM</h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-2">AI Geopolitics Simulation</p>
        <p className="text-gray-600 mb-10">
          5 teams. 6 rounds. One AI game master. Who shapes the future?
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/master"
            className="bg-blue-600 hover:bg-blue-500 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors w-64 text-center"
          >
            Game Master
          </Link>
          <Link
            href="/team"
            className="bg-gray-800 hover:bg-gray-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors w-64 text-center"
          >
            Join as Team
          </Link>
        </div>
      </div>
    </div>
  );
}
