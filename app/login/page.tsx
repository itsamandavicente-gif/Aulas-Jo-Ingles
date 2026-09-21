"use client";

import { useState } from "react";
import { enviarLinkDeAcesso } from "./actions";

export default function LoginPage() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "erro">("idle");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(formData: FormData) {
    setEstado("enviando");
    const resultado = await enviarLinkDeAcesso(formData);
    if (resultado?.erro) {
      setEstado("erro");
      setMensagem(resultado.erro);
    } else {
      setEstado("enviado");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="eyebrow">Painel de Missões</div>
        <h1 style={{ fontSize: 28 }}>Entrar</h1>
        <p className="subtitle" style={{ marginBottom: 18 }}>
          Digite seu e-mail e enviaremos um link de acesso — sem senha.
        </p>

        {estado === "enviado" ? (
          <p className="aviso">Link enviado! Confira seu e-mail e clique para entrar.</p>
        ) : (
          <form action={handleSubmit}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" required placeholder="voce@email.com" />
            </div>
            <button className="btn" type="submit" disabled={estado === "enviando"} style={{ width: "100%" }}>
              {estado === "enviando" ? "Enviando…" : "Enviar link de acesso"}
            </button>
            {estado === "erro" && <p className="erro">{mensagem}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
