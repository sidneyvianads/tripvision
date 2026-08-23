# TripVision SaaS — Documento de Fundação Comercial

## Visão do Produto

**TripVision** é uma plataforma SaaS onde o usuário planeja viagens inteiras conversando com uma IA que pesquisa destinos, preços, restaurantes, hotéis e monta o roteiro automaticamente — transformando a conversa em um app visual compartilhável com o grupo de viagem.

**Tagline:** "Planeje sua viagem conversando. A IA faz o resto."

**O diferencial:** Nenhum app de viagem no mercado planeja conversando. Tripit organiza, Google Travel agrega, mas nenhum constrói o roteiro junto com você em linguagem natural, pesquisando preços e sugerindo paradas em tempo real. O TripVision faz isso.

**Origem:** Validado organicamente — o fundador planejou uma viagem real de 14 dias (Serra Catarinense + Serra Gaúcha) conversando com IA, e o resultado se transformou neste produto.

---

## Público-Alvo

**Primário:** Famílias e grupos de amigos (5–20 pessoas) planejando viagens nacionais de 3–15 dias. Classe B/C, 25–55 anos, smartphone como dispositivo principal.

**Secundário:** Casais e viajantes solo que querem planejar sem pesquisar em 10 sites diferentes.

**Terciário (futuro):** Agências de turismo pequenas que querem oferecer planejamento assistido por IA aos clientes.

---

## Modelo de Negócio

### Planos

| | Free | Pro | Grupo |
|---|---|---|---|
| Preço | R$0 | R$14,90/mês ou R$119,90/ano | R$29,90/mês ou R$239,90/ano |
| Viagens ativas | 1 | 5 | 10 |
| Planejamento por IA | Não | Sim (ilimitado) | Sim (ilimitado) |
| Montagem manual (campos) | Sim | Sim | Sim |
| Compartilhar com grupo | Até 5 pessoas | Até 15 pessoas | Até 30 pessoas |
| Chat do grupo | Não | Sim | Sim |
| Checklist compartilhado | Básico (5 itens) | Ilimitado | Ilimitado |
| Concierge IA no app | Não | Sim | Sim |
| Pesquisa online (preços, restaurantes) | Não | Sim | Sim |
| Painel admin (editar roteiro) | Não | Sim | Sim |
| Fotos de perfil | Sim | Sim | Sim |
| PWA (instalar no celular) | Sim | Sim | Sim |
| Suporte | Comunidade | Email | Prioritário |

### Justificativa de preço

- Custo médio da API Claude por conversa de planejamento: R$0,50–3,00 (dependendo da complexidade)
- Custo web search por planejamento: R$0,10–0,50
- Custo Supabase por usuário/mês: ~R$0,05
- Custo Netlify: R$0 (free tier até 100GB)
- **Margem bruta no Pro:** ~75–85%
- **Break-even:** ~200 assinantes Pro

### Receita adicional (Fase 2+)

1. **Parcerias/Afiliados:** Restaurantes, hotéis, passeios pagam comissão quando a IA os sugere e o usuário converte (reserva, compra ingresso). Modelo CPA (custo por aquisição) ou CPC.
2. **Destaque patrocinado:** Estabelecimentos pagam pra aparecer como "sugestão destacada" quando a IA recomenda opções na região. Sempre identificado como patrocinado.
3. **API white-label:** Agências de turismo usam o motor de planejamento do TripVision na própria marca.

---

## Fluxo do Usuário

### Fluxo Free (formulário manual)

```
Cadastro → Nova Viagem → Preencher campos:
  - Nome da viagem
  - Data início / Data fim
  - Cidades (adicionar)
  - Para cada dia:
    - Adicionar atividade → tipo (transporte/passeio/alimentação/hospedagem)
    - Preencher: horário, título, descrição, endereço, preço
  → Roteiro visual montado
  → Compartilhar link com grupo
  → Grupo acessa via PWA
```

### Fluxo Pro (IA conversacional) — O DIFERENCIAL

