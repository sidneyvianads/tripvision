# TripVision 🧳

App PWA da viagem da família Viana — **Serra Catarinense & Serra Gaúcha**, 21/06 → 04/07/2026.

## O que tem

- 🗓️ **Roteiro** dos 14 dias com expand/collapse, timeline de atividades, alertas
- ⏳ **Countdown** em tempo real para a viagem
- 🤖 **Concierge IA** (Claude API via Netlify Function)
- ✅ **Checklist** local (salvo no navegador)
- 📞 **Contatos** dos hotéis e restaurantes (com ligar/mapa)
- 📱 **PWA** instalável

Sem login, sem backend de dados — abre direto no roteiro.

## Stack

React 19 · Vite 8 · Tailwind v4 · Claude API · Netlify

## Como rodar

```bash
npm install
npm run dev
```

Para ativar a IA local: ver **[SETUP.md](./SETUP.md)**.

## Estrutura

```
src/
  components/   Layout, TabBar, Countdown, DayCard, DayDetail,
                ActivityItem, AiChat, Checklist, Contacts
  data/         tripData.js (14 dias + contatos + cidades + tipos)
  App.jsx       roteamento por tab (3 abas)
netlify/
  functions/
    chat.mjs    proxy para Claude API
```
