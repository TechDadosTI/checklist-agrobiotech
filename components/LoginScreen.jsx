"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      if (res.ok) {
        window.location.href = "/";
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Não foi possível entrar.");
    } catch {
      setError("Erro de conexão. Tente de novo.");
    }
    setLoading(false);
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo-wrap">
          <Image
            src="/images/logo-agrobiotech.png"
            alt="Agrobiotech Agronegócio"
            width={200}
            height={56}
            style={{ height: 48, width: "auto", margin: "0 auto", display: "block" }}
            priority
          />
        </div>
        <div className="login-body">
          <h1 className="login-title">Checklist de veículos</h1>
          <p className="login-sub">Entre com seu usuário e senha pra continuar.</p>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="senha">Senha</label>
            <div className="login-pass">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                  {mostrarSenha && <line x1="3" y1="21" x2="21" y2="3" />}
                </svg>
              </button>
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
