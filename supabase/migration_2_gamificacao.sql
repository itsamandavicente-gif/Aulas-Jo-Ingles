-- Rode no SQL Editor do Supabase.
-- Necessário pra calcular a sequência de estudos (streak): grava quando uma aula foi concluída.

alter table english_jo_lessons add column if not exists concluida_em timestamptz;
