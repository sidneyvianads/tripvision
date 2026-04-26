# TripVision 🧳

App PWA da viagem da família Viana — **Serra Catarinense & Serra Gaúcha**, 21/06 → 04/07/2026.

## O que tem

- 🗓️ **Roteiro** dos 14 dias com expand/collapse, timeline de atividades, alertas
- ⏳ **Countdown** em tempo real para a viagem
- 💬 **Chat do grupo** (Supabase Realtime)
- 🤖 **Concierge IA** (Claude API via Netlify Function)
- ✅ **Checklist** colaborativo
- 📞 **Contatos** dos hotéis e restaurantes (com ligar/mapa)
- 🔐 **Login** Google + magic link por e-mail
- 📱 **PWA** instalável

## Stack

React 18 · Vite · Tailwind v4 · Supabase · Claude API · Netlify

## Como rodar

```bash
npm install
cp .env.example .env.local   # cole as keys do Supabase
npm run dev
```

Para subir, ver **[SETUP.md](./SETUP.md)** — tem tudo que precisa configurar no Supabase, Netlify e Anthropic.

## Estrutura

```
src/
  components/   Login, Layout, TabBar, Countdown, DayCard, DayDetail,
                ActivityItem, GroupChat, AiChat, Checklist, Contacts
  data/         tripData.js (14 dias + contatos + cidades + tipos)
  hooks/        useAuth, useChat
  lib/          supabase.js
  App.jsx       roteamento por tab
netlify/
  functions/
    chat.mjs    proxy para Claude API
```
