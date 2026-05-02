# SimVault

## Overview

**SimVault** is an all-in-one management platform for indoor golf simulator facilities. The project is a pnpm workspace monorepo containing:

- **`artifacts/gss-admin`** — SimVault frontend (React + Vite): public marketing website at `/` and admin panel at `/admin`
- **`artifacts/api-server`** — Express API backend
- **`lib/`** — Shared TypeScript libraries (api-client-react, api-spec, api-zod, db)

## Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS v4, Wouter, shadcn/ui, Framer Motion, Recharts
- **Backend**: Express 5, PostgreSQL + Drizzle ORM, Zod validation
- **Monorepo**: pnpm workspaces
- **Package manager**: pnpm
- **TypeScript**: 5.9
- **API codegen**: Orval (from OpenAPI spec)

## Key Commands

- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/gss-admin run dev` — run SimVault frontend
- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm --filter @workspace/gss-admin run build` — build SimVault for production
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks/Zod schemas

## Deployment

- **Vercel**: `vercel.json` at root configures build for `artifacts/gss-admin`
  - Build command: `pnpm --filter @workspace/gss-admin run build`
  - Output: `artifacts/gss-admin/dist/public`
- **GitHub**: Working tree is clean and ready to push. See `README.md` for full steps.

## Environment Variables

- `PORT` — Dev server port (defaults to 5173)
- `BASE_PATH` — App base path (defaults to `/`)
- `SESSION_SECRET` — API server session signing secret

See `.env.example` for the full reference.

## Branding

- **Brand name**: SimVault
- **Accent color**: Electric blue `#3b82f6`
- **Background**: Dark navy `#080b14`
- **Fonts**: Familjen Grotesk (headings) + Inter (body) via Google Fonts
- **Logo**: Inline SVG grid icon + "SimVault" text (no external CDN dependency)
