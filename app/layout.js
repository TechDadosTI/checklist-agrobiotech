import "./globals.css";

export const metadata = {
  title: "Checklist de Veículos — Agrobiotech",
  description: "Sistema de checklist e limpeza de veículos da Agrobiotech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
