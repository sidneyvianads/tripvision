import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { signInWithGoogle, signInWithEmail, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleGoogle = async () => {
    setErr(null);
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) setErr(error.message);
    setLoading(false);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErr(null);
    setLoading(true);
    const { error } = await signInWithEmail(email);
    setLoading(false);
    if (error) {
      setErr(error.message);
    } else {
      setSent(true);
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

        {!isConfigured && (
          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900 text-sm">
            ⚠️ Variáveis do Supabase ainda não configuradas. Adicione
            <code className="font-mono mx-1">VITE_SUPABASE_URL</code> e
            <code className="font-mono mx-1">VITE_SUPABASE_ANON_KEY</code>.
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={handleGoogle}
            className="btn-google w-full"
            disabled={loading}
          >
            <GoogleIcon />
            <span>Entrar com Google</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-[#FCE4D6]" />
            <span className="text-xs text-[#B2BEC3] font-bold">OU</span>
            <div className="h-px flex-1 bg-[#FCE4D6]" />
          </div>

          {sent ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-sm">
              ✅ Link mágico enviado para <strong>{email}</strong>! Cheque seu e-mail.
            </div>
          ) : (
            <form onSubmit={handleEmail} className="space-y-3">
              <input
                type="email"
                placeholder="seu@email.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn-primary w-full inline-flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Enviar link mágico
              </button>
            </form>
          )}

          {err && (
            <div className="text-sm text-red-600 mt-2">{err}</div>
          )}
        </div>

        <p className="text-center text-xs text-[#B2BEC3] mt-6">
          Família Viana • 21/06 → 04/07/2026
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853"/>
      <path d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
    </svg>
  );
}
