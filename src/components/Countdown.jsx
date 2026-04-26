import { useEffect, useState } from "react";
import { TRIP_START, TRIP_END } from "../data/tripData";

function diffParts(target) {
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes, raw: diff };
}

export default function Countdown() {
  const startMs = new Date(TRIP_START).getTime();
  const endMs = new Date(TRIP_END).getTime();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const beforeStart = now < startMs;
  const finished = now > endMs;
  const ongoing = !beforeStart && !finished;

  if (ongoing) {
    const { days } = diffParts(endMs);
    return (
      <div className="card p-5 mx-4 mt-4 animate-fade-up">
        <div className="text-3xl">🚀</div>
        <div className="font-display font-extrabold text-xl mt-1">Em andamento!</div>
        <div className="text-[#636E72] text-sm">{days} {days === 1 ? "dia restante" : "dias restantes"}</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="card p-5 mx-4 mt-4 animate-fade-up text-center">
        <div className="text-4xl">🎉</div>
        <div className="font-display font-extrabold text-xl mt-1">Viagem concluída!</div>
        <div className="text-[#636E72] text-sm">Que aventura, hein?</div>
      </div>
    );
  }

  const { days, hours, minutes } = diffParts(startMs);
  return (
    <div className="card p-5 mx-4 mt-4 animate-fade-up overflow-hidden relative">
      <div className="absolute -right-4 -top-4 text-7xl opacity-10 select-none">✈️</div>
      <div className="text-xs font-display font-bold text-[#FF8E53] uppercase tracking-wide">
        Faltam pra viagem
      </div>
      <div className="mt-2 grid grid-cols-3 gap-3">
        <Box value={days} label={days === 1 ? "dia" : "dias"} />
        <Box value={hours} label="h" />
        <Box value={minutes} label="min" />
      </div>
      <div className="mt-3 text-[#636E72] text-xs">
        Embarque em <span className="font-bold text-[#2D3436]">21/06/2026 às 05:15</span>
      </div>
    </div>
  );
}

function Box({ value, label }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white p-3 text-center">
      <div className="font-display font-extrabold text-2xl tabular leading-none">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-wide font-bold mt-1 opacity-90">{label}</div>
    </div>
  );
}
