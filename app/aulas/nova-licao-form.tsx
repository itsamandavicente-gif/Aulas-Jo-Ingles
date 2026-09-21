"use client";

import { useState } from "react";
import { criarLicao } from "../actions";

export default function NovaLicaoForm() {
  const [estado, setEstado] = useState<"idle" | "ok" | "erro">("idle");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(formData: FormData) {
    const r = await criarLicao(formData);
    if (r?.erro) { setEstado("erro"); setMensagem(r.erro); }
    else { setEstado("ok"); (document.getElementById("form-licao") as HTMLFormElement)?.reset(); }
  }

  return (
    <form id="form-licao" action={handleSubmit} className="card" style={{ marginBottom: 22 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Nova aula / nível</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 12 }}>
        <div className="field">
          <label>Nível</label>
          <input name="nivel" placeholder="A1, B1…" required />
        </div>
        <div className="field">
          <label>Título da aula</label>
          <input name="titulo" placeholder="Aula Básica 10" required />
        </div>
        <div className="field">
          <label>Prioridade</label>
          <select name="prioridade" defaultValue="Média">
            <option>Alta</option>
            <option>Média</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Pasta (opcional)</label>
        <input name="pasta" placeholder="Aulas" defaultValue="Aulas" />
      </div>
      <button className="btn" type="submit">Adicionar aula</button>
      {estado === "erro" && <p className="erro">{mensagem}</p>}
      {estado === "ok" && <p className="aviso">Aula adicionada!</p>}
    </form>
  );
}
