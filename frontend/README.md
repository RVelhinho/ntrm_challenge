# Nutrium Frontend

React, TypeScript, Vite, TanStack Query/Form/Router, Radix UI, Tailwind CSS,
Zod, and Orval-generated API clients.

## Development

From the repository root:

```bash
pnpm setup
pnpm dev
```

The API runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.
Set `VITE_API_URL` to use another API URL.

## Routes

- `/` landing page
- `/nutritionists` nutritionist and service search
- `/nutritionists/:nutritionistId/appointments` pending appointment requests

Authentication is intentionally out of scope for this application.

## Verification

```bash
pnpm api:sync
pnpm lint
pnpm typecheck
pnpm test
pnpm --dir frontend build
```

The OpenAPI document is generated from the backend Rswag specifications. Run
`pnpm api:sync` after changing an API request, response, or route.
