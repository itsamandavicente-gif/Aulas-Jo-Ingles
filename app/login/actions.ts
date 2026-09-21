"use server";

import { createClient } from "@/lib/supabase/server";

export async function enviarLinkDeAcesso(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { erro: "Digite um e-mail." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback` },
  });

  if (error) return { erro: error.message };
  return { ok: true };
}