```
Cadastro → Assinar Pro → Nova Viagem → Chat com IA:

Usuário: "Vou viajar com a família pra Gramado, 5 dias em julho, 
         somos 8 adultos e 2 crianças"

IA: "Ótimo! Vocês vão de avião ou carro? De onde saem?"

Usuário: "De São Paulo, avião"

IA: [pesquisa voos, aeroportos] "O aeroporto mais perto é Porto Alegre, 
    ~1h40 de carro até Gramado. Querem alugar carro lá?"

Usuário: "Sim, 2 carros"

IA: "Perfeito. Já tenho o dia 1: voo SP→POA, 2 carros, estrada até Gramado.
    Que tipo de hospedagem preferem? Hotel, pousada ou aluguel por temporada?"

[... conversa continua, IA pesquisa hotéis, restaurantes, passeios,
    monta o roteiro dia a dia, sugere opções com preço e endereço ...]

→ Ao final: roteiro completo montado automaticamente
→ Usuário revisa e ajusta
→ Compartilha com grupo
→ Grupo acessa via PWA com chat, checklist, concierge
```

### Fluxo de compartilhamento

```
Dono cria viagem → Gera link de convite
→ Grupo recebe link no WhatsApp
→ Abre no celular → Cadastra nome + foto
→ Vê roteiro + chat + checklist
→ Instala como PWA (opcional)
```

---

## Arquitetura Técnica

### Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React + Vite + Tailwind | Rápido, leve, PWA |
| Backend/Auth | Supabase | Auth, DB, Realtime, Storage |
| IA | Claude API (Sonnet) | Melhor qualidade em português |
| Web Search | Claude com web search tool | Pesquisa preços, restaurantes |
| Pagamento | Stripe ou Mercado Pago | Assinaturas recorrentes |
| Deploy | Netlify | CI/CD automático, functions |
| Domínio | tripvision.com.br ou tripvision.app | Registrar ambos |

### Estrutura do banco (Supabase)

```sql
-- Usuários (Supabase Auth + tabela extra)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  plano TEXT DEFAULT 'free' CHECK (plano IN ('free', 'pro', 'grupo')),
  plano_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Viagens
CREATE TABLE viagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) NOT NULL,
  nome TEXT NOT NULL,
  data_inicio DATE,
  data_fim DATE,
  cidades TEXT[], -- array de cidades
  num_pessoas INTEGER,
  descricao TEXT,
  link_convite TEXT UNIQUE, -- slug único pra compartilhar
  config JSONB, -- configurações extras
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Membros da viagem
CREATE TABLE viagem_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viagem_id UUID REFERENCES viagens(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'membro' CHECK (role IN ('admin', 'membro')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(viagem_id, user_id)
);

-- Dias do roteiro
CREATE TABLE roteiro_dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viagem_id UUID REFERENCES viagens(id) ON DELETE CASCADE,
  dia_numero INTEGER NOT NULL,
  data DATE,
  titulo TEXT,
  cidade TEXT,
  hotel TEXT,
  hotel_telefone TEXT,
  hotel_endereco TEXT,
  alerta TEXT,
  cover_emoji TEXT,
  UNIQUE(viagem_id, dia_numero)
);

-- Atividades
CREATE TABLE roteiro_atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_id UUID REFERENCES roteiro_dias(id) ON DELETE CASCADE,
  horario TIME,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('transporte', 'passeio', 'alimentacao', 'hospedagem', 'livre')),
  preco TEXT,
  status TEXT DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'pendente', 'aberto')),
  endereco TEXT,
  telefone TEXT,
  maps_url TEXT,
  ordem INTEGER NOT NULL
);

-- Chat por viagem
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viagem_id UUID REFERENCES viagens(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Checklist por viagem
CREATE TABLE checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viagem_id UUID REFERENCES viagens(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  categoria TEXT,
  concluido BOOLEAN DEFAULT false,
  concluido_por UUID REFERENCES users(id),
  ordem INTEGER
);

-- Histórico de conversas com IA (pra montar roteiro)
CREATE TABLE ia_conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viagem_id UUID REFERENCES viagens(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  messages JSONB NOT NULL, -- array de {role, content}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assinaturas
CREATE TABLE assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plano TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'past_due')),
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### System Prompt do Motor de Planejamento IA

```
Você é o TripVision, um planejador de viagens inteligente.

