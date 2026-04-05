"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  phaseStartedAt: string;
  durationSeconds: number;
  compact?: boolean;
}

export function CountdownTimer({ phaseStartedAt, durationSeconds, compact }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    const startTime = new Date(phaseStartedAt).getTime();
    const endTime = startTime + durationSeconds * 1000;

    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((endTime - now) / 1000));
      setRemaining(left);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [phaseStartedAt, durationSeconds]);

  if (durationSeconds === 0) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isUrgent = remaining <= 15;
  const isExpired = remaining === 0;

  if (compact) {
    return (
      <span className={`font-mono font-bold text-sm ${
        isExpired ? "text-red-400 animate-pulse" : isUrgent ? "text-red-400" : "text-slate-300"
      }`}>
        {isExpired ? "TIME" : `${minutes}:${seconds.toString().padStart(2, "0")}`}
      </span>
    );
  }

  return (
    <div className={`text-center ${isExpired ? "animate-pulse" : ""}`}>
      <p className={`text-4xl sm:text-5xl font-mono font-bold tracking-wider ${
        isExpired ? "text-red-400" : isUrgent ? "text-red-400" : "text-white"
      }`}>
        {isExpired ? "TIME" : `${minutes}:${seconds.toString().padStart(2, "0")}`}
      </p>
      {/* Progress bar */}
      <div className="w-full max-w-[200px] mx-auto bg-slate-800/50 rounded-full h-1 mt-3 overflow-hidden">
        <div
          className={`h-1 rounded-full transition-all duration-1000 ${
            isUrgent ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{ width: `${(remaining / durationSeconds) * 100}%` }}
        />
      </div>
    </div>
  );
}
