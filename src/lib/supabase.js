import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON);

if (!isSupabaseConfigured) {
  console.warn("[TripVision] VITE_SUPABASE_URL/ANON_KEY ausentes — modo offline.");
}

export const supabase = createClient(
  SUPABASE_URL ?? "https://placeholder.supabase.co",
  SUPABASE_ANON ?? "placeholder-anon-key",
  { auth: { persistSession: false } }
);

export async function sha256Hex(text) {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Codepoints invisíveis que costumam vazar de autocomplete / paste / teclados
// mobile e quebrar a comparação de hash:
// U+00A0 NBSP, U+200B ZWSP, U+200C ZWNJ, U+200D ZWJ, U+2060 WORD JOINER, U+FEFF ZWNBSP/BOM
const INVISIBLE_CODEPOINTS = [0x00a0, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff];
const INVISIBLE_CHARS_RE = new RegExp(
  "[" + INVISIBLE_CODEPOINTS.map((cp) => "\\u" + cp.toString(16).padStart(4, "0")).join("") + "]",
  "g"
);

export function normalizePassword(s) {
  return (s ?? "")
    .normalize("NFC")
    .replace(INVISIBLE_CHARS_RE, "")
    .trim();
}

export function normalizeEmail(s) {
  return (s ?? "")
    .normalize("NFC")
    .replace(INVISIBLE_CHARS_RE, "")
    .trim()
    .toLowerCase();
}
