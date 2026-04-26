import { useCallback, useEffect, useState } from "react";
import { supabase, sha256Hex } from "../lib/supabase";

const SESSION_KEY = "tripvision:user:v2";

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.id ? parsed : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

export function useAuth() {
  const [user, setUser] = useState(() => loadSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("tv_users")
      .select("id, nome, email, avatar_cor, is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!active || !data) return;
        if (
          data.nome !== user.nome ||
          data.avatar_cor !== user.avatar_cor ||
          data.is_admin !== user.is_admin
        ) {
          saveSession(data);
          setUser(data);
        }
      });
    return () => { active = false; };
  }, [user?.id]);

  const signIn = useCallback(async (email, senha) => {
    setLoading(true);
    try {
      const cleanEmail = (email ?? "").trim().toLowerCase();
      const hash = await sha256Hex(senha);
      const { data, error } = await supabase
        .from("tv_users")
        .select("id, nome, email, avatar_cor, is_admin, senha_hash")
        .ilike("email", cleanEmail)
        .maybeSingle();
      if (error) {
        console.error("[TripVision] signIn error:", error);
        throw new Error(error.message);
      }
      if (!data) throw new Error("E-mail não encontrado. Cadastre-se primeiro.");
      if (data.senha_hash !== hash) throw new Error("Senha incorreta.");
      const { senha_hash: _omit, ...safe } = data;
      saveSession(safe);
      setUser(safe);
      return safe;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async ({ nome, email, senha, avatar_cor }) => {
    setLoading(true);
    try {
      const cleanNome  = (nome  ?? "").trim();
      const cleanEmail = (email ?? "").trim().toLowerCase();
      if (!cleanNome)  throw new Error("Informe seu nome.");
      if (!cleanEmail) throw new Error("Informe seu e-mail.");

      const { data: existing, error: checkErr } = await supabase
        .from("tv_users")
        .select("id, email")
        .ilike("email", cleanEmail)
        .maybeSingle();
      if (checkErr) {
        console.error("[TripVision] signUp pre-check error:", checkErr);
      } else if (existing) {
        throw new Error("Esse e-mail já está cadastrado. Faça login.");
      }

      const hash = await sha256Hex(senha);
      const { data, error } = await supabase
        .from("tv_users")
        .insert({
          nome: cleanNome,
          email: cleanEmail,
          senha_hash: hash,
          avatar_cor,
        })
        .select("id, nome, email, avatar_cor, is_admin")
        .single();

      if (error) {
        console.error("[TripVision] signUp insert error:", error);
        if (error.code === "23505") {
          throw new Error("Esse e-mail já está cadastrado. Faça login.");
        }
        throw new Error(`Erro ao criar conta: ${error.message ?? "desconhecido"}`);
      }
      if (!data) {
        throw new Error("Cadastro feito, mas não consegui ler de volta. Tente fazer login.");
      }

      saveSession(data);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return { user, loading, signIn, signUp, signOut };
}
