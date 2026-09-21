"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function atualizarStatusLicao(lessonId: string, status: string) {
  const supabase = createClient();
  await supabase.from("lessons").update({ status }).eq("id", lessonId);
  revalidatePath("/");
  revalidatePath("/aulas");
}

export async function atualizarLicao(formData: FormData) {
  const id = String(formData.get("id"));
  const prioridade = String(formData.get("prioridade"));
  const nota = String(formData.get("nota") || "");
  const supabase = createClient();
  await supabase.from("lessons").update({ prioridade, nota }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/aulas");
}

export async function criarLicao(formData: FormData) {
  const nivel = String(formData.get("nivel") || "").trim();
  const titulo = String(formData.get("titulo") || "").trim();
  const pasta = String(formData.get("pasta") || "Aulas").trim();
  const prioridade = String(formData.get("prioridade") || "Média");
  if (!nivel || !titulo) return { erro: "Preencha nível e título." };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("lessons")
    .insert({ nivel, titulo, pasta, prioridade, created_by: user?.id });

  if (error) return { erro: error.message };
  revalidatePath("/");
  revalidatePath("/aulas");
  return { ok: true };
}
