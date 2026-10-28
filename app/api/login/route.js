import { NextResponse } from "next/server";
import { credenciaisValidas, criarSessao, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {}

  if (!credenciaisValidas(body.usuario, body.senha)) {
    // Atraso curto pra dificultar tentativas em sequência.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await criarSessao(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
