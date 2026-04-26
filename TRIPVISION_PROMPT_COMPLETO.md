# PROMPT PARA CLAUDE CODE — TripVision

## Skills obrigatórias (ler antes de começar)

```
/read supabase-developer
/read webapp-testing
/read my-claude-setup
```

## Missão

Criar do ZERO o projeto **TripVision** — app web PWA de acompanhamento de viagem em grupo. É pra família do Sidney Viana (15 pessoas) que vai viajar pela Serra Catarinense e Serra Gaúcha de 21/06 a 04/07/2026.

O app precisa ter: roteiro visual dos 14 dias, chat em grupo (tempo real), concierge IA (Claude API), login com Google, checklist compartilhado e lista de contatos.

**REGRA DE OURO DO DESIGN:** O app precisa ter cara de ALEGRIA DE VIAGEM. Cores quentes (coral, laranja, verde, amarelo), emojis, cantos arredondados, visual festivo. NADA de layout escuro, corporativo ou genérico de "AI app". Pense num app que a família inteira vai abrir sorrindo.

---

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Auth/DB/Realtime:** Supabase
- **IA:** Claude API via Netlify Functions
- **Deploy:** Netlify
- **Repo:** GitHub `sidneyvianads/tripvision`
- **Fontes:** Google Fonts — Nunito (títulos) + DM Sans (corpo)
- **Ícones:** lucide-react

---

## Passo 1 — Criar projeto

