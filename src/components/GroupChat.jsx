import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";

const AVATAR_COLORS = ["#FF6B6B", "#FF8E53", "#2ECC71", "#3498DB", "#9B59B6", "#F1C40F", "#1abc9c"];
const colorFor = (s) => {
  let h = 0;
  for (const c of String(s ?? "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};
const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};

export default function GroupChat() {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat();
  const [text, setText] = useState("");
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t || !user) return;
    sendMessage(t, user.id);
    setText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] px-3">
      <div ref={scrollerRef} className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-hide">
        {loading && <div className="text-center text-[#B2BEC3] text-sm py-6">Carregando…</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center text-[#B2BEC3] text-sm py-10">
            Nenhuma mensagem ainda.<br />Manda a primeira! 🎉
          </div>
        )}
        {messages.map((m) => {
          const mine = m.user_id === user?.id;
          const nome = m.profiles?.nome ?? "Viajante";
          const initial = nome.charAt(0).toUpperCase();
          return (
            <div
              key={m.id}
              className={`flex gap-2 items-end animate-pop ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine && (
                <div
                  className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: colorFor(m.user_id) }}
                >
                  {initial}
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                  mine
                    ? "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white rounded-br-sm"
                    : "bg-white text-[#2D3436] rounded-bl-sm shadow-[0_2px_8px_rgba(255,107,107,0.06)]"
                }`}
              >
                {!mine && (
                  <div className="text-[11px] font-display font-bold mb-0.5" style={{ color: colorFor(m.user_id) }}>
                    {nome}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap break-words">{m.content}</div>
                <div className={`text-[10px] mt-1 tabular ${mine ? "text-white/70" : "text-[#B2BEC3]"}`}>
                  {formatTime(m.created_at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 py-3 sticky bottom-0">
        <input
          className="input flex-1"
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
