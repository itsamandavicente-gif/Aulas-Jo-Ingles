"use client";

import { useState } from "react";
import { responderRevisao } from "./actions";

export type Carta = { id: string; termo: string; traducao: string; exemplo: string | null };

export default function Flashcards({ cartas }: { cartas: Carta[] }) {
  const [fila, setFila] = useState(cartas);
  const [revelado, setRevelado] = useState(false);
  const [feitas, setFeitas] = useState(0);
  const total = cartas.length;

  const atual = fila[0];

  async function responder(quality: 0 | 3 | 4 | 5) {
    if (!atual) return;
    await responderRevisao(atual.id, quality);
    setFila((f) => f.slice(1));
    setRevelado(false);
    setFeitas((n) => n + 1);
  }

  if (!atual) {
    return (
      <div className="empty-state">
        {total === 0
          ? "Nenhuma palavra pra revisar hoje. Bom trabalho! 🎯"
          : `Revisão de hoje concluída — ${feitas} / ${total} cartas. 🎉`}
      </div>
    );
  }

  return (
    <div>
      <div className="subtitle" style={{ marginBottom: 12 }}>{fila.length} restantes nesta sessão</div>
      <div className="flashcard" onClick={() => setRevelado((r) => !r)} style={{ cursor: "pointer" }}>
        <div className="termo">{atual.termo}</div>
        {revelado ? (
          <>
            <div className="traducao">{atual.traducao}</div>
            {atual.exemplo && <div className="exemplo">{atual.exemplo}</div>}
          </>
        ) : (
          <div className="subtitle">Toque para ver a tradução</div>
        )}
      </div>

      {revelado && (
        <div className="qualidade-btns">
          <button data-q="0" onClick={() => responder(0)}>Errei</button>
          <button data-q="3" onClick={() => responder(3)}>Difícil</button>
          <button data-q="4" onClick={() => responder(4)}>Bom</button>
          <button data-q="5" onClick={() => responder(5)}>Fácil</button>
        </div>
      )}
    </div>
  );
}
