"use client";

import { useEffect } from "react";
import { formatDate } from "@/lib/constants";

const ORIGINAL_TITLE = typeof document !== "undefined" ? document.title : "";

export function printChecklistPDF(r) {
  const nomeArquivo = [
    "Checklist",
    r.placa || "",
    (r.motorista || "").trim().replace(/\s+/g, "-"),
    formatDate(r.dataSaida).replace(/\//g, "-"),
  ]
    .filter(Boolean)
    .join("_");
  document.title = nomeArquivo;
  window.print();
  setTimeout(() => {
    document.title = ORIGINAL_TITLE;
  }, 1000);
}

export function printLimpezaPDF(r) {
  const nomeArquivo = ["Historico_de_Limpeza", r.placa || "", formatDate(r.data).replace(/\//g, "-")]
    .filter(Boolean)
    .join("_");
  document.title = nomeArquivo;
  window.print();
  setTimeout(() => {
    document.title = ORIGINAL_TITLE;
  }, 1000);
}

export default function DetailModal({ record, type, isConfirmation, onClose }) {
  useEffect(() => {
    function onOverlayClick(e) {
      if (e.target.id === "detail-overlay") onClose();
    }
    const overlay = document.getElementById("detail-overlay");
    overlay?.addEventListener("click", onOverlayClick);
    return () => overlay?.removeEventListener("click", onOverlayClick);
  }, [onClose]);

  if (!record) return null;
  const r = record;
  const isChecklist = type === "checklist";
  const kmRodado =
    isChecklist && r.kmVolta && r.kmSaida ? Number(r.kmVolta) - Number(r.kmSaida) : null;

  return (
    <div className="detail-overlay show" id="detail-overlay">
      <div className="detail-box" id="detail-box">
        <button className="detail-close" onClick={onClose}>
          &times;
        </button>

        {isConfirmation && (
          <div
            style={{
              background: "var(--ok-soft)",
              color: "var(--ok)",
              fontSize: 12.5,
              fontWeight: 700,
              padding: "8px 12px",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            {isChecklist ? "Checklist salvo" : "Limpeza salva"} — confira o resumo abaixo
          </div>
        )}

        <div className="detail-h">
          {isChecklist ? "" : "Limpeza interna — "}
          {r.placa}
          {r.modelo ? " — " + r.modelo : ""}
        </div>

        {isChecklist ? (
          <div className="detail-grid">
            <div>
              <span>Data saída</span>
              {formatDate(r.dataSaida)} {r.horaSaida || ""}
            </div>
            <div>
              <span>Data volta</span>
              {r.dataVolta ? formatDate(r.dataVolta) + " " + (r.horaVolta || "") : "-"}
            </div>
            <div>
              <span>Responsável</span>
              {r.responsavel || "-"}
            </div>
            <div>
              <span>Motorista</span>
              {r.motorista || "-"}
            </div>
            <div>
              <span>KM saída</span>
              {r.kmSaida || "-"}
            </div>
            <div>
              <span>KM volta</span>
              {r.kmVolta || "-"}
            </div>
            <div>
              <span>KM rodados</span>
              {kmRodado ?? "-"}
            </div>
            <div>
              <span>Destino</span>
              {r.destino || "-"}
            </div>
          </div>
        ) : (
          <div className="detail-grid">
            <div>
              <span>Data</span>
              {formatDate(r.data)}
            </div>
            <div>
              <span>Responsável</span>
              {r.responsavel || "-"}
            </div>
          </div>
        )}

        {isChecklist ? (
          <div className="items-print-wrap">
            <table className="itemtable">
              <tbody>
                {r.items.slice(0, Math.ceil(r.items.length / 2)).map((i) => (
                  <tr key={i.name}>
                    <td>{i.name}</td>
                    <td>
                      <span className={"stbadge " + (i.status || "vazio")}>{i.status || "-"}</span>
                    </td>
                    <td style={{ color: "var(--ink-soft)", fontSize: 12 }}>{i.obs || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="itemtable">
              <tbody>
                {r.items.slice(Math.ceil(r.items.length / 2)).map((i) => (
                  <tr key={i.name}>
                    <td>{i.name}</td>
                    <td>
                      <span className={"stbadge " + (i.status || "vazio")}>{i.status || "-"}</span>
                    </td>
                    <td style={{ color: "var(--ink-soft)", fontSize: 12 }}>{i.obs || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="itemtable">
            <tbody>
              {r.items.map((i) => (
                <tr key={i.name}>
                  <td>{i.name}</td>
                  <td>
                    <span className={"stbadge " + (i.status || "vazio")}>{i.status || "-"}</span>
                  </td>
                  <td style={{ color: "var(--ink-soft)", fontSize: 12 }}>{i.obs || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isChecklist && r.assinatura && (
          <div style={{ marginTop: 14 }}>
            <span
              style={{
                fontSize: 11,
                color: "var(--ink-soft)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Assinatura do motorista
            </span>
            <br />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.assinatura}
              alt="Assinatura"
              style={{ maxWidth: 200, border: "1px solid var(--line)", borderRadius: 6, marginTop: 6 }}
            />
          </div>
        )}

        <div className="detail-actions">
          <button
            className="btn secondary small"
            type="button"
            onClick={() => (isChecklist ? printChecklistPDF(r) : printLimpezaPDF(r))}
          >
            Baixar / imprimir PDF
          </button>
        </div>
      </div>
    </div>
  );
}
