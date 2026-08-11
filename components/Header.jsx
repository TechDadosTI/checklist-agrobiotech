"use client";

import Image from "next/image";

const TABS = [
  { key: "novo", label: "Novo checklist" },
  { key: "historico", label: "Histórico" },
  { key: "veiculos", label: "Veículos" },
  { key: "limpeza", label: "Limpeza" },
];

export default function Header({ activeTab, onChangeTab }) {
  return (
    <header className="top">
      <div className="brandrow">
        <Image
          className="brandmark"
          src="/images/logo-agrobiotech.png"
          alt="Agrobiotech Agronegócio"
          width={150}
          height={42}
          style={{ height: 42, width: "auto" }}
          priority
        />
      </div>
      <div className="brandsub">Checklist de veículos</div>
      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={"tabbtn" + (activeTab === tab.key ? " active" : "")}
            onClick={() => onChangeTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
