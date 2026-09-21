-- Migração única: recupera o progresso que o Jonas já tinha no site antigo
-- (localStorage) para dentro do banco novo, antes de trocar o deploy na Vercel.
-- Rode uma vez só, no SQL Editor do Supabase, ANTES de ativar o app novo.

insert into english_jo_lessons (nivel, pasta, titulo, prioridade, status, nota) values
('Etapa 1', 'Aulas', 'Aula Básica 02', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 03', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 04', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 05', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 06', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 07', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 08', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Básica 09', 'Alta', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 01', 'Média', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 02', 'Média', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 03', 'Média', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 04', 'Média', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 05', 'Média', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 06', 'Média', 'Concluído', ''),
('Etapa 1', 'Aulas', 'Aula Intermediária 07', 'Média', 'Concluído', ''),
('Etapa 2', 'Aulas Técnicas', 'Aula Técnica 02', 'Média', 'Concluído', ''),
('Etapa 2', 'Aulas Técnicas', 'Aula Técnica 04', 'Média', 'Pendente', '');