Seu objetivo é ajudar o usuário a montar o roteiro completo de uma viagem
conversando naturalmente. Você deve:

1. ENTENDER a viagem: perguntar destino, datas, quantas pessoas, tipo de
   grupo (família, amigos, casal), orçamento, preferências

2. PESQUISAR em tempo real: usar web search pra encontrar voos, hotéis,
   restaurantes, passeios, preços, horários de funcionamento, endereços

3. SUGERIR opções: apresentar 2-3 alternativas com preço e justificativa,
   deixar o usuário escolher

4. MONTAR o roteiro: a cada decisão do usuário, encaixar no roteiro
   estruturado com horários, endereços e observações

5. ALERTAR sobre detalhes: autorização necessária, horário de funcionamento,
   distância entre pontos, clima, documentos

REGRAS:
- Responda em português brasileiro
- Use emojis com moderação
- Seja direto e prático
- Quando pesquisar, traga PREÇO e ENDEREÇO
- Sugira mas deixe o usuário decidir
- Ao final de cada bloco de decisões, resuma o que ficou definido
- Pergunte uma coisa por vez (não bombardeie de perguntas)

FORMATO DE SAÍDA:
Quando tiver atividades definidas, retorne também um JSON estruturado
no final da mensagem (entre tags <roteiro_update>):

<roteiro_update>
{
  "dia": 1,
  "atividades": [
    {
      "horario": "14:00",
      "titulo": "Saída pro hotel",
      "tipo": "transporte",
      "descricao": "BR-282, ~175 km",
      "preco": null,
      "status": "confirmado"
    }
  ]
}
</roteiro_update>

