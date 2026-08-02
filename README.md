# Nutrium

Nutrium is an appointment-request application connecting guests with
nutritionists. Guests can search nutritionists and services, view offerings,
and request appointments. Nutritionists can review, accept, or reject pending
requests.

## Prerequisites

- Ruby version specified in `backend/.ruby-version`
- PostgreSQL
- Node.js and pnpm 11+

## Setup

From the repository root:

```bash
cp backend/.env.example backend/.env
pnpm setup
```

Update `backend/.env` if your PostgreSQL connection differs from the default.
To load sample nutritionists and services:

```bash
cd backend
bin/rails db:seed
cd ..
```

## Run Locally

Start the API and frontend together:

```bash
pnpm dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:3000>
- API health check: <http://localhost:3000/up>
- API documentation: <http://localhost:3000/api-docs>

Set `frontend/.env` with `VITE_API_URL` to use a different API URL.

## Test and Verify

Run the full test suite:

```bash
pnpm test
```

Run backend or frontend tests separately:

```bash
pnpm test:api
pnpm test:web
```

Run linting, type checking, API/client generation, and tests:

```bash
pnpm check
```

Regenerate the OpenAPI contract and frontend client after API changes:

```bash
pnpm api:sync
```
