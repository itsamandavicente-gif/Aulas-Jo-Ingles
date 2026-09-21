// Algoritmo de repetição espaçada (SM-2, o mesmo usado por Anki/Memrise).
// quality: 0 = errei, 3 = difícil, 4 = bom, 5 = fácil

export type EstadoCartao = {
  repeticoes: number;
  intervalo: number; // dias
  fator_facilidade: number;
};

export type ResultadoRevisao = EstadoCartao & { proxima_revisao: string };

export function revisarCartao(estado: EstadoCartao, quality: 0 | 3 | 4 | 5): ResultadoRevisao {
  let { repeticoes, intervalo, fator_facilidade } = estado;

  if (quality < 3) {
    repeticoes = 0;
    intervalo = 1;
  } else {
    if (repeticoes === 0) intervalo = 1;
    else if (repeticoes === 1) intervalo = 6;
    else intervalo = Math.round(intervalo * fator_facilidade);
    repeticoes += 1;
  }

  fator_facilidade =
    fator_facilidade + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (fator_facilidade < 1.3) fator_facilidade = 1.3;

  const proxima = new Date();
  proxima.setDate(proxima.getDate() + intervalo);

  return {
    repeticoes,
    intervalo,
    fator_facilidade: Number(fator_facilidade.toFixed(2)),
    proxima_revisao: proxima.toISOString().slice(0, 10),
  };
}
