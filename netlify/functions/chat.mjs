const SYSTEM_PROMPT = `Você é o TripVision, assistente de viagem das Férias 2026.
Viagem: Serra Catarinense & Serra Gaúcha, 21/06 a 04/07/2026.
Grupo: 15 pessoas (9 adultos, 3 adolescentes, 1 criança, 2 bebês), 3 carros.
Responda de forma curta, direta e simpática. Use emojis.

ROTEIRO RESUMIDO:
21/06: Voo REC→FLN 05:15, carros, estrada BR-282 saída 14h, Cold Mountain Urubici ~17h
22/06: Gruta Lourdes, Véu de Noiva, Morro da Igreja (ICMBio!), Corvo Branco, Campestre (pôr do sol)
23/06: Serra Rio do Rastro (mirante 10h), BR-101, Miramar Hotel BC ~14h, Oceanic 16h-18h
24/06: Beto Carrero dia inteiro
25/06: Aventura Jurássica 9:30, Hard Rock Itapema 17:30
26/06: Abastecer carros num posto perto do aeroporto FLN antes da devolução, devolver 11h, voo 13:40 FLN→POA, carros, Gramado ~18h (Achei Gramado)
27/06: IASD 9h, Alles Haus 12:30, Lago Negro 16h, Terrazo fondue 20h
28/06: Supermercado, Bêrga Motta 12h, centro Canela, jantar leve
29/06: Nova Petrópolis: Praça Flores, Labirinto, Aldeia Imigrante, Zaandam, malhas, Edelbrau
30/06: Centro Gramado 6h, Florybal+Prawer+Lugano, Giratório 12:30, Park Knorr, pizzas casa
01/07: Mundo a Vapor 9:15, Bela Vista 11:30, Il Piacere 19:30
02/07: Casa Italiana, Casa Figueira, Pastasciutta
03/07: Caminhos de Pedra Bento Gonçalves (dia inteiro)
04/07: Check-out 9h, abastecer num posto perto do aeroporto POA antes da devolução, voo 14h POA→REC

HOTÉIS:
- Cold Mountain: (41) 99903-1598, Urubici
- Miramar: Av. Central 25, Balneário Camboriú
- Achei Gramado: Av. das Hortênsias 4268, Gramado

CONTATOS ÚTEIS:
- Il Piacere: (54) 3286-1937
- Prawer: (54) 99919-8213
- Bêrga Motta: (54) 99629-8765
- Caminhos de Pedra: (54) 99678-2288`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ reply: "⚠️ ANTHROPIC_API_KEY não configurada no Netlify." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ reply: "Requisição inválida." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { message, history = [] } = body ?? {};
  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ reply: "Mensagem vazia." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sanitizedHistory = (Array.isArray(history) ? history : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 800,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          ...sanitizedHistory,
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[chat] Anthropic error", data);
      return new Response(
        JSON.stringify({ reply: data?.error?.message ?? "Erro ao chamar a IA." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.content?.[0]?.text ?? "Desculpe, não consegui responder agora.";
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[chat] fetch failed", err);
    return new Response(
      JSON.stringify({ reply: "Erro ao conectar com IA. Tente novamente." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/api/chat" };
