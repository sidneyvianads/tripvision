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

// Carrega arquivo como Image, faz crop centralizado em quadrado, redimensiona pra
// `size` x `size` px e retorna Data URL JPEG com `quality`. Mantém banco enxuto.
export function fileToResizedDataUrl(file, size = 200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("Sem arquivo."));
    if (!file.type?.startsWith("image/")) {
      return reject(new Error("Arquivo precisa ser uma imagem."));
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const minSide = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - minSide) / 2;
        const sy = (img.naturalHeight - minSide) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não consegui ler a imagem."));
    };
    img.src = url;
  });
}
