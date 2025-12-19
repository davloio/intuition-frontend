# Intuition Explorer

Next generation blockchain explorer for Intuition Systems. Technical Swiss design aesthetic with real-time GraphQL data.

Built by [davlo.io](https://davlo.io)

## Quick Start

```bash
npm install
npm run dev
```

Create `.env`:

```env
VITE_GRAPHQL_ENDPOINT=https://api.explorer.systems/graphql
VITE_GRAPHQL_WS_ENDPOINT=wss://api.explorer.systems/graphql
```

## Features

- Real-time blockchain data via GraphQL subscriptions
- Technical minimalist design with glassmorphic UI
- Responsive layout with geometric side panel navigation
- Live stats, blocks, and transaction tracking
- Type-safe TypeScript throughout

## Tech Stack

**Core**
- Vue 3 (Composition API)
- TypeScript
- Vite

**Data**
- Villus (GraphQL client)
- graphql-ws (WebSocket subscriptions)
- Pinia (state management)

**Design**
- SCSS with design system
- GSAP animations
- Swiss-inspired layout

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Vue components
├── views/          # Page components
├── composables/    # Vue composables
├── services/       # GraphQL queries & client
├── stores/         # Pinia stores
├── types/          # TypeScript types
├── utils/          # Formatters & helpers
└── assets/styles/  # SCSS design system
```

## About

Blockchain explorer built by [davlo.io](https://davlo.io) - specialized in next generation blockchain infrastructure with Rust backends and modern TypeScript frontends.

