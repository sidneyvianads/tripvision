import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";

const STORAGE_KEY = "tripvision:checklist:v1";

const SEED = [
  { id: 1,  categoria: "antes",   titulo: "Autorização ICMBio (Morro da Igreja)" },
  { id: 2,  categoria: "antes",   titulo: "Reservar Terrazo pra 15 pessoas (27/06)" },
  { id: 3,  categoria: "antes",   titulo: "Reservar Il Piacere pra 15 pessoas (01/07)" },
  { id: 4,  categoria: "antes",   titulo: "Agendar Prawer visita guiada (30/06)" },
  { id: 5,  categoria: "antes",   titulo: "Agendar Caminhos de Pedra (03/07)" },
  { id: 6,  categoria: "antes",   titulo: "Comprar ingresso Oceanic Aquarium" },
  { id: 7,  categoria: "antes",   titulo: "Comprar ingresso Aventura Jurássica" },
  { id: 8,  categoria: "antes",   titulo: "Comprar ingresso Beto Carrero" },
  { id: 9,  categoria: "antes",   titulo: "Comprar ingresso Mundo a Vapor" },
  { id: 10, categoria: "antes",   titulo: "Comprar ingresso Café Colonial Bela Vista" },
  { id: 11, categoria: "durante", titulo: "Abastecer carros noite 25/06 (antes devolver FLN)" },
  { id: 12, categoria: "durante", titulo: "Abastecer carros noite 03/07 (antes devolver POA)" },
  { id: 13, categoria: "durante", titulo: "Conferir condições Serra do Rio do Rastro (manhã 23/06)" },
  { id: 14, categoria: "durante", titulo: "Levar remédio de enjoo (Serra do Rio do Rastro)" },
  { id: 15, categoria: "durante", titulo: "Agasalhos reforçados para Urubici" },
  { id: 16, categoria: "durante", titulo: "Roupa extra crianças (Aventura Jurássica tem chafariz)" },
];

const CATS = [
  { id: "antes",   title: "📋 Antes da viagem" },
  { id: "durante", title: "⛽ Durante a viagem" },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[checklist] não foi possível salvar no localStorage", e);
  }
}

export default function Checklist() {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setState(loadState());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = (id) => {
    setState((prev) => {
      const wasDone = !!prev[id]?.concluido;
      const next = {
        ...prev,
        [id]: wasDone ? null : { concluido: true, concluido_at: new Date().toISOString() },
      };
      if (next[id] === null) delete next[id];
      saveState(next);
      return next;
    });
  };

  const reset = () => {
    if (!confirm("Desmarcar todos os itens?")) return;
    saveState({});
    setState({});
  };

  const total = SEED.length;
  const done = SEED.filter((i) => state[i.id]?.concluido).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="px-4 pb-6">
      <div className="card p-4 mt-4">
        <div className="flex items-baseline justify-between">
          <div className="font-display font-extrabold text-base">Progresso</div>
          <div className="text-sm text-[#636E72]">
            <span className="font-display font-extrabold text-[#FF6B6B] tabular">{done}</span>
            <span className="text-[#B2BEC3]"> / {total} concluídos</span>
          </div>
        </div>
        <div className="mt-3 h-3 rounded-full bg-[#FCE4D6] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #FF6B6B 0%, #FF8E53 ${Math.max(40, 100 - pct)}%, #2ECC71 100%)`,
            }}
          />
        </div>
        {done > 0 && (
          <button
            onClick={reset}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#B2BEC3] hover:text-[#FF6B6B] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Desmarcar tudo
          </button>
        )}
      </div>

      {CATS.map((cat) => {
        const list = SEED.filter((i) => i.categoria === cat.id);
        return (
          <section key={cat.id} className="mt-5">
            <div className="font-display font-extrabold text-base text-[#2D3436] px-1 mb-2">
              {cat.title}
            </div>
            <ul className="space-y-2">
              {list.map((item) => {
                const concluido = !!state[item.id]?.concluido;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className="card w-full text-left p-3 flex items-start gap-3 active:scale-[0.99] transition"
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                        style={{
                          background: concluido ? "#2ECC71" : "white",
                          border: `2px solid ${concluido ? "#2ECC71" : "#FCE4D6"}`,
                        }}
                      >
                        {concluido && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${concluido ? "text-[#B2BEC3] line-through" : "text-[#2D3436]"}`}>
                          {item.titulo}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="text-center text-[10px] text-[#B2BEC3] mt-6">
        💾 Salvo neste navegador
      </div>
    </div>
  );
}