```bash
npm create vite@latest tripvision -- --template react
cd tripvision
npm install @supabase/supabase-js lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

Configurar `vite.config.js` com plugin Tailwind.
Configurar `index.css` com `@import "tailwindcss"`.
Adicionar fontes Nunito e DM Sans via Google Fonts no `index.html`.

---

## Passo 2 — Estrutura de pastas

```
tripvision/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Countdown.jsx
│   │   ├── DayCard.jsx
│   │   ├── DayDetail.jsx
│   │   ├── ActivityItem.jsx
│   │   ├── GroupChat.jsx
│   │   ├── AiChat.jsx
│   │   ├── Checklist.jsx
│   │   ├── Contacts.jsx
│   │   └── TabBar.jsx
│   ├── data/
│   │   └── tripData.js
│   ├── lib/
│   │   └── supabase.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useChat.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── netlify/
│   └── functions/
│       └── chat.mjs
├── netlify.toml
├── index.html
├── vite.config.js
└── package.json
```

---

## Passo 3 — Design System

### Paleta de cores (usar como CSS variables e Tailwind extend)

```
--coral: #FF6B6B
--laranja: #FF8E53
--verde: #2ECC71
--azul: #3498DB
--amarelo: #F1C40F
--bg: #FFF9F5 (creme quente, NÃO branco puro)
--card: #FFFFFF
--text: #2D3436
--text-light: #636E72
--text-muted: #B2BEC3
```

### Cores por cidade
```
Urubici: { gradient: "#1a5276 → #2e86c1", badge: "#D6EAF8", icon: "🏔️" }
Balneário Camboriú: { gradient: "#0e6655 → #1abc9c", badge: "#D1F2EB", icon: "🏖️" }
Gramado: { gradient: "#1e8449 → #27ae60", badge: "#D5F5E3", icon: "🌲" }
Recife: { gradient: "#b7950b → #f39c12", badge: "#FEF9E7", icon: "🌴" }
```

### Tipografia
- Títulos: font-family: 'Nunito', sans-serif; font-weight: 800
- Corpo: font-family: 'DM Sans', sans-serif; font-weight: 400
- Números/horários: font-variant-numeric: tabular-nums

### Componentes visuais
- Border-radius: 16px em cards, 12px em botões, 24px em badges
- Sombras: `0 2px 12px rgba(255,107,107,0.08)` (sombra rosada suave)
- Tab bar: fundo branco com sombra pra cima, ícones com labels
- Header: gradiente coral → laranja com texto branco
- Cards de dia: borda-left de 4px na cor da cidade
- Botões primários: gradiente coral → laranja, texto branco, bold
- Inputs: borda arredondada, foco com glow laranja suave

---

## Passo 4 — Telas do App

### 4.1 Login (Login.jsx)
- Fundo: gradiente coral → laranja → amarelo suave, cobrindo tela toda
- Centro: card branco com:
  - Emoji grande "🧳" ou "✈️"
  - Logo "TripVision" em Nunito 800
  - Subtítulo "Serra Catarinense & Gaúcha 2026"
  - Botão "Entrar com Google" (estilo Google, ícone G)
  - Divider "ou"
  - Campo email + botão "Enviar link mágico"
- Animação: card entra com fade-in + slide-up

### 4.2 Home — Roteiro (tab principal)
- Header fixo: gradiente, "TripVision 🧳", nome do usuário logado
- Countdown: card arredondado mostrando dias + horas pra viagem (ou "Em andamento!" se já começou, ou "Viagem concluída 🎉" se acabou)
- Lista de DayCards: scroll vertical, cada card mostra dia, data, título, cidade (badge colorido), emoji, número de atividades
- Ao clicar: expande inline (accordion) mostrando a timeline de atividades

### 4.3 DayCard expandido
- Header: gradiente da cor da cidade + emoji grande + título do dia
- Se tem alert: banner amarelo com ícone ⚠️
- Timeline: linha vertical colorida à esquerda, cada atividade é um nó:
  - Bolinha colorida por tipo (🚗 transporte = roxo, ✨ passeio = verde, 🍽️ alimentação = laranja, 🏨 hospedagem = azul)
  - Horário em destaque
  - Título + descrição
  - Badge de preço se tiver (verde)
  - Se status "aberto": texto cinza claro + badge "em aberto"
- Rodapé: info do hotel se tiver

### 4.4 Chat do Grupo (GroupChat.jsx)
- Estilo WhatsApp: mensagens alinhadas (minhas à direita, dos outros à esquerda)
- Cada mensagem: nome (bold) + texto + hora (pequeno, cinza)
- Avatar circular com inicial do nome + cor aleatória
- Input fixo no rodapé: campo + botão enviar (ícone Send)
- Supabase Realtime: subscribe na tabela messages, novos messages aparecem instantaneamente
- Scroll automático pra baixo ao receber mensagem

### 4.5 Concierge IA (AiChat.jsx)
- Visual diferente do chat grupo: fundo levemente azulado
- Avatar do bot: emoji 🤖 com fundo azul
- Mensagem inicial: "Olá! Sou o TripVision IA 🧳 Pergunte qualquer coisa sobre a viagem!"
- Input: campo + botão enviar
- Loading: animação de 3 pontinhos enquanto espera resposta
- Chama Netlify Function `/api/chat` com mensagem + histórico
- Histórico fica em state local (não persiste no banco)

### 4.6 Checklist (Checklist.jsx)
- Barra de progresso no topo: "X de Y concluídos" + barra colorida (coral → verde conforme avança)
- Cards por categoria: "📋 Antes da viagem" e "⛽ Durante a viagem"
- Cada item: checkbox arredondado + texto + quem concluiu (avatar pequeno)
- Ao marcar: atualiza Supabase (concluido = true, concluido_por = user_id)
- Dados vêm do Supabase (tabela checklist), realtime updates

### 4.7 Contatos (Contacts.jsx)
- Lista com cards: nome, local (badge cor da cidade), telefone
- Botão de telefone: `<a href="tel:...">` que abre o discador no celular
- Botão de mapa: link pro Google Maps
- Acessível via ícone no header (não na tab bar)

### 4.8 Tab Bar (TabBar.jsx)
- Fixo no rodapé, fundo branco, sombra pra cima
- 4 tabs com ícone + label:
  - 📅 Roteiro (CalendarDays do lucide)
  - 💬 Chat (MessageCircle do lucide)
  - 🤖 IA (Bot do lucide)
  - ✅ Tarefas (CheckSquare do lucide)
- Tab ativa: cor coral, ícone preenchido
- Tab inativa: cinza

---

## Passo 5 — Supabase

### 5.1 Criar projeto Supabase
- Nome: tripvision
- Região: South America (São Paulo)
- Anotar URL e anon key

### 5.2 Configurar Auth
- Providers: Google (configurar OAuth credentials) + Email (magic link)
- Site URL: https://tripvision.netlify.app
- Redirect URLs: https://tripvision.netlify.app, http://localhost:5173

### 5.3 Rodar SQL

```sql
-- Perfis
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Checklist
CREATE TABLE checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  concluido BOOLEAN DEFAULT false,
  concluido_por UUID REFERENCES profiles(id),
  concluido_at TIMESTAMPTZ,
  ordem INTEGER NOT NULL
);

