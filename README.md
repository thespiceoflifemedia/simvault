# SimVault

**SimVault** is an all-in-one management platform for indoor golf simulator facilities. It combines a public marketing website with a full admin backend — covering bay scheduling, membership management, POS, loyalty rewards, analytics, and more.

---

## What's in this project

| App | Path | Description |
|-----|------|-------------|
| **SimVault (marketing + admin)** | `artifacts/gss-admin` | React/Vite app — public marketing site at `/`, admin panel at `/admin` |
| API Server | `artifacts/api-server` | Express API backend |

> **Vercel / GitHub export:** Only the SimVault frontend (`artifacts/gss-admin`) is needed for the marketing + admin UI. It is a fully static app that can be deployed independently.

---

## Tech Stack

- **Framework:** React 19
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS v4
- **Routing:** Wouter
- **UI Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Package manager:** pnpm (workspace monorepo)
- **Language:** TypeScript

---

## Project Structure

```
/
├── artifacts/
│   ├── gss-admin/          ← SimVault frontend (marketing + admin)
│   └── api-server/         ← API backend
├── lib/                    ← Shared libraries
├── scripts/                ← Utility scripts
├── pnpm-workspace.yaml     ← Workspace config
├── vercel.json             ← Vercel deployment config
├── .env.example            ← Environment variable reference
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v20+
- **pnpm** v9+ — install with `npm install -g pnpm`

### Install dependencies

```bash
pnpm install
```

### Run the SimVault frontend (dev)

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/gss-admin run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
pnpm --filter @workspace/gss-admin run build
```

Output is written to `artifacts/gss-admin/dist/public`.

### Preview the production build

```bash
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/gss-admin run serve
```

---

## Environment Variables

See `.env.example` for the full list. For the **SimVault frontend only**, no environment variables are required for production. The Vite dev server uses:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5173` | Dev server port |
| `BASE_PATH` | No | `/` | App base path |

For the **API server**:

| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_SECRET` | Yes | Secret for signing sessions |
| `DATABASE_URL` | If using DB | PostgreSQL connection string |

---

## GitHub Export

### First time setup

```bash
# 1. Create a new repo on github.com (do not initialise with README)

# 2. In this project directory, add the remote:
git remote add origin https://github.com/YOUR_USERNAME/simvault.git

# 3. Push
git branch -M main
git push -u origin main
```

### Subsequent pushes

```bash
git add .
git commit -m "your message"
git push
```

### What gets committed

- All source code
- `pnpm-lock.yaml` (required — do not delete)
- `vercel.json`
- `.env.example`
- `README.md`

### What is excluded (via .gitignore)

- `node_modules/`
- `dist/`
- `.env` (real secrets)
- `.replit`, `.local/`, `.cache/` (Replit-specific)
- `attached_assets/` (Replit uploads)

---

## Vercel Deployment

### Step-by-step

1. Push this repo to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. On the **Configure Project** screen:

| Setting | Value |
|---------|-------|
| **Root Directory** | `.` (leave as root — do not change) |
| **Framework Preset** | Other |
| **Build Command** | `pnpm --filter @workspace/gss-admin run build` |
| **Output Directory** | `artifacts/gss-admin/dist/public` |
| **Install Command** | `pnpm install` |

5. **Environment Variables** — none required for the frontend
6. Click **Deploy**

> The `vercel.json` in the root already configures all of the above. Vercel will detect it automatically.

### SPA routing

The `vercel.json` includes a rewrite rule that sends all paths to `index.html`, enabling client-side routing to work correctly (e.g. `/about`, `/admin`, `/admin/bookings`).

---

## Replit Transfer / Import

### Option A — Fork in Replit

1. Open this project in Replit
2. Click the three-dot menu → **Fork**
3. The fork will have all files but no secrets
4. Add required secrets in **Tools → Secrets**:
   - `SESSION_SECRET` — generate with `openssl rand -base64 32`

### Option B — Import from GitHub

1. Go to [replit.com](https://replit.com) → **Create Repl**
2. Choose **Import from GitHub**
3. Paste the repo URL
4. Replit will detect the pnpm workspace automatically
5. Add secrets via **Tools → Secrets** (see above)
6. The workflows (`artifacts/gss-admin: web` and `artifacts/api-server: API Server`) will start automatically

### After importing

```bash
# Install dependencies (Replit usually does this automatically)
pnpm install

# The dev server runs via the configured workflow — no manual command needed
```

---

## No hard-coded account-specific values

This project contains no:
- Replit usernames or account IDs
- Hard-coded Replit URLs (all environment-driven)
- Real API keys or secrets
- Personal email addresses or phone numbers

All contact details visible in the UI are placeholders (`hello@simvault.io`, `+1 (800) 555-1234`).

---

## Admin Panel

The admin panel is accessible at `/admin` after deployment. It is a client-side only UI — no backend login is wired up by default. To add authentication, connect it to the API server or a service like Clerk or Replit Auth.

---

## Known Considerations

- **pnpm workspace overrides:** The `pnpm-workspace.yaml` excludes non-Linux platform binaries for esbuild, rollup, etc. This is fine for Vercel (Linux) and Replit (Linux). If developing locally on **macOS or Windows**, remove the platform-specific `overrides` block from `pnpm-workspace.yaml` or add your platform's binary back.
- **Google Fonts:** The app loads Inter and Familjen Grotesk from Google Fonts at runtime. An internet connection is required during development.
