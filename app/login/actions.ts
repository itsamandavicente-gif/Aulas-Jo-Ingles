"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function entrar(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const senha = String(formData.get("senha") || "");

  if (!email || !senha) return { erro: "Preencha e-mail e senha." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) return { erro: "E-mail ou senha incorretos." };

  redirect("/");
}
