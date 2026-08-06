# Contributing

## Development Workflow

Install the exact toolchain listed in `README.md`, start PostgreSQL, and run:

```bash
pnpm setup
cd backend && bin/rails db:seed && cd ..
pnpm dev
```

Use the root pnpm workspace for every JavaScript install. Keep only the root
`pnpm-lock.yaml`; CI uses `pnpm install --frozen-lockfile`.

Keep Rails controllers thin, multi-record transactions in `backend/app/services`,
and reusable searches in `backend/app/queries`. Keep route-level React code in
`frontend/src/pages`, feature code in `frontend/src/features`, providers in
`frontend/src/app/providers`, and reusable primitives in
`frontend/src/components/shared/ui`. Colocate Vitest coverage with UI code.

## API Changes

The Rswag request specs are the API source of truth. For a route, parameter,
request, or response change:

1. Update and run the relevant backend request spec.
2. Run `pnpm api:sync` from the repository root.
3. Update frontend call sites using the generated types and operations.
4. Commit `backend/swagger/v1/openapi.yaml` and `frontend/src/api/generated/`.
5. Run `pnpm api:check`, `pnpm typecheck`, and affected tests.

Never manually edit `frontend/src/api/generated`. Regeneration writes tracked
files by design; `pnpm api:check` regenerates and fails if the result differs
from the current checkout or adds untracked generated files.

## Verification

Run `pnpm check` before submitting a change. It checks generated API drift,
formatting, Ruby and TypeScript linting, type safety, RSpec, Vitest, the frontend
production build, Brakeman, and gem advisories. `bundler-audit --update` requires
network access. Smaller commands are listed in the root README.

Do not commit credentials, local `.env` files, build output, or additional npm,
yarn, or pnpm lockfiles.
