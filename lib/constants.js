export const ITEMS = [
  "Freio de pé", "Freio de estacionamento", "Motor de partida", "Limpador de para-brisa",
  "Lavador de para-brisa", "Buzina", "Faróis", "Lanternas dianteiras (seta)",
  "Lanternas traseiras (seta)", "Luz de freio", "Luz de ré", "Triângulo de advertência",
  "Extintor de segurança", "Espelhos retrovisores", "Indicadores do painel",
  "Condições dos pneus", "Pneu estepe", "Vidros", "Portas", "Cinto de segurança",
  "Macaco", "Chave de roda", "Nível de óleo", "Nível de fluido de freio",
  "Nível de água", "Ruído interno", "Lataria",
];

export const LIMPEZA_ITEMS = [
  "Bancos", "Tapetes", "Painel", "Console / porta-copos", "Portas internas",
  "Forro do teto", "Vidros internos", "Cinto de segurança", "Porta-malas",
];

export const DEFAULT_PLATES = [
  { placa: "GCQ3C61", modelo: "MONTANA T A LTZ" },
  { placa: "EIJ3886", modelo: "MONTANA CONQUEST" },
];

export const VEHICLE_IMAGES = {
  GCQ3C61: "/images/veiculo-gcq3c61.png",
  EIJ3886: "/images/veiculo-eij3886.png",
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function nowTime() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
