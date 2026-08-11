"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_PLATES } from "@/lib/constants";

import Header from "@/components/Header";
import Toast from "@/components/Toast";
import NovoChecklistTab from "@/components/NovoChecklistTab";
import HistoricoTab from "@/components/HistoricoTab";
import VeiculosTab from "@/components/VeiculosTab";
import LimpezaTab from "@/components/LimpezaTab";
import DetailModal from "@/components/DetailModal";
import FinalizeModal from "@/components/FinalizeModal";
import EditModal from "@/components/EditModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("novo");

  const [plates, setPlates] = useState(DEFAULT_PLATES);
  const [checklists, setChecklists] = useState([]);
  const [limpezas, setLimpezas] = useState([]);

  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);

  const [detail, setDetail] = useState(null); // { record, type, isConfirmation }
  const [finalizeRecord, setFinalizeRecord] = useState(null);
  const [editState, setEditState] = useState(null); // { record, type }

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 2200);
  }, []);

  // ---------- Firestore: placas ----------
  useEffect(() => {
    const platesRef = doc(db, "config", "placas");
    const unsub = onSnapshot(
      platesRef,
      async (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list) && snap.data().list.length > 0) {
          setPlates(snap.data().list);
        } else {
          // Semeia com as placas padrão se ainda não existir nada configurado
          await setDoc(platesRef, { list: DEFAULT_PLATES });
        }
      },
      (err) => console.error("Erro ao carregar placas:", err)
    );
    return () => unsub();
  }, []);

  // ---------- Firestore: checklists ----------
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "checklists"),
      (snapshot) => setChecklists(snapshot.docs.map((d) => d.data())),
      (err) => console.error("Erro no listener de checklists:", err)
    );
    return () => unsub();
  }, []);

  // ---------- Firestore: limpezas ----------
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "limpezas"),
      (snapshot) => setLimpezas(snapshot.docs.map((d) => d.data())),
      (err) => console.error("Erro no listener de limpezas:", err)
    );
    return () => unsub();
  }, []);

  // ---------- Handlers ----------
  async function handleSaveChecklist(record) {
    await setDoc(doc(db, "checklists", record.id), record);
    setDetail({ record, type: "checklist", isConfirmation: true });
  }

  async function handleSaveLimpeza(record) {
    await setDoc(doc(db, "limpezas", record.id), record);
    setDetail({ record, type: "limpeza", isConfirmation: true });
  }

  async function handleSavePlates(newPlates) {
    setPlates(newPlates);
    await setDoc(doc(db, "config", "placas"), { list: newPlates });
  }

  async function handleFinalizeConfirm(id, fields) {
    await updateDoc(doc(db, "checklists", id), fields);
  }

  async function handleEditSave(id, fields) {
    const collectionName = editState.type === "checklist" ? "checklists" : "limpezas";
    await updateDoc(doc(db, collectionName, id), fields);
  }

  async function handleDelete(id, type) {
    const collectionName = type === "checklist" ? "checklists" : "limpezas";
    try {
      await deleteDoc(doc(db, collectionName, id));
      showToast("Registro apagado");
    } catch (e) {
      console.error(e);
      showToast("Erro ao apagar: " + e.message);
    }
  }

  return (
    <>
      <Header activeTab={activeTab} onChangeTab={setActiveTab} />

      <main>
        {activeTab === "novo" && (
          <NovoChecklistTab plates={plates} onSave={handleSaveChecklist} showToast={showToast} />
        )}

        {activeTab === "historico" && (
          <HistoricoTab
            checklists={checklists}
            limpezas={limpezas}
            plates={plates}
            onOpenDetail={(record, type) => setDetail({ record, type, isConfirmation: false })}
            onEdit={(record, type) => setEditState({ record, type })}
            onFinalize={(record) => setFinalizeRecord(record)}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "veiculos" && (
          <VeiculosTab plates={plates} onSavePlates={handleSavePlates} />
        )}

        {activeTab === "limpeza" && (
          <LimpezaTab plates={plates} onSave={handleSaveLimpeza} showToast={showToast} />
        )}
      </main>

      {detail && (
        <DetailModal
          record={detail.record}
          type={detail.type}
          isConfirmation={detail.isConfirmation}
          onClose={() => setDetail(null)}
        />
      )}

      {finalizeRecord && (
        <FinalizeModal
          record={finalizeRecord}
          onClose={() => setFinalizeRecord(null)}
          onConfirm={handleFinalizeConfirm}
          showToast={showToast}
        />
      )}

      {editState && (
        <EditModal
          record={editState.record}
          type={editState.type}
          plates={plates}
          onClose={() => setEditState(null)}
          onSave={handleEditSave}
          showToast={showToast}
        />
      )}

      <Toast message={toastMsg} show={toastShow} />
    </>
  );
}
