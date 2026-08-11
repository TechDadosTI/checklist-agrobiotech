"use client";

import { useState } from "react";
import ItemsEditor from "./ItemsEditor";
import { ITEMS } from "@/lib/constants";

function itemsToStates(items) {
  const obj = {};
  items.forEach((i) => (obj[i.name] = { status: i.status, obs: i.obs || "" }));
  return obj;
}

function statesToItems(baseItems, states) {
  return baseItems.map((i) => ({
    name: i.name,
    status: states[i.name]?.status ?? i.status,
    obs: states[i.name]?.obs ?? i.obs,
  }));
}

export default function EditModal({ record, plates, onClose, onSave, showToast }) {
  const [placa, setPlaca] = useState(record.placa);
  const [dataSaida, setDataSaida] = useState(record.dataSaida || "");
  const [horaSaida, setHoraSaida] = useState(record.horaSaida || "");
  const [dataVolta, setDataVolta] = useState(record.dataVolta || "");
  const [horaVolta, setHoraVolta] = useState(record.horaVolta || "");
  const [kmSaida, setKmSaida] = useState(record.kmSaida || "");
  const [kmVolta, setKmVolta] = useState(record.kmVolta || "");
  const [motorista, setMotorista] = useState(record.motorista || "");
  const [destino, setDestino] = useState(record.destino || "");
  const [obsLimpeza, setObsLimpeza] = useState(record.obsLimpeza || "");
  const [itemStates, setItemStates] = useState(itemsToStates(record.items));

  function handleItemChange(name, patch) {
    setItemStates((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }

  async function handleSave() {
    const selectedPlate = plates.find((p) => p.placa === placa);
    const items = statesToItems(record.items, itemStates);

    const updated = {
      placa,
      modelo: selectedPlate?.modelo || record.modelo || "",
      dataSaida,
      horaSaida,
      dataVolta,
      horaVolta,
      kmSaida,
      kmVolta,
      motorista: motorista.trim(),
      destino: destino.trim(),
      obsLimpeza: obsLimpeza.trim(),
      items,
    };

    try {
      await onSave(record.id, updated);
      showToast("Checklist atualizado com sucesso");
      onClose();
    } catch (e) {
      console.error(e);
      showToast("Erro ao atualizar: " + e.message);
    }
  }

  return (
    <div className="detail-overlay show" id="edit-overlay">
      <div className="detail-box" id="edit-box">
        <button className="detail-close" onClick={onClose}>
          &times;
        </button>
        <div className="detail-h">Editar checklist — {record.placa}</div>

        <div className="field">
          <label>Placa</label>
          <select value={placa} onChange={(e) => setPlaca(e.target.value)}>
            {plates.map((p) => (
              <option key={p.placa} value={p.placa}>
                {p.placa} — {p.modelo || ""}
              </option>
            ))}
          </select>
        </div>

        <div className="row2">
          <div className="field">
            <label>Data saída</label>
            <input type="date" value={dataSaida} onChange={(e) => setDataSaida(e.target.value)} />
          </div>
          <div className="field">
            <label>Hora saída</label>
            <input type="time" value={horaSaida} onChange={(e) => setHoraSaida(e.target.value)} />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Data volta</label>
            <input type="date" value={dataVolta} onChange={(e) => setDataVolta(e.target.value)} />
          </div>
          <div className="field">
            <label>Hora volta</label>
            <input type="time" value={horaVolta} onChange={(e) => setHoraVolta(e.target.value)} />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>KM saída</label>
            <input type="number" value={kmSaida} onChange={(e) => setKmSaida(e.target.value)} />
          </div>
          <div className="field">
            <label>KM volta</label>
            <input type="number" value={kmVolta} onChange={(e) => setKmVolta(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Motorista</label>
          <input type="text" value={motorista} onChange={(e) => setMotorista(e.target.value)} />
        </div>
        <div className="field">
          <label>Destino</label>
          <textarea value={destino} onChange={(e) => setDestino(e.target.value)} />
        </div>
        <div className="field">
          <label>Limpeza interna</label>
          <textarea
            value={obsLimpeza}
            onChange={(e) => setObsLimpeza(e.target.value)}
            placeholder="Descreva se algo ficou no veículo (copo, lixo, etc.) — opcional"
          />
        </div>

        <div className="field">
          <label>Itens</label>
          <div style={{ marginTop: 8 }}>
            <ItemsEditor
              items={ITEMS}
              values={itemStates}
              onChange={handleItemChange}
              showNA
              obsPlaceholder="Observação (opcional)"
            />
          </div>
        </div>

        <button className="btn" style={{ marginTop: 14 }} type="button" onClick={handleSave}>
          Salvar alterações
        </button>
      </div>
    </div>
  );
}
