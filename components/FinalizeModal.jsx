"use client";

import { useState } from "react";
import { todayISO, nowTime } from "@/lib/constants";

export default function FinalizeModal({ record, onClose, onConfirm, showToast }) {
  const [dataVolta, setDataVolta] = useState(todayISO());
  const [horaVolta, setHoraVolta] = useState(nowTime());
  const [kmVolta, setKmVolta] = useState("");
  const [obsLimpeza, setObsLimpeza] = useState("");

  if (!record) return null;

  async function handleSave() {
    if (!dataVolta || !horaVolta || !kmVolta) {
      showToast("Preencha data, hora e KM de volta");
      return;
    }
    try {
      await onConfirm(record.id, {
        dataVolta,
        horaVolta,
        kmVolta,
        obsLimpeza: obsLimpeza.trim(),
        status: "finalizado",
      });
      showToast("Retorno finalizado com sucesso");
      onClose();
    } catch (e) {
      console.error(e);
      showToast("Erro ao finalizar: " + e.message);
    }
  }

  return (
    <div className="detail-overlay show" id="finalize-overlay">
      <div className="detail-box">
        <button className="detail-close" onClick={onClose}>
          &times;
        </button>
        <div className="detail-h">
          Finalizar retorno — {record.placa}
          {record.modelo ? " — " + record.modelo : ""}
        </div>
        <div className="field">
          <label>Data volta</label>
          <input type="date" value={dataVolta} onChange={(e) => setDataVolta(e.target.value)} />
        </div>
        <div className="field">
          <label>Hora volta</label>
          <input type="time" value={horaVolta} onChange={(e) => setHoraVolta(e.target.value)} />
        </div>
        <div className="field">
          <label>KM volta</label>
          <input
            type="number"
            value={kmVolta}
            onChange={(e) => setKmVolta(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="field">
          <label>Limpeza interna</label>
          <textarea
            value={obsLimpeza}
            onChange={(e) => setObsLimpeza(e.target.value)}
            placeholder="Descreva se algo ficou no veículo (copo, lixo, etc.) — opcional"
          />
        </div>
        <button className="btn" style={{ marginTop: 14 }} type="button" onClick={handleSave}>
          Salvar retorno
        </button>
      </div>
    </div>
  );
}
