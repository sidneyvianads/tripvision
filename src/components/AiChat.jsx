import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const INITIAL = {
  role: "assistant",
  content: "Olá! Sou o TripVision IA 🧳 Pergunte qualquer coisa sobre a viagem!",
};

export default function AiChat() {
  const [messages, setMessages] = useState([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: next.slice(0, -1).filter((m) => m !== INITIAL).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "(sem resposta)" }]);
    } catch (e2) {
      setErr(e2.message ?? String(e2));
      setMessages((prev) => [...prev, { role: "assistant", content: "Erro ao conectar com IA. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] px-3" style={{ background: "linear-gradient(180deg, rgba(52,152,219,0.04), rgba(52,152,219,0.0))" }}>
      <div ref={scrollerRef} className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-hide">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={`flex gap-2 items-end animate-pop ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-base bg-[#3498DB]">
                  <span>🤖</span>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                  isUser
                    ? "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white rounded-br-sm"
                    : "bg-white text-[#2D3436] rounded-bl-sm shadow-[0_2px_8px_rgba(52,152,219,0.10)]"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2 items-end justify-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#3498DB]">🤖</div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0_2px_8px_rgba(52,152,219,0.10)]">
              <div className="flex gap-1">
                <span className="dot w-2 h-2 rounded-full bg-[#3498DB]" />
                <span className="dot w-2 h-2 rounded-full bg-[#3498DB]" />
                <span className="dot w-2 h-2 rounded-full bg-[#3498DB]" />
              </div>
            </div>
          </div>
        )}
        {err && <div className="text-xs text-red-600 px-1">{err}</div>}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 py-3">
        <input
          className="input flex-1"
          placeholder="Pergunte sobre o roteiro…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn-primary !p-3 rounded-full inline-flex items-center justify-center"
          disabled={!input.trim() || loading}
          aria-label="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
