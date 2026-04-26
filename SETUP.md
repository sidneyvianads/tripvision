# TripVision — passos manuais para colocar no ar

O código está pronto. Faltam estes 3 passos pra app funcionar de ponta a ponta.

## 1) Supabase (auth + chat realtime + checklist)

### a. Criar projeto

Painel: https://supabase.com/dashboard/new
- Nome: `tripvision`
- Região: `South America (São Paulo)` (sa-east-1)
- Custo: ~US$ 10/mês

### b. Rodar SQL

Copie e cole o bloco abaixo no **SQL Editor** do projeto:

```sql
-- ===== profiles =====
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

-- ===== messages =====
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

-- ===== checklist =====
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

### c. Configurar Auth

Painel → **Authentication → URL Configuration**
- Site URL: `https://tripvision.netlify.app` (ou o domínio que a Netlify deu)
- Redirect URLs: `https://<seu-site>.netlify.app`, `http://localhost:5173`

Painel → **Authentication → Providers**
- **Email**: habilitar magic link
- **Google**: criar credenciais em https://console.cloud.google.com/apis/credentials
  - Authorized redirect URI: o Supabase mostra a URL no painel
  - Cole Client ID + Client Secret no Supabase

### d. Pegar as keys

Painel → **Project Settings → API**
- `Project URL` → vira `VITE_SUPABASE_URL`
- `anon` (public) → vira `VITE_SUPABASE_ANON_KEY`

## 2) Anthropic API key (Concierge IA)

Pegar em: https://console.anthropic.com/settings/keys

Cole no Netlify: **Site Settings → Environment variables → Add a variable**
- Nome: `ANTHROPIC_API_KEY`
- Valor: `sk-ant-...`
- Scopes: `Functions` (basta nas Functions)

## 3) Variáveis de ambiente no Netlify

No painel do site no Netlify, **Environment variables**:

| Variável                | Valor                          | Onde usa                    |
|-------------------------|--------------------------------|-----------------------------|
| `VITE_SUPABASE_URL`     | `https://xxx.supabase.co`      | Build (frontend)            |
| `VITE_SUPABASE_ANON_KEY`| `eyJhbGciOi...`                | Build (frontend)            |
| `ANTHROPIC_API_KEY`     | `sk-ant-...`                   | Runtime (Netlify Function)  |

Depois de adicionar, **Trigger deploy → Clear cache and deploy site**.

## 4) Local

Pra rodar local com Supabase:

```bash
cp .env.example .env.local
# Edite .env.local colando VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Pra testar a function de IA local você precisa do Netlify Dev:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local
npx netlify dev
```

---

Pronto. Quando essas três coisas estiverem feitas, login + chat + checklist + IA funcionam.
