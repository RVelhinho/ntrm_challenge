# Appointment Requests API

## Requirements

- Ruby version in the repository `.ruby-version`
- PostgreSQL
- Bundler

## Setup

From the repository root:

```bash
pnpm setup
```

To configure the API manually, copy `.env.example` to `.env` and set
`DATABASE_URL` and `FRONTEND_ORIGINS` as needed. The default search location is
Braga and can be changed with `DEFAULT_SEARCH_LOCATION`.

The development database can be initialized with sample nutritionists and
services using:

```bash
bin/rails db:prepare
bin/rails db:seed
```

Seeds are idempotent and can be run repeatedly.

## Development

Start the API on port 3000:

```bash
bin/rails server -p 3000
```

Health check: `GET /up`

OpenAPI documentation: `/api-docs`

## Verification

```bash
bundle exec rspec
bundle exec rubocop
bundle exec brakeman --quiet --no-pager --exit-on-warn --exit-on-error
bundle exec bundler-audit check --update
```

Regenerate the OpenAPI contract and frontend client from the repository root:

```bash
pnpm api:sync
```
