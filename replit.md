# SimVault

## Overview

**SimVault** is an all-in-one management platform for indoor golf simulator facilities. The project is a pnpm workspace monorepo containing:

- **`artifacts/gss-admin`** — SimVault frontend (React + Vite): public marketing website at `/` and admin panel at `/admin`
- **`artifacts/api-server`** — Express API backend at `/api`
- **`lib/`** — Shared TypeScript libraries (api-client-react, api-spec, api-zod, db)

## Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS v4, Wouter, shadcn/ui, Framer Motion, Recharts
- **Backend**: Express 5, PostgreSQL + Drizzle ORM, Zod validation
- **Sessions**: express-session + connect-pg-simple (sessions in `user_sessions` PG table)
- **Monorepo**: pnpm workspaces
- **Package manager**: pnpm
- **TypeScript**: 5.9

## Key Commands

- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/gss-admin run dev` — run SimVault frontend
- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm --filter @workspace/gss-admin run build` — build SimVault for production
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create tenant + owner account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user + tenant |
| GET | `/api/dashboard` | Aggregated stats for dashboard |
| GET/POST | `/api/bays` | List / create bays |
| GET/PUT/DELETE | `/api/bays/:id` | Get / update / delete bay |
| GET/POST | `/api/customers` | List / create customers |
| GET/PUT/DELETE | `/api/customers/:id` | Get / update / delete customer |
| GET/POST | `/api/bookings` | List / create bookings |
| GET/PUT/DELETE | `/api/bookings/:id` | Get / update / delete booking |
| GET/POST | `/api/memberships` | List / create memberships |
| GET/PUT/DELETE | `/api/memberships/:id` | Get / update / delete membership |
| GET/PUT | `/api/tenant` | Get / update current tenant settings |
| GET | `/api/employees` | List users for current tenant |

## DB Schema Notes

- **bays**: `active` (bool), `simulator` (text) — NOT `isActive`/`capacity`
- **memberships**: `customerName`, `plan`, `startDate`, `autoRenew` — NOT `name`/`price`/`interval`
- **customers**: `email` is `notNull`
- **sessions**: stored in `user_sessions` table — `createTableIfMissing: false` (table pre-created via SQL)
- **zod** must be imported as `"zod"` not `"zod/v4"` in API server (esbuild limitation)

## Admin Pages

| Page | Status | Notes |
|------|--------|-------|
| Dashboard | ✅ Live | Wired to `/api/dashboard` |
| Bays | ✅ Live | Full CRUD |
| Customers | ✅ Live | Full CRUD |
| Bookings | ✅ Live | Full CRUD with datetime picker |
| Memberships | ✅ Live | Full CRUD |
| Facility Settings | ✅ Live | Wired to `/api/tenant` |
| Team | ✅ Live | Wired to `/api/employees` |
| Reports | ✅ UI | Static report category browser |
| POS | 🚧 Coming Soon | Preview with planned features |
| Passes | 🚧 Coming Soon | Preview with planned features |
| Discount Codes | 🚧 Coming Soon | Preview with planned features |
| Schedules | 🚧 Coming Soon | Preview with planned features |

## Marketing Pages

All at `/` path:
- `/` — Home (no fake stats; platform capability facts used)
- `/about` — About (no false network claims)
- `/software` — Feature breakdown
- `/contact` — Demo booking form
- `/help` — Help centre

## Auth Flow

- `POST /api/auth/register` creates a tenant record + user record atomically
- Sessions stored in PostgreSQL `user_sessions` table
- Cookie: `simvault.sid`, httpOnly, 7-day expiry
- Protected routes redirect to `/login?returnTo=<path>` and redirect back after login
- `SESSION_SECRET` stored in Replit secrets

## Deployment

- **Vercel**: `vercel.json` at root configures build for `artifacts/gss-admin`
  - Build command: `pnpm --filter @workspace/gss-admin run build`
  - Output: `artifacts/gss-admin/dist/public`
- **GitHub**: https://github.com/thespiceoflifemedia/simvault

## Environment Variables

- `PORT` — Dev server port (set by workflow)
- `BASE_PATH` — App base path (set by workflow)
- `SESSION_SECRET` — API server session signing secret (Replit secret)
- `DATABASE_URL` — PostgreSQL connection string (Replit-provided)

## Branding

- **Brand name**: SimVault
- **Accent color**: Electric blue `#3b82f6`
- **Background**: Dark navy `#080b14`
- **Fonts**: Familjen Grotesk (headings) + Inter (body) via Google Fonts
- **Logo**: Inline SVG grid icon + "SimVault" text (no external CDN dependency)

## Honesty Guidelines

- Do NOT add fake testimonials, fake customer counts, or fake revenue numbers to marketing pages
- Stats bar uses platform capability facts (10 modules, REST API, 100% isolated, 1 platform)
- Pricing tiers: Starter (up to 4 bays), Growth (up to 10 bays), Pro (unlimited)
- About page does not claim a customer network that doesn't yet exist
- "Coming Soon" pages honestly labeled with a yellow banner
