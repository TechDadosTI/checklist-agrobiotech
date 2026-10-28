import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessaoValida } from "@/lib/session";

// Trava o app inteiro: sem sessão válida, páginas vão pra /login e APIs levam 401.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const logado = await sessaoValida(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login" || pathname === "/api/login") {
    if (logado && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (logado) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  // Fora: arquivos internos do Next, favicon e imagens públicas (usadas na tela de login).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
