"use client";

import { useState } from "react";
import { criarPalavra } from "./actions";

type Licao = { id: string; titulo: string; nivel: string };

export default function NovaPalavraForm({ licoes }: { licoes: Licao[] }) {
  const [estado, setEstado] = useState<"idle" | "ok" | "erro">("idle");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(formData: FormData) {
    const r = await criarPalavra(formData);
    if (r?.erro) { setEstado("erro"); setMensagem(r.erro); }
    else { setEstado("ok"); (document.getElementById("form-palavra") as HTMLFormElement)?.reset(); }
  }

  return (
    <form id="form-palavra" action={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      <div className="field">
        <label>Palavra / expressão (em inglês)</label>
        <input name="termo" placeholder="ex: nevertheless" required />
      </div>
      <div className="field">
        <label>Tradução</label>
        <input name="traducao" placeholder="ex: no entanto" required />
      </div>
      <div className="field">
        <label>Frase de exemplo (opcional)</label>
        <textarea name="exemplo" rows={2} placeholder="ex: I was tired; nevertheless, I kept studying." />
      </div>
      <div className="field">
        <label>Aula relacionada (opcional)</label>
        <select name="lesson_id" defaultValue="">
          <option value="">— nenhuma —</option>
          {licoes.map((l) => (
            <option key={l.id} value={l.id}>{l.nivel} · {l.titulo}</option>
          ))}
        </select>
      </div>
      <button className="btn" type="submit">Adicionar palavra</button>
      {estado === "erro" && <p className="erro">{mensagem}</p>}
      {estado === "ok" && <p className="aviso">Palavra adicionada!</p>}
    </form>
  );
}