O frontend vai parsear esse JSON e atualizar o roteiro visual em tempo real.
```

---

## Roadmap

### Fase 1 — MVP (4-6 semanas)
**Objetivo:** Lançar versão funcional com planejamento por IA

- [ ] Multi-tenant: cada usuário cria suas viagens
- [ ] Cadastro/login com Supabase Auth (Google + email)
- [ ] Tela "Minhas Viagens" (criar, listar, deletar)
- [ ] Fluxo Free: criar viagem por formulário (preencher campos)
- [ ] Fluxo Pro: criar viagem conversando com IA
- [ ] Motor IA: Claude API com web search, parsear JSON do roteiro
- [ ] Roteiro visual (timeline, cards por dia, atividades)
- [ ] Compartilhar viagem via link de convite
- [ ] Chat do grupo por viagem
- [ ] Checklist por viagem
- [ ] Concierge IA por viagem
- [ ] Painel admin (dono edita roteiro)
- [ ] "Quem vai" com fotos
- [ ] PWA
- [ ] Landing page com CTA
- [ ] Plano Free funcionando (sem pagamento ainda)

### Fase 2 — Monetização (semanas 7-10)
**Objetivo:** Ativar pagamentos e lançar Pro

- [ ] Integração Stripe ou Mercado Pago
- [ ] Paywall: IA só funciona no Pro
- [ ] Página de preços
- [ ] Trial de 7 dias do Pro
- [ ] Webhooks de pagamento (ativar/desativar plano)
- [ ] Email transacional (confirmação, lembrete de pagamento)
- [ ] Dashboard de métricas (usuários, assinaturas, viagens)

### Fase 3 — Crescimento (semanas 11-16)
**Objetivo:** Escalar e reter

- [ ] Notificações push (PWA)
- [ ] Lembretes WhatsApp (Z-API) — premium
- [ ] Templates de viagem prontos (Gramado, Nordeste, etc.)
- [ ] Copiar roteiro de outro usuário (público)
- [ ] Review/avaliação pós-viagem
- [ ] SEO: páginas públicas de roteiros populares
- [ ] Integração Google Calendar (exportar roteiro)
- [ ] App nativo (React Native) — se validar demanda

### Fase 4 — Parcerias (semanas 17+)
**Objetivo:** Nova receita via parcerias

- [ ] Programa de afiliados (hotéis, passeios, restaurantes)
- [ ] "Sugestão destacada" paga na IA
- [ ] API white-label pra agências
- [ ] Marketplace de experiências
- [ ] Integração com booking engines (Booking, Airbnb, iFood)

---

## Concorrência

| Produto | O que faz | O que NÃO faz |
|---|---|---|
| TripIt | Organiza itinerário de emails | Não planeja, não tem IA |
| Google Travel | Agrega reservas do Gmail | Não planeja, não tem chat |
| Wanderlog | Planejamento colaborativo | Sem IA conversacional |
| Layla AI | Chat IA pra viagem | Não monta app compartilhável |
| TripVision | **Planeja conversando + app do grupo** | — |

**Nosso moat:** A combinação IA conversacional + app compartilhável + chat + checklist não existe em nenhum concorrente. E o foco em português brasileiro / viagens nacionais é um nicho não atendido.

---

## Métricas de Sucesso

### Fase 1 (MVP)
- 100 cadastros nos primeiros 30 dias
- 30 viagens criadas
- 10 viagens compartilhadas com grupo
- NPS > 40

### Fase 2 (Monetização)
- 50 assinantes Pro nos primeiros 60 dias
- Churn < 10%/mês
- LTV > R$150 (10 meses de retenção)
- MRR: R$745 (50 × R$14,90)

### Fase 3 (Crescimento)
- 500 assinantes Pro
- 5.000 cadastros
- MRR: R$7.450
- Primeiras parcerias fechadas

---

## Marketing e Aquisição

### Canais iniciais (custo zero)

1. **TikTok/Reels:** Gravar tela do planejamento por IA — "Olha como eu planejei 14 dias de viagem em 30 minutos conversando com uma IA". Viral potential alto.
2. **Grupos de Facebook:** Grupos de viagem (Gramado, Serra Gaúcha, Nordeste) — postar roteiros bonitos com link.
3. **WhatsApp:** Cada grupo de viagem compartilhado é marketing orgânico — 15 pessoas veem o app.
4. **Product Hunt:** Lançamento com demo.
5. **Instagram @tripvision:** Dicas de viagem + features do app.

### Canais pagos (Fase 2+)

1. **Google Ads:** "planejar viagem gramado", "roteiro serra gaúcha" — intenção alta.
2. **Instagram/Facebook Ads:** Targeting por interesse em viagem.
3. **Influenciadores de viagem:** Micro-influenciadores (10-50K seguidores).

---

## Aspectos Legais

- Termos de Uso e Política de Privacidade (LGPD)
- Dados de viagem são do usuário — portabilidade garantida
- IA pode errar preços e horários — disclaimer claro
- Parcerias/afiliados: sempre identificar "sugestão patrocinada"
- CNPJ: pode usar Grupo Multvision inicialmente ou abrir CNPJ específico

---

## Custos Estimados (Mês 1)

| Item | Custo mensal |
|---|---|
| Supabase (Pro) | US$25 (~R$130) |
| Claude API (estimativa 200 planejamentos) | ~R$300 |
| Netlify (Pro) | US$19 (~R$100) |
| Domínio (.com.br + .app) | ~R$15/mês (anualizado) |
| Total | ~R$545/mês |

**Break-even:** 37 assinantes Pro (37 × R$14,90 = R$551)

---

## Prompt para Claude Code — MVP (Fase 1)

Quando estiver pronto para começar o desenvolvimento, usar este prompt no Claude Code:

```
Leia o arquivo TRIPVISION_SAAS_FUNDACAO.md e execute a Fase 1 (MVP).
O projeto base já existe em sidneyvianads/tripvision — refatorar para multi-tenant.
Skills: /read supabase-developer /read webapp-testing /read my-claude-setup
```

---

*Documento de Fundação Comercial — TripVision SaaS*
*Autor: Sidney Viana | Grupo Multvision*
*Data: Abril 2026*
