"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Mesmas credenciais já usadas no projeto Firebase "checklist-agrobiotech".
// Não são segredos sensíveis: seguem protegidas pelas regras do Firestore.
const firebaseConfig = {
  apiKey: "AIzaSyAuayeMiN2qEG9f1FOFKB99LMBz-cqmxKQ",
  authDomain: "checklist-agrobiotech.firebaseapp.com",
  projectId: "checklist-agrobiotech",
  storageBucket: "checklist-agrobiotech.firebasestorage.app",
  messagingSenderId: "650650044604",
  appId: "1:650650044604:web:5cdf962544c6b2c04c28b9",
};

// Evita inicializar o app duas vezes (Next.js recarrega módulos em dev)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
