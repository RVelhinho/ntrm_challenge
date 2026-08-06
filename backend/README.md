# Appointment Requests API

Rails 8.1 JSON API backed by PostgreSQL.

## Setup

Use Ruby 3.3.9, Bundler 4.0.17, and PostgreSQL 16 or newer. From the repository
root, `pnpm setup` installs all dependencies and prepares the databases. Then
load the demo data, which is required for usable nutritionist search results:

```bash
cd backend
bin/rails db:seed
```

No dotenv gem is installed. Rails uses its local defaults (`nutrium_development`
and `nutrium_test`) or the standard environment variable exported by your shell:

```bash
export DATABASE_URL=postgresql://user:password@localhost/nutrium_development
export FRONTEND_ORIGINS=http://localhost:5173
```

Appointment decision emails are written to `tmp/mailer` in development. The
test environment uses Rails' in-memory email delivery, so neither environment
requires an SMTP host.

`FRONTEND_ORIGINS` accepts a comma-separated list and defaults to the local Vite
origin. Search location is data-backed text: absent or invalid locations always
fall back to Braga and are not configurable by environment.

## Routes

- `GET /api/v1/nutritionists`: search by `q` (or `name`/`service`) and optional
  exact, case-insensitive `location`
- `GET /api/v1/appointment_requests`: global request list, optionally filtered
  by `q` or `status`
- `POST /api/v1/appointment_requests`: create a request
- `PATCH /api/v1/appointment_requests/:id/accept`: accept a pending request
- `PATCH /api/v1/appointment_requests/:id/reject`: reject a pending request
- `GET /up`: health check
- `/api-docs`: interactive documentation
- `GET /api-docs/v1/openapi.yaml`: raw generated OpenAPI contract

Both collection endpoints use ID-anchor pagination. Pass `limit` from 1 to 50
(default 10), omit `after_id` for the first page, and pass the returned `next_id`
as `after_id` for the next page. Malformed or unknown anchors return a
structured `422` error with code `invalid_after_id`.

## Development

```bash
bin/rails server -p 3000
bundle exec rspec
bundle exec rubocop
bundle exec brakeman --quiet --no-pager --exit-on-warn --exit-on-error
bundle exec bundler-audit check --update
```

Rswag request specs are the source for `swagger/v1/openapi.yaml`. After an API
contract change, run `pnpm openapi` from the repository root, then run
`pnpm codegen` when the generated frontend client should also be updated.
