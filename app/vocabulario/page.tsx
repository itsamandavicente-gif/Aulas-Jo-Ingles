import { createClient } from "@/lib/supabase/server";
import Flashcards, { type Carta } from "./flashcards";
import Link from "next/link";

export default async function VocabularioPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("english_jo_words")
    .select("id, termo, traducao, exemplo, english_jo_reviews(proxima_revisao)")
    .order("created_at");

  const hoje = new Date().toISOString().slice(0, 10);

  const devidas: Carta[] = (data ?? [])
    .filter((w: any) => {
      const revisao = w.english_jo_reviews?.[0];
      return !revisao || revisao.proxima_revisao <= hoje;
    })
    .map((w: any) => ({ id: w.id, termo: w.termo, traducao: w.traducao, exemplo: w.exemplo }));

  return (
    <div className="wrap">
      <header style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="eyebrow">Revisão diária</div>
          <h1>Vocabulário</h1>
          <div className="subtitle">Repetição espaçada — as palavras voltam antes de serem esquecidas</div>
        </div>
        <Link href="/vocabulario/nova" className="btn secondary">+ Nova palavra</Link>
      </header>

      <Flashcards cartas={devidas} />
    </div>
  );
}
