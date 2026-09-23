import Link from "next/link";

type Props = {
  streakDias: number;
  streakAtivoHoje: boolean;
  palavrasDevidas: number;
  proximaLicao: { id: string; titulo: string; nivel: string } | null;
};

export default function ProximaMissao({ streakDias, streakAtivoHoje, palavrasDevidas, proximaLicao }: Props) {
  let titulo = "Tudo em dia! 🎉";
  let descricao = "Nenhuma missão pendente agora — volte mais tarde ou explore o vocabulário livremente.";
  let cta: { href: string; label: string } | null = null;

  if (palavrasDevidas > 0) {
    titulo = `${palavrasDevidas} ${palavrasDevidas === 1 ? "palavra" : "palavras"} pra revisar hoje`;
    descricao = "Repetição espaçada funciona melhor todo dia — não deixa acumular.";
    cta = { href: "/vocabulario", label: "Revisar agora" };
  } else if (proximaLicao) {
    titulo = proximaLicao.titulo;
    descricao = `Próxima aula pendente — Nível ${proximaLicao.nivel}`;
    cta = { href: "/aulas", label: "Ver aula" };
  }

  return (
    <div className="card" style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div>
        <div className="readout-label">Próxima missão</div>
        <div style={{ fontFamily: "'Big Shoulders Display'", fontWeight: 700, fontSize: 22, marginTop: 2 }}>{titulo}</div>
        <div className="subtitle" style={{ marginTop: 2 }}>{descricao}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontWeight: 700, fontSize: 26, color: streakDias > 0 ? "var(--priority-media)" : "var(--ink-faint)" }}>
            🔥 {streakDias}
          </div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>
            {streakDias === 1 ? "dia seguido" : "dias seguidos"}
          </div>
        </div>
        {cta && (
          <Link href={cta.href} className="btn">{cta.label}</Link>
        )}
      </div>
    </div>
  );
}
