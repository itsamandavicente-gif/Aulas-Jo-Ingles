import { createClient } from "@/lib/supabase/server";
import StatusSelect from "./status-select";
import ProximaMissao from "./proxima-missao";
import { calcularStreak } from "@/lib/streak";

type Lesson = {
  id: string;
  nivel: string;
  pasta: string;
  titulo: string;
  prioridade: string;
  status: string;
  concluida_em: string | null;
};

export default async function Dashboard() {
  const supabase = createClient();

  const [{ data: lessonsData }, { data: wordsData }, { data: reviewsData }] = await Promise.all([
    supabase
      .from("english_jo_lessons")
      .select("id, nivel, pasta, titulo, prioridade, status, concluida_em")
      .order("nivel", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("english_jo_words").select("id, english_jo_reviews(proxima_revisao)"),
    supabase.from("english_jo_reviews").select("ultima_revisao"),
  ]);

  const lessons: Lesson[] = lessonsData ?? [];
  const total = lessons.length;
  const concluidas = lessons.filter((l) => l.status === "Concluído").length;
  const andamento = lessons.filter((l) => l.status === "Em andamento").length;
  const pct = total ? Math.round((concluidas / total) * 100) : 0;

  const niveis = Array.from(new Set(lessons.map((l) => l.nivel)));

  const hoje = new Date().toISOString().slice(0, 10);
  const palavrasDevidas = (wordsData ?? []).filter((w: any) => {
    const revisao = w.english_jo_reviews?.[0];
    return !revisao || revisao.proxima_revisao <= hoje;
  }).length;

  const proximaLicao = lessons.find((l) => l.status !== "Concluído") ?? null;

  const datasAtividade = [
    ...lessons.map((l) => l.concluida_em),
    ...(reviewsData ?? []).map((r: any) => r.ultima_revisao),
  ];
  const { dias: streakDias, ativoHoje: streakAtivoHoje } = calcularStreak(datasAtividade);

  return (
    <div className="wrap">
      <header style={{ marginBottom: 22 }}>
        <div className="eyebrow">English w/ Jo</div>
        <h1>Acompanhamento de Aulas</h1>
        <div className="subtitle">Conteúdo liberado por nível, conforme o avanço</div>
      </header>

      <ProximaMissao
        streakDias={streakDias}
        streakAtivoHoje={streakAtivoHoje}
        palavrasDevidas={palavrasDevidas}
        proximaLicao={proximaLicao}
      />

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 14 }}>
          <div>
            <div className="readout-label">Progresso geral</div>
            <div className="big-readout">
              <span className="num">{pct}%</span>
              <span className="of">{concluidas} / {total} concluídas</span>
            </div>
          </div>
        </div>
        <div className="bar-track">
          <div className="bar-seg done" style={{ width: `${total ? (concluidas / total) * 100 : 0}%` }} />
          <div className="bar-seg progress" style={{ width: `${total ? (andamento / total) * 100 : 0}%` }} />
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state">
          Nenhuma aula cadastrada ainda. Vá em <strong>Aulas</strong> para adicionar o primeiro nível.
        </div>
      ) : (
        niveis.map((nivel) => {
          const doNivel = lessons.filter((l) => l.nivel === nivel);
          const feitas = doNivel.filter((l) => l.status === "Concluído").length;
          return (
            <div key={nivel} className="etapa-group" style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: 8, marginBottom: 10 }}>
                <div style={{ fontFamily: "'Big Shoulders Display'", fontWeight: 700, fontSize: 19 }}>Nível {nivel}</div>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12.5, color: "var(--ink-faint)" }}>{feitas} / {doNivel.length}</div>
              </div>
              <div className="mission-list">
                {doNivel.map((l) => (
                  <div key={l.id} className="mission" data-status={l.status}>
                    <div className="mission-row">
                      <div className="mission-main">
                        <div className="mission-title">
                          <span className="label">{l.titulo}</span>
                          <span className={`priority-dot ${l.prioridade}`}>{l.prioridade}</span>
                        </div>
                        <div className="pasta-tag">{l.pasta}</div>
                      </div>
                      <StatusSelect id={l.id} status={l.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
