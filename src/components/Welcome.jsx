import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Welcome({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10 gradient-coral">
      <div className="card w-full max-w-md p-8 animate-fade-up">
        <div className="text-center">
          <div className="text-6xl mb-3">🧳</div>
          <h1 className="text-3xl text-[#2D3436]">TripVision</h1>
          <p className="text-[#636E72] mt-1">Serra Catarinense & Gaúcha 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <label className="block">
            <span className="font-display font-bold text-sm text-[#2D3436]">
              Qual seu nome?
            </span>
            <input
              type="text"
              autoFocus
              autoComplete="given-name"
              className="input mt-1.5"
              placeholder="Ex: Sidney"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
            />
          </label>

          <button
            type="submit"
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
            disabled={!name.trim()}
          >
            Entrar na viagem!
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#B2BEC3] mt-6">
          Família Viana • 21/06 → 04/07/2026
        </p>
      </div>
    </div>
  );
}
