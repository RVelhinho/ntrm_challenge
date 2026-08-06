# Nutrium Frontend

React, strict TypeScript, Vite, TanStack Query/Form/Router, Radix UI, Tailwind
CSS, Zod, Vitest, MSW, and an Orval-generated API client.

## Setup

Use Node.js 22.13 or newer and pnpm 11.18.0. Install only from the repository root
so the sole root `pnpm-lock.yaml` remains authoritative:

```bash
pnpm setup
pnpm dev
```

The frontend runs at <http://localhost:5173> and expects the API at
<http://localhost:3000> in development. Copy `.env.example` to `.env` only when
you need to override `VITE_API_URL`. In production, an omitted value safely uses
same-origin relative API URLs; a cross-origin API URL must be supplied at build
time and allowed by backend `FRONTEND_ORIGINS`.

Demo nutritionists and services do not come from frontend fixtures. Run
`cd backend && bin/rails db:seed` once during setup.

## Routes

- `/`: landing page
- `/nutritionists`: nutritionist and service search
- `/appointments`: global pending appointment-request queue

Authentication is intentionally out of scope.

## Verification

From the repository root:

```bash
pnpm format
pnpm format:check
pnpm lint:web
pnpm typecheck
pnpm test:web
pnpm build
pnpm api:check
```

The Rails Rswag specification generates `backend/swagger/v1/openapi.yaml`.
Orval then generates `src/api/generated/`. Do not edit generated files manually;
run `pnpm api:sync`, review the output, and commit it with the Rswag change.
