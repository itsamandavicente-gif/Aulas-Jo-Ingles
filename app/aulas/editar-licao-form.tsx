"use client";

import { atualizarLicao } from "../actions";

export default function EditarLicaoForm({ id, prioridade, nota }: { id: string; prioridade: string; nota: string }) {
  return (
    <form action={atualizarLicao} style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap", marginTop: 8 }}>
      <input type="hidden" name="id" value={id} />
      <select name="prioridade" defaultValue={prioridade} className="status-select">
        <option>Alta</option>
        <option>Média</option>
      </select>
      <input name="nota" defaultValue={nota} placeholder="Observação…" style={{ flex: 1, minWidth: 160, fontFamily: "inherit", fontSize: 13, padding: "6px 9px", borderRadius: 7, border: "1px solid var(--line)", background: "var(--surface-2)", color: "var(--ink)" }} />
      <button className="btn ghost" type="submit" style={{ padding: "6px 12px", fontSize: 12.5 }}>Salvar</button>
    </form>
  );
}
