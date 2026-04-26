import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const CATS = [
  { id: "antes",   title: "📋 Antes da viagem" },
  { id: "durante", title: "⛽ Durante a viagem" },
];

export default function Checklist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data } = await supabase
        .from("checklist")
        .select("*")
        .order("ordem", { ascending: true });
      if (active) {
        setItems(data ?? []);
        setLoading(false);
      }
    };
    load();

    const channel = supabase
      .channel("checklist-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checklist" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setItems((prev) => prev.map((i) => (i.id === payload.new.id ? payload.new : i)));
          } else if (payload.eventType === "INSERT") {
            setItems((prev) => [...prev, payload.new].sort((a, b) => a.ordem - b.ordem));
          } else if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((i) => i.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const ids = Array.from(
      new Set(items.map((i) => i.concluido_por).filter(Boolean))
    );
    if (ids.length === 0) return;
    supabase
      .from("profiles")
      .select("id, nome, avatar_url")
      .in("id", ids)
      .then(({ data }) => {
        const map = {};
        for (const p of data ?? []) map[p.id] = p;
        setProfilesById((prev) => ({ ...prev, ...map }));
      });
  }, [items]);

  const toggle = async (item) => {
    if (!user) return;
    const next = !item.concluido;
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              concluido: next,
              concluido_por: next ? user.id : null,
              concluido_at: next ? new Date().toISOString() : null,
            }
          : i
      )
    );
    await supabase
      .from("checklist")
      .update({
        concluido: next,
        concluido_por: next ? user.id : null,
        concluido_at: next ? new Date().toISOString() : null,
      })
      .eq("id", item.id);
  };

  const total = items.length;
  const done = items.filter((i) => i.concluido).length;
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
      </div>

      {loading && (
        <div className="text-center text-[#B2BEC3] text-sm py-8">Carregando…</div>
      )}

      {!loading && total === 0 && (
        <div className="card p-6 mt-4 text-center text-[#636E72] text-sm">
          Nenhum item ainda. Configure a tabela <code>checklist</code> no Supabase e rode o seed.
        </div>
      )}

      {CATS.map((cat) => {
        const list = items.filter((i) => i.categoria === cat.id);
        if (list.length === 0) return null;
        return (
          <section key={cat.id} className="mt-5">
            <div className="font-display font-extrabold text-base text-[#2D3436] px-1 mb-2">
              {cat.title}
            </div>
            <ul className="space-y-2">
              {list.map((item) => {
                const prof = item.concluido_por ? profilesById[item.concluido_por] : null;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item)}
                      className="card w-full text-left p-3 flex items-start gap-3 active:scale-[0.99] transition"
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                        style={{
                          background: item.concluido ? "#2ECC71" : "white",
                          border: `2px solid ${item.concluido ? "#2ECC71" : "#FCE4D6"}`,
                        }}
                      >
                        {item.concluido && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${item.concluido ? "text-[#B2BEC3] line-through" : "text-[#2D3436]"}`}>
                          {item.titulo}
                        </div>
                        {prof && (
                          <div className="text-xs text-[#B2BEC3] mt-0.5">
                            ✓ por {prof.nome}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
