# TripVision — passos manuais

App roda 100% client-side. Único passo manual: a chave da Anthropic para o Concierge IA.

## ANTHROPIC_API_KEY

Pegue em: https://console.anthropic.com/settings/keys

No painel do Netlify do site (`tripvision-230`):
**Site Settings → Environment variables → Add a variable**

| Nome                | Valor          | Scope     |
|---------------------|----------------|-----------|
| `ANTHROPIC_API_KEY` | `sk-ant-...`   | Functions |

Depois clique em **Trigger deploy → Deploy site** (não precisa limpar cache, é só uma env var de runtime).

## Local

Para testar a IA local:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npx netlify dev
```

Sem a key, o app roda normalmente — a aba IA mostra "ANTHROPIC_API_KEY não configurada".
