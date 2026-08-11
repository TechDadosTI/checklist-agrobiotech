"use client";

import { useState, useMemo } from "react";
import { formatDate } from "@/lib/constants";

export default function HistoricoTab({
  checklists,
  plates,
  onOpenDetail,
  onEdit,
  onFinalize,
  onDelete,
}) {
  const [filtroPlaca, setFiltroPlaca] = useState("");

  const checklistsOrdenados = useMemo(() => {
    return checklists
      .filter((r) => !filtroPlaca || r.placa === filtroPlaca)
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [checklists, filtroPlaca]);

  return (
    <div className="view active">
      <div className="filterbar">
        <select value={filtroPlaca} onChange={(e) => setFiltroPlaca(e.target.value)}>
          <option value="">Todas as placas</option>
          {plates.map((p) => (
            <option key={p.placa} value={p.placa}>
              {p.placa} — {p.modelo || ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        {checklistsOrdenados.length === 0 && (
          <div className="empty">Nenhum checklist registrado ainda.</div>
        )}
        {checklistsOrdenados.map((r) => {
          const aberto = r.status === "aberto";
          const temNC = r.items.some((i) => i.status === "NC");
          const badge = aberto ? (
            <span className="badge aberto">Em aberto</span>
          ) : temNC ? (
            <span className="badge nc">Item NC</span>
          ) : (
            <span className="badge ok">Tudo OK</span>
          );
          return (
            <div
              className="hist-card"
              key={r.id}
              onClick={(e) => {
                if (e.target.closest("button")) return;
                onOpenDetail(r);
              }}
            >
              <div className="hist-top">
                <span className="hist-placa">
                  {r.placa}
                  {r.modelo && (
                    <span style={{ fontWeight: 400, color: "var(--ink-soft)", fontSize: 12 }}>
                      {" "}
                      — {r.modelo}
                    </span>
                  )}
                </span>
                {badge}
              </div>
              <div className="hist-date">
                {formatDate(r.dataSaida)} {r.horaSaida}
              </div>
              <div className="hist-meta">Motorista: {r.motorista || "-"}</div>
              {r.destino && <div className="hist-dest">{r.destino}</div>}
              <div className="hist-card-actions">
                <button
                  className="hist-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Apagar o checklist de ${r.placa} (${formatDate(r.dataSaida)})? Essa ação não pode ser desfeita.`)) {
                      onDelete(r.id);
                    }
                  }}
                >
                  Apagar
                </button>
                <button
                  className="hist-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(r);
                  }}
                >
                  Editar
                </button>
                {aberto && (
                  <button
                    className="hist-finalize-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFinalize(r);
                    }}
                  >
                    Finalizar retorno
                  </button>
                )}
                <button
                  className="hist-pdf-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetail(r);
                  }}
                >
                  <i className="pdficon">PDF</i> Exportar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
