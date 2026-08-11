"use client";

import { useState } from "react";
import PlateSelect from "./PlateSelect";
import ItemsEditor from "./ItemsEditor";
import { LIMPEZA_ITEMS, todayISO } from "@/lib/constants";

function emptyItemStates() {
  const obj = {};
  LIMPEZA_ITEMS.forEach((name) => (obj[name] = { status: null, obs: "" }));
  return obj;
}

export default function LimpezaTab({ plates, onSave, showToast }) {
  const [placa, setPlaca] = useState(plates[0]?.placa || "");
  const [data, setData] = useState(todayISO());
  const [responsavel, setResponsavel] = useState("");
  const [itemStates, setItemStates] = useState(emptyItemStates());

  function handleItemChange(name, patch) {
    setItemStates((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }

  function resetForm() {
    setData(todayISO());
    setResponsavel("");
    setItemStates(emptyItemStates());
  }

  async function handleSalvar() {
    if (!placa || !data || !responsavel.trim()) {
      showToast("Preencha placa, data e responsável por checar");
      return;
    }
    const faltando = LIMPEZA_ITEMS.filter((name) => !itemStates[name]?.status);
    if (faltando.length > 0) {
      showToast("Marque C ou NC em todos os itens (falta: " + faltando[0] + ")");
      return;
    }
    const semDescricao = LIMPEZA_ITEMS.filter(
      (name) => itemStates[name].status === "NC" && !itemStates[name].obs.trim()
    );
    if (semDescricao.length > 0) {
      showToast("Descreva o problema do item Não Conforme: " + semDescricao[0]);
      return;
    }

    const items = LIMPEZA_ITEMS.map((name) => ({
      name,
      status: itemStates[name].status,
      obs: itemStates[name].obs || "",
    }));

    const selectedPlate = plates.find((p) => p.placa === placa);
    const id = "lz_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const record = {
      id,
      placa,
      modelo: selectedPlate?.modelo || "",
      data,
      responsavel: responsavel.trim(),
      items,
      createdAt: new Date().toISOString(),
    };

    try {
      await onSave(record);
      showToast("Limpeza salva com sucesso");
      resetForm();
    } catch (e) {
      console.error(e);
      showToast("Erro ao salvar limpeza: " + e.message);
    }
  }

  return (
    <div className="view active">
      <div className="card">
        <h2>
          <span className="num">L</span> Nova limpeza interna
        </h2>
        <PlateSelect plates={plates} value={placa} onChange={setPlaca} id="lz-placa" />
        <div className="row2">
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
              placeholder="Nome de quem checou"
            />
          </div>
        </div>
        <div className="field">
          <label>Itens da limpeza interna</label>
          <div style={{ marginTop: 8 }}>
            <ItemsEditor
              items={LIMPEZA_ITEMS}
              values={itemStates}
              onChange={handleItemChange}
              showNA={false}
              obsPlaceholder="Descreva o problema (obrigatório se Não Conforme)"
            />
          </div>
        </div>
        <button className="btn" style={{ marginTop: 6 }} type="button" onClick={handleSalvar}>
          Salvar limpeza
        </button>
      </div>
    </div>
  );
}
