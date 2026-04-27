# The Owl's Press

> Read Dangerously · The Owl's Press · Est. 2025

An editorial reading dispatch app for U.S. readers. The app turns a reader's question into a book-centered dispatch with recommendations, reflection prompts, saved items, and reading history.

## Quick Start

```bash
npm install
npm run dev
npm run build
```

The Vite dev server opens at `http://localhost:3000`.

## Project Structure

```text
owls-press-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── data/content.js
│   ├── services/gemini.js
│   ├── services/gemini-mock.js
│   ├── styles/tokens.js
│   ├── components/
│   └── screens/
├── supabase/
│   ├── functions/gemini-proxy/
│   └── migrations/
└── expo-app/
```

## Product Identity

The Owl's Press is a newspaper-inspired reading product. It should feel editorial, useful, and bookish rather than gamified for its own sake.

Primary user promise: ask a real question, get one useful book-led dispatch, and leave with a next step.

## Core Screens

| Screen | Route | Purpose |
|---|---|---|
| Dispatch | `home` | Question cards, daily challenge, input modes, reader progress |
| Reading Room | `reading` | Curated essays and book notes |
| Profile | `profile` | Reading trail, saved items, rank path, settings |
| Dispatch Overlay | overlay | AI-generated book recommendation and reading brief |

## Input Modes

| Mode | Purpose |
|---|---|
| Solve | One best book for a concrete problem |
| Scout | Five quick book recommendations |
| Research | Deeper reading brief with tradeoffs and companion books |

## Verification

```bash
npm run build
rg -n "[\\p{Han}]" src index.html README.md package.json supabase
```
