"use client";

import { useState } from "react";
import ItemsEditor from "./ItemsEditor";
import { ITEMS, LIMPEZA_ITEMS } from "@/lib/constants";

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

export default function EditModal({ record, type, plates, onClose, onSave, showToast }) {
  const isChecklist = type === "checklist";
  const [placa, setPlaca] = useState(record.placa);
  const [dataSaida, setDataSaida] = useState(record.dataSaida || "");
  const [horaSaida, setHoraSaida] = useState(record.horaSaida || "");
  const [dataVolta, setDataVolta] = useState(record.dataVolta || "");
  const [horaVolta, setHoraVolta] = useState(record.horaVolta || "");
  const [kmSaida, setKmSaida] = useState(record.kmSaida || "");
  const [kmVolta, setKmVolta] = useState(record.kmVolta || "");
  const [motorista, setMotorista] = useState(record.motorista || "");
  const [destino, setDestino] = useState(record.destino || "");
  const [data, setData] = useState(record.data || "");
  const [responsavel, setResponsavel] = useState(record.responsavel || "");
  const [itemStates, setItemStates] = useState(itemsToStates(record.items));

  function handleItemChange(name, patch) {
    setItemStates((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }

  async function handleSave() {
    const selectedPlate = plates.find((p) => p.placa === placa);
    const items = statesToItems(record.items, itemStates);

    if (!isChecklist) {
      const semDescricao = items.filter((i) => i.status === "NC" && !(i.obs || "").trim());
      if (semDescricao.length > 0) {
        showToast("Descreva o problema do item Não Conforme: " + semDescricao[0].name);
        return;
      }
    }

    const updated = isChecklist
      ? {
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
          items,
        }
      : {
          placa,
          modelo: selectedPlate?.modelo || record.modelo || "",
          data,
          responsavel: responsavel.trim(),
          items,
        };

    try {
      await onSave(record.id, updated);
      showToast(isChecklist ? "Checklist atualizado com sucesso" : "Limpeza atualizada com sucesso");
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
        <div className="detail-h">
          Editar {isChecklist ? "checklist" : "limpeza"} — {record.placa}
        </div>

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

        {isChecklist ? (
          <>
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
                <input
                  type="number"
                  value={kmSaida}
                  onChange={(e) => setKmSaida(e.target.value)}
                />
              </div>
              <div className="field">
                <label>KM volta</label>
                <input
                  type="number"
                  value={kmVolta}
                  onChange={(e) => setKmVolta(e.target.value)}
                />
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
          </>
        ) : (
          <>
            <div className="field">
              <label>Data</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="field">
              <label>Responsável por checar</label>
              <input
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="field">
          <label>Itens</label>
          <div style={{ marginTop: 8 }}>
            <ItemsEditor
              items={isChecklist ? ITEMS : LIMPEZA_ITEMS}
              values={itemStates}
              onChange={handleItemChange}
              showNA={isChecklist}
              obsPlaceholder={
                isChecklist ? "Observação (opcional)" : "Descreva o problema (obrigatório se NC)"
              }
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