ALTER TABLE checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checklist_select" ON checklist FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "checklist_update" ON checklist FOR UPDATE USING (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE checklist;

-- Seed checklist
INSERT INTO checklist (categoria, titulo, ordem) VALUES
('antes', 'Autorização ICMBio (Morro da Igreja)', 1),
('antes', 'Reservar Terrazo pra 15 pessoas (27/06)', 2),
('antes', 'Reservar Il Piacere pra 15 pessoas (01/07)', 3),
('antes', 'Agendar Prawer visita guiada (30/06)', 4),
('antes', 'Agendar Caminhos de Pedra (03/07)', 5),
('antes', 'Comprar ingresso Oceanic Aquarium', 6),
('antes', 'Comprar ingresso Aventura Jurássica', 7),
('antes', 'Comprar ingresso Beto Carrero', 8),
('antes', 'Comprar ingresso Mundo a Vapor', 9),
('antes', 'Comprar ingresso Café Colonial Bela Vista', 10),
('durante', 'Abastecer carros noite 25/06 (antes devolver FLN)', 11),
('durante', 'Abastecer carros noite 03/07 (antes devolver POA)', 12),
('durante', 'Conferir condições Serra do Rio do Rastro (manhã 23/06)', 13),
('durante', 'Levar remédio de enjoo (Serra do Rio do Rastro)', 14),
('durante', 'Agasalhos reforçados para Urubici', 15),
('durante', 'Roupa extra crianças (Aventura Jurássica tem chafariz)', 16);
```

---

## Passo 6 — Dados do roteiro (src/data/tripData.js)

Criar o arquivo com export default de um array com os 14 dias. Cada dia tem:

```javascript
{
  date: "2026-06-21",
  day: 1,
  weekday: "Dom",
  title: "Recife → Urubici",
  city: "Urubici",
  hotel: "Cabanas Cold Mountain",
  hotelPhone: "(41) 99903-1598",
  hotelAddress: "SC-110 Águas Brancas, 250",
  cover: "🛫",
  alert: null, // ou string com alerta
  activities: [
    {
      time: "05:15",
      title: "Voo REC → FLN",
      type: "transporte", // transporte | passeio | alimentacao | hospedagem | livre
      desc: "Chegada 11:05",
      price: null, // ou "R$79,90"
      status: "confirmado", // confirmado | aberto
    },
    // ... mais atividades
  ]
}
```

### Dados completos dos 14 dias:

**DIA 1 (21/06 Dom) — Recife → Urubici** 🛫
- 05:15 | Voo REC → FLN | transporte | Chegada 11:05
- 11:30 | Retirada 3 carros | transporte | Locadoras no aeroporto
- 13:00 | Almoço | alimentacao | Próximo ao aeroporto
- 14:00 | Estrada pra Urubici! | transporte | BR-282 via Alfredo Wagner • ~175 km • ~3h
- 16:30 | Chegada Cold Mountain | hospedagem | SC-110 Águas Brancas, 250
- 19:30 | Jantar em Urubici | alimentacao | aberto | Semola, La Fondue, Montês, Manali ou Pizzaria Royal
- Hotel: Cabanas Cold Mountain | (41) 99903-1598

**DIA 2 (22/06 Seg) — Passeios Urubici** 🏔️
- Alert: Solicitar autorização ICMBio com antecedência!
- 08:30 | Saída do hotel | transporte
- 09:15 | Gruta N. Sra. de Lourdes | passeio | Gratuita, ~20 min
- 09:45 | Cascata Véu de Noiva | passeio | Mirante + trilha rápida
- 11:00 | Morro da Igreja + Pedra Furada | passeio | 1.822m — ponto mais alto do sul do Brasil!
- 13:00 | Serra do Corvo Branco | passeio | Paredões de 90m
- 14:00 | Almoço em Urubici | alimentacao
- 16:00 | Morro do Campestre | passeio | Pôr do sol ~17:30 🌅
- Hotel: Cabanas Cold Mountain

**DIA 3 (23/06 Ter) — Serra do Rio do Rastro → BC** 🐠
- Alert: Conferir condições da serra na manhã!
- 08:30 | Saída Cold Mountain | transporte
- 10:00 | Mirante Serra do Rio do Rastro | passeio | 1.421m • 284 curvas! Parada 30 min
- 14:00 | Chegada Miramar Hotel | hospedagem | 100m da Praia Central
- 16:00 | Oceanic Aquarium | passeio | R$79,90 | Bebês grátis!
- 19:00 | Jantar na rua | alimentacao | aberto
- Hotel: Miramar Hotel | Av. Central, 25

**DIA 4 (24/06 Qua) — Beto Carrero World** 🎢
- 08:00 | Saída pro Beto Carrero | transporte | Penha, ~40 min
- 09:00 | Beto Carrero World! | passeio | Dia inteiro! Cupom MDESTINOS10
- 20:00 | Volta + jantar na rua | alimentacao | aberto
- Hotel: Miramar Hotel

**DIA 5 (25/06 Qui) — Dinossauros + Hard Rock** 🦕
- 09:30 | Aventura Jurássica | passeio | R$79,90 | 100+ dinos animatrônicos!
- 13:00 | Volta hotel + descanso | hospedagem
- 17:30 | Hard Rock Cafe Itapema | passeio | 1° Hard Rock sobre a água do mundo! 🎸
- Hotel: Miramar Hotel

**DIA 6 (26/06 Sex) — Voo → Gramado** ✈️
- Alert: Abastecer carros na noite anterior!
- 08:30 | Check-out Miramar | transporte
- 11:00 | Devolver 3 carros FLN | transporte | Prazo: 11h
- 13:40 | Voo FLN → POA | transporte | Chegada 14:45
- 16:00 | Estrada → Gramado | transporte | ~1h40
- 18:00 | Chegada Achei Gramado | hospedagem | Retirada das chaves
- 19:30 | Jantar | alimentacao | aberto
- Hotel: Achei Gramado | Av. das Hortênsias, 4268

**DIA 7 (27/06 Sáb) — IASD + Alles Haus + Fondue** 🧀
- 09:00 | Culto IASD Gramado | passeio | R. Serafim Benetti, 323
- 12:30 | Almoço Alles Haus | alimentacao | Restaurante à beira do açude 🌊
- 16:00 | Lago Negro | passeio | Pedalinhos + fotos 📸
- 20:00 | Fondue Terrazo | alimentacao | R$98 | Canela
- Hotel: Achei Gramado

**DIA 8 (28/06 Dom) — Bêrga Motta + Canela** 🍲
- 09:00 | Supermercado | passeio
- 11:00 | Fila + trilha Ecoparque | passeio
- 12:00 | Almoço Bêrga Motta | alimentacao | Comfort food no fogão a lenha 🔥
- 15:30 | Centro de Canela | passeio | Catedral de Pedra ⛪
- 18:30 | Jantar leve Canela | alimentacao | aberto
- Hotel: Achei Gramado

**DIA 9 (29/06 Seg) — Nova Petrópolis** 🌷
- 08:00 | Café em casa | alimentacao
- 10:15 | Praça das Flores + Labirinto | passeio | Gratuito 🌸
- 11:00 | Aldeia do Imigrante | passeio | R$34
- 13:00 | Almoço Zaandam | alimentacao | Restaurante holandês 🇳🇱
- 14:30 | Compras de malhas | passeio | Galeria do Imigrante 🧣
- 16:00 | Rua Coberta + Edelbrau | passeio | R$55 | Cervejaria 🍺
- 19:30 | Jantar | alimentacao | aberto
- Hotel: Achei Gramado

**DIA 10 (30/06 Ter) — Chocolate + Giratório + Knorr** 🍫
- 06:00 | Passeio centro Gramado | passeio | Rua Torta, Igreja, Fonte do Amor, Rua Coberta 📸
- 08:30 | Café em casa | alimentacao
- 09:30 | Florybal | passeio | Grátis! Cascata de chocolate 🤤
- 10:30 | Prawer | passeio | R$98 | Visita guiada — AGENDAR!
- 11:30 | Lugano | passeio | Grátis + degustação
- 12:30 | Restaurante Giratório | alimentacao | Vista 360° Vale do Quilombo 🔄
- 14:30 | Park Knorr | passeio | R$49 | Casa bávara 1940 + trilhas
- 19:00 | Pizzas em casa 🍕 | alimentacao
- Hotel: Achei Gramado

**DIA 11 (01/07 Qua) — Mundo a Vapor + Bela Vista** 🚂
- 08:00 | Café em casa | alimentacao
- 09:15 | Mundo a Vapor + Roda Canela | passeio | R$179 | 10 salas imersivas + roda-gigante 52m!
- 11:30 | Café Colonial Bela Vista | alimentacao | R$130 | 1° do Brasil! 80+ opções 🤩
- 14:00 | Tarde livre | livre | aberto
- 19:30 | Il Piacere | alimentacao | Carnes nobres + pizzas forno à lenha 🔥
- Hotel: Achei Gramado

**DIA 12 (02/07 Qui) — Casa Italiana + Pastasciutta** 🇮🇹
- 08:00 | Café em casa | alimentacao
- 09:30 | Memorial Casa Italiana | passeio | R$15 | Praça das Etnias
- 12:00 | Almoço Casa Figueira | alimentacao
- 14:00 | Tarde livre | livre | aberto
- 19:30 | Cantina Pastasciutta | alimentacao | Massas artesanais 🍝
- Hotel: Achei Gramado

**DIA 13 (03/07 Sex) — Caminhos de Pedra** 🍇
- Alert: Agendar nos estabelecimentos (grupo 15+)!
- 07:30 | Café em casa | alimentacao
- 08:00 | Saída p/ Bento Gonçalves | transporte | ~1h40
- 10:00 | Caminhos de Pedra | passeio | 12 km de casarões centenários 🏛️
- 13:00 | Almoço Casa Fracalossi | alimentacao | Comida italiana típica
- 14:30 | Cantina Strapazzon + vinícola | passeio | Cenário filme O Quatrilho 🎬
- 17:00 | Volta pra Gramado | transporte
- 19:30 | Jantar | alimentacao | aberto
- Hotel: Achei Gramado

**DIA 14 (04/07 Sáb) — Volta pra casa!** 🏠
- Alert: Abastecer carros na noite anterior!
- 08:00 | Café + malas | alimentacao
- 09:00 | Check-out + saída | transporte
- 10:40 | Aeroporto POA | transporte | Devolver 3 carros
- 14:00 | Voo POA → Recife | transporte | Chegada ~19:30 🌴

---

## Passo 7 — Contatos (hardcoded)

```javascript
export const CONTATOS = [
  { nome: "Cold Mountain", tel: "(41) 99903-1598", loc: "Urubici", city: "Urubici" },
  { nome: "Miramar Hotel", tel: "", endereco: "Av. Central, 25", loc: "Balneário Camboriú", city: "Balneário Camboriú" },
  { nome: "Achei Gramado", tel: "", endereco: "Av. das Hortênsias, 4268", loc: "Gramado", city: "Gramado" },
  { nome: "Bêrga Motta", tel: "(54) 99629-8765", loc: "Canela (Ecoparque Sperry)", city: "Gramado" },
  { nome: "Terrazo Fondue", tel: "", endereco: "Av. Osvaldo Aranha, 251", loc: "Canela", city: "Gramado" },
  { nome: "Il Piacere", tel: "(54) 3286-1937", endereco: "Av. Borges de Medeiros, 1991", loc: "Gramado", city: "Gramado" },
  { nome: "Prawer", tel: "(54) 99919-8213", endereco: "Av. das Hortênsias, 4100", loc: "Gramado", city: "Gramado" },
  { nome: "Vinícola Jolimont", tel: "(54) 99677-5995", loc: "Canela", city: "Gramado" },
  { nome: "Caminhos de Pedra", tel: "(54) 99678-2288", loc: "Bento Gonçalves", city: "Gramado" },
  { nome: "ICMBio (Morro da Igreja)", tel: "Formulário online", loc: "Urubici", city: "Urubici" },
];
```

---

## Passo 8 — Concierge IA (Netlify Function)

Criar `netlify/functions/chat.mjs`:

```javascript
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { message, history = [] } = await req.json();

  const SYSTEM_PROMPT = `Você é o TripVision, assistente de viagem da família Viana.
Viagem: Serra Catarinense & Serra Gaúcha, 21/06 a 04/07/2026.
Grupo: 15 pessoas (9 adultos, 3 adolescentes, 1 criança, 2 bebês), 3 carros.
Responda de forma curta, direta e simpática. Use emojis.

ROTEIRO RESUMIDO:
21/06: Voo REC→FLN 05:15, carros, estrada BR-282 saída 14h, Cold Mountain Urubici ~17h
22/06: Gruta Lourdes, Véu de Noiva, Morro da Igreja (ICMBio!), Corvo Branco, Campestre (pôr do sol)
23/06: Serra Rio do Rastro (mirante 10h), BR-101, Miramar Hotel BC ~14h, Oceanic 16h-18h
24/06: Beto Carrero dia inteiro
25/06: Aventura Jurássica 9:30, Hard Rock Itapema 17:30
26/06: Devolver carros 11h FLN, voo 13:40 FLN→POA, carros, Gramado ~18h (Achei Gramado)
27/06: IASD 9h, Alles Haus 12:30, Lago Negro 16h, Terrazo fondue 20h
28/06: Supermercado, Bêrga Motta 12h, centro Canela, jantar leve
29/06: Nova Petrópolis: Praça Flores, Labirinto, Aldeia Imigrante, Zaandam, malhas, Edelbrau
30/06: Centro Gramado 6h, Florybal+Prawer+Lugano, Giratório 12:30, Park Knorr, pizzas casa
01/07: Mundo a Vapor 9:15, Bela Vista 11:30, Il Piacere 19:30
02/07: Casa Italiana, Casa Figueira, Pastasciutta
03/07: Caminhos de Pedra Bento Gonçalves (dia inteiro)
04/07: Check-out 9h, aeroporto POA, voo 14h POA→REC

HOTÉIS:
- Cold Mountain: (41) 99903-1598, Urubici
- Miramar: Av. Central 25, Balneário Camboriú
- Achei Gramado: Av. das Hortênsias 4268, Gramado

CONTATOS ÚTEIS:
- Il Piacere: (54) 3286-1937
- Prawer: (54) 99919-8213
- Bêrga Motta: (54) 99629-8765
- Caminhos de Pedra: (54) 99678-2288`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [
          ...history.slice(-10),
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Desculpe, não consegui responder agora.";
    
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ reply: "Erro ao conectar com IA. Tente novamente." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/chat" };
```

---

## Passo 9 — netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[context.production.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Passo 10 — PWA Manifest

Criar `public/manifest.json`:

```json
{
  "name": "TripVision",
  "short_name": "TripVision",
  "description": "Roteiro da viagem 2026",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF9F5",
  "theme_color": "#FF6B6B",
  "icons": [
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧳</text></svg>",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

Adicionar no `index.html`: `<link rel="manifest" href="/manifest.json">`

---

## Passo 11 — Deploy

1. `git init && git add . && git commit -m "TripVision v1"`
2. `gh repo create sidneyvianads/tripvision --public --source=. --push`
3. No Netlify: Import from GitHub → sidneyvianads/tripvision
4. Configurar variáveis de ambiente no Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
5. Deploy!

---

## Checklist de qualidade

- [ ] Login funciona (Google + magic link)
- [ ] Roteiro mostra os 14 dias com expand/collapse
- [ ] Countdown atualiza em tempo real
- [ ] Chat do grupo envia e recebe em tempo real
- [ ] Concierge IA responde perguntas sobre a viagem
- [ ] Checklist marca/desmarca e sincroniza
- [ ] Contatos aparecem com botão de ligar
- [ ] Tab bar navega entre as 4 telas
- [ ] Visual é VIBRANTE e ALEGRE (NÃO escuro/corporativo)
- [ ] Funciona bem no celular (mobile-first)
- [ ] PWA: instala como app no celular
- [ ] Deploy no Netlify ok
