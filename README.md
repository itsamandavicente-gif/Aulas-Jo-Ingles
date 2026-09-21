# English w/ Jo

App em Next.js + Supabase para acompanhar aulas (liberadas por nível) e revisar vocabulário com repetição espaçada (algoritmo SM-2, o mesmo do Anki/Memrise).

## Estrutura

- `app/page.tsx` — painel de aulas (progresso geral e por nível, status)
- `app/aulas/` — adicionar novas aulas/níveis conforme são liberados, editar prioridade/observação
- `app/vocabulario/` — revisão diária das palavras (flashcards) e cadastro de novas palavras
- `lib/srs.ts` — algoritmo de repetição espaçada
- `supabase/schema.sql` — script para criar as tabelas no Supabase

## Configurar (uma vez)

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. No projeto, vá em **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql` e rode.
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
4. Copie `.env.local.example` para `.env.local` e preencha com esses valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Em **Authentication → URL Configuration**, adicione a URL do site (local e depois a da Vercel) em *Redirect URLs*, ex: `http://localhost:3000/auth/callback` e `https://SEU-SITE.vercel.app/auth/callback`.
6. Rode `npm install` e `npm run dev` para testar localmente.

## Deploy na Vercel

Na Vercel, em **Settings → Environment Variables**, adicione as mesmas duas variáveis (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) e faça o redeploy.

## Login

O login é com e-mail e senha. Como não é um cadastro público, as contas são criadas manualmente por você no painel do Supabase:

1. No Supabase, vá em **Authentication → Users → Add user**
2. Preencha e-mail e uma senha (defina a senha que a pessoa vai usar)
3. Marque a opção **Auto Confirm User** (assim não precisa confirmar por e-mail)
4. Repita para cada pessoa que vai usar o app (você, o Jonathan, etc.)

## Como funciona a revisão de vocabulário

Cada palavra cadastrada entra na fila de revisão. Ao responder (Errei / Difícil / Bom / Fácil), o algoritmo SM-2 decide quantos dias até a palavra aparecer de novo — palavras fáceis somem por mais tempo, palavras difíceis voltam logo. O progresso de revisão é individual por usuário.
