"use client";

import { useState } from "react";
import { entrar } from "./actions";

export default function LoginPage() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "erro">("idle");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(formData: FormData) {
    setEstado("enviando");
    const resultado = await entrar(formData);
    if (resultado?.erro) {
      setEstado("erro");
      setMensagem(resultado.erro);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="eyebrow">English w/ Jo</div>
        <h1 style={{ fontSize: 28 }}>Entrar</h1>
        <p className="subtitle" style={{ marginBottom: 18 }}>
          Digite seu e-mail e senha.
        </p>

        <form action={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required placeholder="voce@email.com" />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input id="senha" name="senha" type="password" required />
          </div>
          <button className="btn" type="submit" disabled={estado === "enviando"} style={{ width: "100%" }}>
            {estado === "enviando" ? "Entrando…" : "Entrar"}
          </button>
          {estado === "erro" && <p className="erro">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}
