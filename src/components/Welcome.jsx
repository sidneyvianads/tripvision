import { useState } from "react";
import { ArrowRight, Loader2, Mail, KeyRound, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AVATAR_COLORS = [
  { color: "#FF6B6B", label: "Coral" },
  { color: "#FF8E53", label: "Laranja" },
  { color: "#2ECC71", label: "Verde" },
  { color: "#3498DB", label: "Azul" },
  { color: "#9B59B6", label: "Roxo" },
  { color: "#F1C40F", label: "Amarelo" },
];

export default function Welcome() {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState(null);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [senha2, setSenha2] = useState("");
  const [cor, setCor] = useState(AVATAR_COLORS[0].color);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await signIn(email, senha);
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr(null);
    if (senha.length < 6) return setErr("Senha precisa ter no mínimo 6 caracteres.");
    if (senha !== senha2) return setErr("As senhas não conferem.");
    try {
      await signUp({ nome, email, senha, avatar_cor: cor });
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10 gradient-coral">
      <div className="card w-full max-w-md p-8 animate-fade-up">
        <div className="text-center">
          <div className="text-6xl mb-3">🧳</div>
          <h1 className="text-3xl text-[#2D3436]">TripVision</h1>
          <p className="text-[#636E72] mt-1">Serra Catarinense & Gaúcha 2026</p>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-3">
            <Field icon={Mail} type="email" placeholder="seu@email.com" value={email} onChange={setEmail} autoFocus />
            <Field icon={KeyRound} type="password" placeholder="senha" value={senha} onChange={setSenha} />

            <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Entrar
            </button>

            {err && <ErrorBox msg={err} />}

            <p className="text-center text-sm text-[#636E72] pt-2">
              Não tem conta?{" "}
              <button
                type="button"
                onClick={() => { setMode("signup"); setErr(null); }}
                className="font-display font-bold text-[#FF6B6B] hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="mt-8 space-y-3">
            <Field icon={User} type="text" placeholder="Seu nome" value={nome} onChange={setNome} autoFocus maxLength={40} />
            <Field icon={Mail} type="email" placeholder="seu@email.com" value={email} onChange={setEmail} />
            <Field icon={KeyRound} type="password" placeholder="senha (mín. 6)" value={senha} onChange={setSenha} />
            <Field icon={KeyRound} type="password" placeholder="confirmar senha" value={senha2} onChange={setSenha2} />

            <div className="pt-1">
              <div className="text-xs font-display font-bold text-[#636E72] mb-1.5">Cor do avatar</div>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((c) => {
                  const active = cor === c.color;
                  return (
                    <button
                      type="button"
                      key={c.color}
                      onClick={() => setCor(c.color)}
                      aria-label={c.label}
                      title={c.label}
                      className="w-9 h-9 rounded-full transition-all"
                      style={{
                        background: c.color,
                        outline: active ? `3px solid ${c.color}` : "none",
                        outlineOffset: 2,
                        transform: active ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Criar conta
            </button>

            {err && <ErrorBox msg={err} />}

            <p className="text-center text-sm text-[#636E72] pt-2">
              Já tem conta?{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setErr(null); }}
                className="font-display font-bold text-[#FF6B6B] hover:underline"
              >
                Entrar
              </button>
            </p>
          </form>
        )}

        <p className="text-center text-xs text-[#B2BEC3] mt-6">
          Família Viana • 21/06 → 04/07/2026
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, type, placeholder, value, onChange, autoFocus, maxLength }) {
  return (
    <label className="relative block">
      <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B2BEC3]" />
      <input
        type={type}
        autoFocus={autoFocus}
        maxLength={maxLength}
        autoComplete={type === "password" ? "current-password" : type}
        className="input pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-red-700 text-sm">
      {msg}
    </div>
  );
}
