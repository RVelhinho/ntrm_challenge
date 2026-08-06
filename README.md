# Nutrium

Nutrium is a Rails and React appointment-request application connecting guests
with nutritionists. Authentication is intentionally outside the current
implementation.

## Prerequisites

- Ruby 3.3.9
- Bundler 4.0.17
- PostgreSQL 16 or newer
- Node.js 22.13 or newer
- pnpm 11.18.0

The repository has one pnpm workspace and one lockfile at `pnpm-lock.yaml`. Do
not install dependencies from `frontend/` or add another lockfile.

## Setup

Start PostgreSQL, then run from the repository root:

```bash
pnpm setup
cd backend && bin/rails db:seed && cd ..
```

Rails defaults to the local `nutrium_development` and `nutrium_test` databases.
If local PostgreSQL requires an explicit connection, export it before running
Rails commands; `.env` files are not loaded by the backend:

```bash
export DATABASE_URL=postgresql://user:password@localhost/nutrium_development
```

Seeding is required to populate the nutritionists and services used by the demo.
The seeds are idempotent.

## Run Locally

```bash
pnpm dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:3000>
- Health check: <http://localhost:3000/up>
- Interactive API docs: <http://localhost:3000/api-docs>
- Raw OpenAPI: <http://localhost:3000/api-docs/v1/openapi.yaml>

### Email Testing

In development, appointment decision emails are delivered to files under
`backend/tmp/mailer`. Accept or reject an appointment, then inspect the
generated message files. No external SMTP host is required.

Automated tests use Rails' in-memory email delivery and do not contact a real
email service. They verify mail recipients, subjects, rendered content, and
that acceptance sends notifications to the accepted guest and any guests whose
overlapping requests were automatically rejected. Run them with:

```bash
pnpm test:api
```

The full test command also includes these email tests:

```bash
pnpm test
```

Frontend routes are `/`, `/nutritionists`, and the global request queue at
`/appointments`. API routes are documented in `backend/README.md`.

For another API origin, copy `frontend/.env.example` to `frontend/.env` and set
`VITE_API_URL`. Production builds default to same-origin requests when this
variable is absent; set it at build time only when the API is on another origin.

## Commands

```bash
pnpm format          # write frontend formatting
pnpm format:check    # verify formatting without writing
pnpm lint            # RuboCop and ESLint
pnpm typecheck       # TypeScript
pnpm test            # RSpec and Vitest
pnpm build           # production frontend build
pnpm security        # Brakeman and bundler-audit
pnpm api:sync        # regenerate OpenAPI, then the Orval client
pnpm api:check       # regenerate and fail on tracked generated drift
pnpm check           # comprehensive local verification
```

`pnpm api:sync` intentionally rewrites generated artifacts. `pnpm api:check`
and `pnpm check` regenerate them and then require clean generated output. Review
and commit legitimate changes to `backend/swagger/v1/openapi.yaml` and
`frontend/src/api/generated/`; never edit generated TypeScript manually. CI
installs with `pnpm install --frozen-lockfile` and enforces the same drift check.

See `CONTRIBUTING.md`, `docs/architecture.md`, and `docs/deployment.md` for the
development workflow, domain design, and deployment status.
