// Sessão por cookie assinado (HMAC-SHA256) via Web Crypto — funciona tanto no
// proxy quanto nas rotas de API. As credenciais NÃO ficam no código: vêm das
// variáveis de ambiente APP_USER, APP_PASSWORD e AUTH_SECRET (segredo longo e
// aleatório que assina o cookie). Sem elas, ninguém consegue entrar.
export const SESSION_COOKIE = "checklist_session";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 horas, em segundos

const USER = process.env.APP_USER || "";
const PASSWORD = process.env.APP_PASSWORD || "";
const SECRET = process.env.AUTH_SECRET || "";

const encoder = new TextEncoder();

async function sign(payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Comparação em tempo constante pra não vazar o tamanho do acerto por timing.
function safeEqual(a, b) {
  const ba = encoder.encode(a);
  const bb = encoder.encode(b);
  let diff = ba.length ^ bb.length;
  for (let i = 0; i < Math.max(ba.length, bb.length); i++) {
    diff |= (ba[i] || 0) ^ (bb[i] || 0);
  }
  return diff === 0;
}

export function credenciaisValidas(usuario, senha) {
  if (!USER || !PASSWORD) return false;
  const userOk = safeEqual(String(usuario || "").trim().toLowerCase(), USER.toLowerCase());
  const passOk = safeEqual(String(senha || ""), PASSWORD);
  return userOk && passOk;
}

export async function criarSessao() {
  if (!SECRET) throw new Error("AUTH_SECRET não configurado");
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  return `${exp}.${await sign(String(exp))}`;
}

export async function sessaoValida(token) {
  if (!token || !SECRET) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  return safeEqual(sig, await sign(exp));
}
