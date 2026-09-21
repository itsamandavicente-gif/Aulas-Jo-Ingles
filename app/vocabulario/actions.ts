"use server";

import { createClient } from "@/lib/supabase/server";
import { revisarCartao } from "@/lib/srs";
import { revalidatePath } from "next/cache";

export async function criarPalavra(formData: FormData) {
  const termo = String(formData.get("termo") || "").trim();
  const traducao = String(formData.get("traducao") || "").trim();
  const exemplo = String(formData.get("exemplo") || "").trim();
  const lessonId = String(formData.get("lesson_id") || "") || null;

  if (!termo || !traducao) return { erro: "Preencha a palavra e a tradução." };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("words")
    .insert({ termo, traducao, exemplo, lesson_id: lessonId, added_by: user?.id });

  if (error) return { erro: error.message };
  revalidatePath("/vocabulario");
  revalidatePath("/vocabulario/nova");
  return { ok: true };
}

export async function responderRevisao(wordId: string, quality: 0 | 3 | 4 | 5) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: atual } = await supabase
    .from("reviews")
    .select("repeticoes, intervalo, fator_facilidade")
    .eq("word_id", wordId)
    .eq("user_id", user.id)
    .maybeSingle();

  const estado = atual ?? { repeticoes: 0, intervalo: 0, fator_facilidade: 2.5 };
  const resultado = revisarCartao(estado, quality);

  await supabase.from("reviews").upsert(
    {
      word_id: wordId,
      user_id: user.id,
      ...resultado,
      ultima_revisao: new Date().toISOString(),
    },
    { onConflict: "word_id,user_id" }
  );

  revalidatePath("/vocabulario");
}
