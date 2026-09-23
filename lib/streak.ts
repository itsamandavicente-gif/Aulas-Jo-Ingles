// Calcula a sequência de dias estudados (streak) a partir de uma lista de
// datas (qualquer formato aceito por `new Date`) em que houve atividade:
// uma aula marcada como concluída ou uma revisão de vocabulário feita.

function paraDiaISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function calcularStreak(datasDeAtividade: (string | null | undefined)[]): {
  dias: number;
  ativoHoje: boolean;
} {
  const unicos = new Set(
    datasDeAtividade.filter(Boolean).map((d) => paraDiaISO(new Date(d as string)))
  );

  const hoje = new Date();
  const ativoHoje = unicos.has(paraDiaISO(hoje));

  const cursor = new Date(hoje);
  if (!ativoHoje) {
    cursor.setDate(cursor.getDate() - 1);
    if (!unicos.has(paraDiaISO(cursor))) {
      return { dias: 0, ativoHoje: false };
    }
  }

  let dias = 0;
  while (unicos.has(paraDiaISO(cursor))) {
    dias++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { dias, ativoHoje };
}
