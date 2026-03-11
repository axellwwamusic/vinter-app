# VINTER — Gestão Financeira
## Como colocar no ar em ~10 minutos

---

## PASSO 1 — Criar conta no Supabase (banco de dados + login)

1. Acesse **https://supabase.com** e crie uma conta gratuita
2. Clique em **"New Project"**
3. Dê um nome (ex: `vinter-finance`), escolha uma senha forte, selecione região **South America (São Paulo)**
4. Aguarde ~2 minutos o projeto criar

5. No painel do projeto, vá em **SQL Editor** (menu lateral)
6. Cole o conteúdo do arquivo `supabase-schema.sql` e clique **Run**

7. Vá em **Settings → API**
8. Copie:
   - **Project URL** → `https://xxxxxx.supabase.co`
   - **anon public key** → `eyJhbGci...`

---

## PASSO 2 — Configurar as variáveis do app

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

---

## PASSO 3 — Hospedar no Vercel (gratuito)

1. Acesse **https://vercel.com** e crie uma conta (pode usar GitHub)
2. Instale o Vercel CLI ou use a interface web

### Opção A — Interface web (mais fácil):
1. Suba o projeto para um repositório GitHub
2. No Vercel, clique **"Add New Project"** → importe o repositório
3. Em **"Environment Variables"**, adicione:
   - `VITE_SUPABASE_URL` = sua URL
   - `VITE_SUPABASE_ANON_KEY` = sua chave
4. Clique **Deploy**
5. Em ~1 minuto seu app estará em `https://vinter-app.vercel.app` (ou URL personalizada)

### Opção B — Via terminal:
```bash
npm install
npx vercel --prod
```
E configure as variáveis de ambiente no painel do Vercel.

---

## PASSO 4 — Criar usuário

1. Acesse seu app no link da Vercel
2. Clique **"Criar conta"**
3. Entre com e-mail e senha
4. Confirme o e-mail (Supabase envia automaticamente)
5. Pronto — dados salvam automaticamente na nuvem

---

## Funcionalidades do app

- ✅ Login com e-mail e senha (com recuperação de senha)
- ✅ Lançamento de shows por mês com cálculo automático
- ✅ Agência (15%), Management (10%), Cachê Líquido calculados em tempo real
- ✅ Folha de pagamento mensal editável
- ✅ Fechamento mensal com Faturamento Limpo
- ✅ Fechamento anual com visão de todos os meses
- ✅ Auto-save na nuvem (Supabase)
- ✅ Funciona em computador e celular (responsivo)
- ✅ Design Apple-style light

---

## Desenvolvimento local

```bash
npm install
npm run dev
```
Acesse http://localhost:5173
