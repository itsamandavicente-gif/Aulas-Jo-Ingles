"use client";

import { useTransition } from "react";
import { atualizarStatusLicao } from "./actions";

const OPCOES = ["Pendente", "Em andamento", "Concluído"];

export default function StatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      className="status-select"
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => atualizarStatusLicao(id, e.target.value))}
    >
      {OPCOES.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
