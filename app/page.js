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
import DetailModal from "@/components/DetailModal";
import FinalizeModal from "@/components/FinalizeModal";
import EditModal from "@/components/EditModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("novo");

  const [plates, setPlates] = useState(DEFAULT_PLATES);
  const [checklists, setChecklists] = useState([]);

  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);

  const [detail, setDetail] = useState(null); // { record, isConfirmation }
  const [finalizeRecord, setFinalizeRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);

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

  // ---------- Handlers ----------
  async function handleSaveChecklist(record) {
    await setDoc(doc(db, "checklists", record.id), record);
    setDetail({ record, isConfirmation: true });
  }

  async function handleSavePlates(newPlates) {
    setPlates(newPlates);
    await setDoc(doc(db, "config", "placas"), { list: newPlates });
  }

  async function handleFinalizeConfirm(id, fields) {
    await updateDoc(doc(db, "checklists", id), fields);
  }

  async function handleEditSave(id, fields) {
    await updateDoc(doc(db, "checklists", id), fields);
  }

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, "checklists", id));
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
            plates={plates}
            onOpenDetail={(record) => setDetail({ record, isConfirmation: false })}
            onEdit={(record) => setEditRecord(record)}
            onFinalize={(record) => setFinalizeRecord(record)}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "veiculos" && (
          <VeiculosTab plates={plates} onSavePlates={handleSavePlates} />
        )}
      </main>

      {detail && (
        <DetailModal
          record={detail.record}
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

      {editRecord && (
        <EditModal
          record={editRecord}
          plates={plates}
          onClose={() => setEditRecord(null)}
          onSave={handleEditSave}
          showToast={showToast}
        />
      )}

      <Toast message={toastMsg} show={toastShow} />
    </>
  );
}
