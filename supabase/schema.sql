-- Rode este script no SQL Editor do seu projeto Supabase (Project > SQL Editor > New query).

create table if not exists english_jo_lessons (
  id uuid primary key default gen_random_uuid(),
  nivel text not null,                 -- ex: 'A1', 'B1'
  pasta text default 'Aulas',
  titulo text not null,
  prioridade text default 'Média',     -- Alta | Média
  status text default 'Pendente',      -- Pendente | Em andamento | Concluído
  nota text default '',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists english_jo_words (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references english_jo_lessons(id) on delete set null,
  termo text not null,
  traducao text not null,
  exemplo text default '',
  added_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists english_jo_reviews (
  id uuid primary key default gen_random_uuid(),
  word_id uuid references english_jo_words(id) on delete cascade,
  user_id uuid references auth.users(id) not null,
  repeticoes int not null default 0,
  intervalo int not null default 0,
  fator_facilidade numeric not null default 2.5,
  proxima_revisao date not null default current_date,
  ultima_revisao timestamptz,
  unique (word_id, user_id)
);

alter table english_jo_lessons enable row level security;
alter table english_jo_words enable row level security;
alter table english_jo_reviews enable row level security;

-- Lições e palavras são compartilhadas entre os dois usuários (você e o Jonathan).
create policy "usuários autenticados leem lições" on english_jo_lessons for select to authenticated using (true);
create policy "usuários autenticados criam lições" on english_jo_lessons for insert to authenticated with check (true);
create policy "usuários autenticados atualizam lições" on english_jo_lessons for update to authenticated using (true);

create policy "usuários autenticados leem palavras" on english_jo_words for select to authenticated using (true);
create policy "usuários autenticados criam palavras" on english_jo_words for insert to authenticated with check (true);

-- O progresso de revisão (SRS) é individual: cada um vê e atualiza só o seu.
create policy "usuário lê suas revisões" on english_jo_reviews for select to authenticated using (auth.uid() = user_id);
create policy "usuário cria suas revisões" on english_jo_reviews for insert to authenticated with check (auth.uid() = user_id);
create policy "usuário atualiza suas revisões" on english_jo_reviews for update to authenticated using (auth.uid() = user_id);
