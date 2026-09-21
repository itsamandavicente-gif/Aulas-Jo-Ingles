import { createClient } from "@/lib/supabase/server";
import NovaPalavraForm from "../nova-palavra-form";

export default async function NovaPalavraPage() {
  const supabase = createClient();
  const { data } = await supabase.from("lessons").select("id, titulo, nivel").order("nivel");

  return (
    <div className="wrap">
      <header style={{ marginBottom: 22 }}>
        <div className="eyebrow">Vocabulário</div>
        <h1>Nova palavra</h1>
        <div className="subtitle">Cadastre palavras aprendidas para entrarem na revisão diária</div>
      </header>
      <NovaPalavraForm licoes={data ?? []} />
    </div>
  );
}
