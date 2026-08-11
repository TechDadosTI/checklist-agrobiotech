# Checklist de Veículos — Agrobiotech

Sistema de checklist de veículos, feito em Next.js + Firebase (Firestore).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura

- `app/page.js` — página principal, controla as abas e os dados do Firestore
- `components/` — cada parte da tela (Novo checklist, Histórico, Veículos, modais)
- `lib/firebase.js` — conexão com o Firestore (mesmo banco já usado antes)
- `lib/constants.js` — lista de itens do checklist e placas padrão
- `public/images/` — logo e fotos dos veículos

## Banco de dados (Firestore)

Continua sendo o mesmo projeto Firebase de antes (`checklist-agrobiotech`), com as coleções:

- `checklists` — cada checklist de saída/retorno de veículo
- `config/placas` — lista de placas cadastradas

Não precisa mexer em nada no Firebase — as regras do Firestore já estão publicadas.

## Deploy

Este projeto é feito para deploy automático pela **Vercel**: a cada `git push` (ou merge) na
branch `main`, a Vercel gera um novo deploy sozinha.

## Fazendo alterações

Peça para o **Claude Code** (extensão do VS Code) fazer o ajuste desejado e, no final, pedir
para ele **commitar e enviar (push) para a branch `main`**. A Vercel cuida do resto.
