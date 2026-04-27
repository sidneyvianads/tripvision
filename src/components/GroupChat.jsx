import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "../hooks/useChat";

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};

const dayKey = (iso) => {
  try { return new Date(iso).toISOString().slice(0, 10); }
  catch { return ""; }
};

const formatDayLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
  if (sameDay(d, today)) return "Hoje";
  if (sameDay(d, yesterday)) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

export default function GroupChat({ user }) {
  const { messages, profilesById, loading, sendMessage } = useChat();
  const [text, setText] = useState("");
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t || !user?.id) return;
    sendMessage(t, user.id);
    setText("");
  };

  let lastDay = null;

  return (
    <div
      className="flex flex-col h-[calc(100vh-180px)] px-3"
      style={{ background: "linear-gradient(180deg, #0D1B2A 0%, #0F1B2D 100%)" }}
    >
      <div ref={scrollerRef} className="flex-1 overflow-y-auto py-3 space-y-2 scrollbar-hide">
        {loading && <div className="text-center text-[#7CB9E8]/60 text-sm py-6">Carregando…</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center text-[#7CB9E8]/60 text-sm py-10">
            Nenhuma mensagem ainda.<br />Manda a primeira! ❄️
          </div>
        )}
        {messages.map((m) => {
          const mine = m.user_id === user?.id;
          const profile = profilesById[m.user_id];
          const cor = mine ? user?.avatar_cor : (profile?.avatar_cor ?? "#7CB9E8");
          const nome = mine ? user?.nome : (profile?.nome ?? "Viajante");
          const initial = (nome ?? "?").charAt(0).toUpperCase();

          const day = dayKey(m.created_at);
          const showSeparator = day !== lastDay;
          lastDay = day;

          return (
            <div key={m.id}>
              {showSeparator && (
                <div className="my-3 flex justify-center">
                  <span
                    className="text-[10px] uppercase font-display font-bold tracking-wide px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(124, 185, 232, 0.12)",
                      color: "#7CB9E8",
                      border: "1px solid rgba(124, 185, 232, 0.20)",
                    }}
                  >
                    {formatDayLabel(m.created_at)}
                  </span>
                </div>
              )}

              <div className={`flex gap-2 items-end animate-pop ${mine ? "justify-end" : "justify-start"}`}>
                {!mine && (
                  <div
                    className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: cor }}
                  >
                    {initial}
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                    mine
                      ? "rounded-br-sm text-white"
                      : "rounded-bl-sm"
                  }`}
                  style={
                    mine
                      ? { background: "linear-gradient(135deg, #2E86C1 0%, #1B4F72 100%)", boxShadow: "0 2px 12px rgba(46, 134, 193, 0.30)" }
                      : { background: "rgba(232, 240, 254, 0.95)", color: "#0F1B2D", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.20)" }
                  }
                >
                  {!mine && (
                    <div className="text-[11px] font-display font-bold mb-0.5" style={{ color: cor }}>
                      {nome}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap break-words">{m.content}</div>
                  <div className={`text-[10px] mt-1 tabular ${mine ? "text-white/70" : "text-[#1A3A4A]/60"}`}>
                    {formatTime(m.created_at)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 py-3 sticky bottom-0">
        <input
          className="input input-dark flex-1"
          placeholder="Mensagem para o grupo…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary !p-3 rounded-full inline-flex items-center justify-center"
          disabled={!text.trim()}
          aria-label="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
