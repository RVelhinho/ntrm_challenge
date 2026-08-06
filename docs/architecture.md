# Architecture

## Domain Rules

- A guest is identified by an email normalized with trim and lowercase.
- A guest has at most one pending request. Creation locks the guest, marks an
  existing pending request as superseded, and creates the replacement. A partial
  unique PostgreSQL index also enforces the invariant.
- A request cannot be created over an accepted appointment for the same
  nutritionist. The service checks under a nutritionist lock.
- Accepted appointments cannot overlap. PostgreSQL enforces this with a GiST
  exclusion constraint in addition to application checks.
- Accepting a request locks the nutritionist and request, rejects every other
  overlapping pending request for that nutritionist, and accepts the selected
  request in the same transaction.
- Reject and create workflows are transactional; status and answer timestamp
  consistency is also database constrained.
- The exact overlap predicate is
  `existing.starts_at < candidate.ends_at && existing.ends_at > candidate.starts_at`.
  Adjacent appointments therefore do not overlap.
- Appointment timestamps are stored in UTC and service prices are integer cents.
- Authentication is intentionally absent, so the appointment queue is global.
- Email notifications are intentionally not implemented. Accepted and rejected
  decisions currently update persisted state only.

## Search And Pagination

Nutritionist search matches nutritionist or service names. Locations are plain
service text values. A submitted location must match an existing canonical value case-insensitively,
otherwise the search uses the fixed Braga fallback.

Nutritionists are ordered by normalized name and ID. Appointment requests are
ordered by start time and ID. Both collection endpoints use numeric item ID
anchors with a default page size of 10 and maximum of 50.
Clients omit `after_id` for the first page and pass the returned numeric
`next_id` as `after_id` for the next page.

The frontend keeps a page-to-anchor list beginning with page 1 and an undefined
anchor. Visiting the immediate next page stores the response's `next_id`
for that page. Previous and numbered buttons then reuse already discovered
anchors, while a new search or an appointment decision clears the list. The UI
exposes visited pages plus the immediately reachable next page rather than
pretending it can jump to an undiscovered page.

## Boundaries

The Rails API owns domain validation, transactions, locks, PostgreSQL
constraints, serialization, and the OpenAPI contract. Controllers parse input,
invoke queries or services, and render consistent JSON errors.

The React application uses TanStack Query for server state and generated Orval
operations behind feature components. Pages live in `frontend/src/pages`,
features in `frontend/src/features`, application providers in
`frontend/src/app/providers`, and shared UI primitives in
`frontend/src/components/shared/ui`.

Rswag generates `backend/swagger/v1/openapi.yaml`; Orval consumes it to generate
`frontend/src/api/generated`. Both are committed artifacts. Change Rswag specs,
run `pnpm api:sync`, and commit the result. Generated TypeScript is never edited
manually, and CI regenerates both stages and checks for tracked drift.
