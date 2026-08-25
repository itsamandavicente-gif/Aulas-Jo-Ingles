# Painel de Missões — Aulas Jô Inglês

Site simples (HTML/CSS/JS, sem build) para acompanhar o progresso das aulas do curso.

## Estrutura
- `index.html` — página principal
- `css/style.css` — estilos
- `js/data.js` — lista das aulas/missões (edite aqui para adicionar o curso inteiro)
- `js/app.js` — lógica do painel (progresso, filtros, status, notas)

## Como adicionar mais aulas
Edite `js/data.js` e acrescente novos objetos no array `COURSE_DATA`, seguindo o mesmo formato:

```js
{ id: "b10", etapa: "Etapa 1", etapaNome: "Consolidação de Base", pasta: "Aulas", titulo: "Aula Básica 10", prioridade: "Alta" }
```

## Progresso salvo
O status de cada aula (Pendente / Em andamento / Concluído) e as observações ficam salvos no navegador (localStorage). Isso significa que o progresso é por navegador/dispositivo — abrir em outro aparelho começa do zero.

## Deploy
Este projeto é estático — a Vercel publica direto, sem configuração de build.
