import { createClient } from "@/lib/supabase/server";
import NovaLicaoForm from "./nova-licao-form";
import EditarLicaoForm from "./editar-licao-form";

export default async function AulasPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("lessons")
    .select("id, nivel, titulo, pasta, prioridade, status, nota")
    .order("nivel")
    .order("created_at");

  const lessons = data ?? [];

  return (
    <div className="wrap">
      <header style={{ marginBottom: 22 }}>
        <div className="eyebrow">Gerenciar</div>
        <h1>Aulas</h1>
        <div className="subtitle">Adicione novas aulas conforme cada nível é liberado</div>
      </header>

      <NovaLicaoForm />

      <div className="mission-list">
        {lessons.map((l) => (
          <div key={l.id} className="mission" data-status={l.status}>
            <div className="mission-title">
              <span className="label">{l.titulo}</span>
              <span className={`priority-dot ${l.prioridade}`}>{l.prioridade}</span>
            </div>
            <div className="pasta-tag">Nível {l.nivel} · {l.pasta} · {l.status}</div>
            <EditarLicaoForm id={l.id} prioridade={l.prioridade} nota={l.nota ?? ""} />
          </div>
        ))}
      </div>
    </div>
  );
}
