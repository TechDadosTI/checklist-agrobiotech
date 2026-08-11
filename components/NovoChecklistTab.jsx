"use client";

import { useState, useRef } from "react";
import PlateSelect from "./PlateSelect";
import ItemsEditor from "./ItemsEditor";
import SignaturePad from "./SignaturePad";
import { ITEMS, todayISO, nowTime } from "@/lib/constants";

function emptyItemStates() {
  const obj = {};
  ITEMS.forEach((name) => (obj[name] = { status: null, obs: "" }));
  return obj;
}

export default function NovoChecklistTab({ plates, onSave, showToast }) {
  const [placa, setPlaca] = useState(plates[0]?.placa || "");
  const [dataSaida, setDataSaida] = useState(todayISO());
  const [horaSaida, setHoraSaida] = useState(nowTime());
  const [responsavel, setResponsavel] = useState("");
  const [kmSaida, setKmSaida] = useState("");
  const [motorista, setMotorista] = useState("");
  const [destino, setDestino] = useState("");
  const [itemStates, setItemStates] = useState(emptyItemStates());
  const sigRef = useRef(null);

  function handleItemChange(name, patch) {
    setItemStates((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }

  function resetForm() {
    setDataSaida(todayISO());
    setHoraSaida(nowTime());
    setResponsavel("");
    setKmSaida("");
    setMotorista("");
    setDestino("");
    setItemStates(emptyItemStates());
    sigRef.current?.clear();
  }

  async function handleSalvar() {
    if (!placa || !dataSaida || !horaSaida || !responsavel.trim() || !kmSaida) {
      showToast("Preencha placa, data/hora de saída, responsável e KM de saída");
      return;
    }
    const faltando = ITEMS.filter((name) => !itemStates[name]?.status);
    if (faltando.length > 0) {
      showToast(
        "Marque C, NC ou NA em todos os itens (falta: " +
          faltando[0] +
          (faltando.length > 1 ? " e mais " + (faltando.length - 1) : "") +
          ")"
      );
      return;
    }

    const items = ITEMS.map((name) => ({
      name,
      status: itemStates[name].status,
      obs: itemStates[name].obs || "",
    }));

    const selectedPlate = plates.find((p) => p.placa === placa);
    const id = "chk_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const record = {
      id,
      placa,
      modelo: selectedPlate?.modelo || "",
      dataSaida,
      horaSaida,
      dataVolta: "",
      horaVolta: "",
      responsavel: responsavel.trim(),
      kmSaida,
      kmVolta: "",
      motorista: motorista.trim(),
      destino: destino.trim(),
      items,
      assinatura: sigRef.current?.getDataURL() || "",
      status: "aberto",
      createdAt: new Date().toISOString(),
    };

    try {
      await onSave(record);
      showToast("Checklist salvo com sucesso");
      resetForm();
    } catch (e) {
      console.error(e);
      showToast("Erro ao salvar: " + e.message);
    }
  }

  return (
    <div className="view active">
      <div className="card">
        <h2>
          <span className="num">1</span> Dados da viagem
        </h2>
        <PlateSelect plates={plates} value={placa} onChange={setPlaca} id="f-placa" />
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
        <div className="field">
          <label>Responsável pelo checklist</label>
          <input
            type="text"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Nome de quem preencheu"
          />
        </div>
        <div className="field">
          <label>KM saída</label>
          <input
            type="number"
            value={kmSaida}
            onChange={(e) => setKmSaida(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="field">
          <label>Nome do motorista</label>
          <input
            type="text"
            value={motorista}
            onChange={(e) => setMotorista(e.target.value)}
            placeholder="Nome de quem vai dirigir"
          />
        </div>
      </div>

      <div className="card">
        <h2>
          <span className="num">2</span> Itens do veículo
        </h2>
        <ItemsEditor items={ITEMS} values={itemStates} onChange={handleItemChange} showNA />
      </div>

      <div className="card">
        <h2>
          <span className="num">3</span> Assinatura do motorista
        </h2>
        <SignaturePad ref={sigRef} />
      </div>

      <div className="card">
        <h2>
          <span className="num">4</span> Destino / observações
        </h2>
        <div className="field">
          <label>Para onde o veículo está sendo usado (rota, fazenda, cliente, etc.)</label>
          <textarea
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Ex.: Saída Joaquina - Santa Rita"
          />
        </div>
      </div>

      <button className="btn" onClick={handleSalvar} type="button">
        Salvar checklist
      </button>
    </div>
  );
}
