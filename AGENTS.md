# Appointment Requests - Agent Instructions

## Project objective

Build a small appointment-request application connecting guests with
nutritionists.

Guests can:

- Search nutritionists by nutritionist name or service name.
- Optionally search by location.
- View the services offered by each nutritionist.
- Request an appointment using their name, email, date and time.

Nutritionists can:

- View pending appointment requests.
- Accept or reject each request.

Business rules:

- A guest is identified by normalized email.
- A guest may have at most one pending appointment request.
- Creating a new pending request supersedes the guest's previous pending request.
- Creating or accepting a request must not overlap an accepted request for the
  same nutritionist; PostgreSQL also enforces this invariant.
- Accepting a request rejects every overlapping pending request belonging to
  the same nutritionist.
- An appointment overlaps another when:
  `existing.starts_at < candidate.ends_at &&
existing.ends_at > candidate.starts_at`.
- Email notifications are intentionally not implemented.
- Authentication is intentionally out of scope.
- Braga is the default location when the submitted location is absent or invalid.

## Technology

Backend:

- Ruby on Rails 7.2 or newer
- Rails API mode
- PostgreSQL
- RSpec
- Rswag/OpenAPI

Frontend:

- React
- TypeScript with strict mode
- Vite
- Tailwind CSS
- TanStack Query
- TanStack Form
- Zod
- Vitest
- Testing Library
- MSW
- Orval-generated API client

Package management:

- Use Bundler for Ruby.
- Use pnpm for JavaScript.
- Do not introduce npm or yarn lockfiles.

## Repository layout

- `backend/`: Rails JSON API.
- `frontend/`: React application.
- `backend/swagger/v1/openapi.yaml`: generated OpenAPI contract.
- `frontend/src/api/generated/`: generated Orval code.
- `frontend/src/features/`: feature-specific frontend code. Each feature
  component or cohesive component set must have its own folder containing the
  implementation and its tests, for example
  `frontend/src/features/nutritionist-search/SearchField/SearchField.tsx` and
  `frontend/src/features/nutritionist-search/SearchField/SearchField.test.tsx`.
- `frontend/src/pages/`: route-level page components; each page must have its
  own folder containing the page implementation and its tests, for example
  `frontend/src/pages/LandingPage/LandingPage.tsx` and
  `frontend/src/pages/LandingPage/LandingPage.test.tsx`.
- `frontend/src/components/shared/ui/`: shared presentational components. Each UI
  component or cohesive component set must have its own folder containing the
  implementation and its tests, for example
  `frontend/src/components/shared/ui/Button/Button.tsx` and
  `frontend/src/components/shared/ui/Button/Button.test.tsx`.
- `frontend/src/app/providers/`: application-level providers, including
  `LanguageProvider`.

## Architectural rules

### Backend

- Keep controllers thin.
- Controllers may parse input, authorize, invoke a use case and render a response.
- Do not implement business transactions directly in controllers.
- Put multi-model business operations under `app/services`.
- Put reusable search construction under `app/queries`.
- Use database constraints in addition to model validations.
- Use transactions for appointment creation, acceptance and rejection.
- Lock records when concurrent decisions could violate an invariant.
- Do not use model callbacks for appointment-decision workflows.
- Do not introduce mailer behavior without an explicit product requirement.
- Store money as integer cents, never floating point.
- Store appointment timestamps in UTC.
- Normalize guest emails to lowercase.
- Return consistent JSON error objects.
- Avoid speculative abstractions and unnecessary gems.

### Frontend

- Do not manually define API response types when an OpenAPI-generated type exists.
- Never edit files under `src/api/generated`.
- Use TanStack Query for server state.
- Keep temporary modal and input state local unless multiple routes need it.
- Use TanStack Form and Zod for non-trivial forms.
- Use TanStack Form for application forms; do not introduce React Hook Form.
- Components should not call `fetch` directly.
- Use generated queries and mutations behind feature components.
- Separate page composition from reusable UI components.
- Keep all route-level page components inside `frontend/src/pages/`.
- Keep each page implementation and its tests in a same-named folder under
  `frontend/src/pages/`.
- Keep each feature component or cohesive feature component set and its tests
  in a same-named folder under `frontend/src/features/`.
- Keep each shared UI component or cohesive UI component set in its own folder
  under `frontend/src/components/shared/ui/`, colocating implementation and test files.
- Keep application-level providers under `frontend/src/app/providers/`; do not
  place providers in the i18n directory or feature directories.
- Use the shared Radix UI dialog primitive for every modal and the shared Radix
  UI dropdown primitive for menus and option lists; do not implement custom
  focus or keyboard management when a shared primitive exists.
- Use the shared Radix autocomplete/popover primitive for editable suggestion
  inputs; do not wrap editable inputs in menu triggers.
- All user-visible text must use the i18n translation resources and provider;
  do not add hardcoded UI copy.
- Every currently supported language must contain every translation key. Add
  new translation keys to all locale files in the same change.
- Language changes must go through the shared language provider, not local
  component state.
- Always use shared UI primitives from `frontend/src/components/shared/ui/` when one
  exists; add a reusable primitive there before duplicating shared presentation
  or interaction patterns in a feature.
- Always add Vitest coverage for UI components.
- Separate logic from presentation when possible.
- Type every component prop and event handler explicitly.
- Prefer semantic HTML and accessible labels.
- Dialogs must support keyboard navigation and Escape.
- Buttons must expose disabled and loading states.
- Provide loading, empty, error and success feedback.
- Avoid `useMemo`, `useCallback` and `React.memo` unless there is a measured or
  structurally clear reason.
- Do not add Redux or another global state library.

### Styling

- Use Tailwind utility classes.
- Reuse shared UI primitives instead of duplicating long class strings.
- Use `clsx` and `tailwind-merge` for conditional classes.
- Match the supplied reference design before adding visual extras.
- Keep responsive behavior functional at mobile and desktop widths.
- Do not add a full component library unless explicitly requested.

## API contract and code generation

The Rails OpenAPI document is the source of truth.

After changing an API route, parameter, request body or response:

1. Update the relevant Rswag request specification.
2. Run `pnpm openapi`.
3. Run `pnpm codegen`.
4. Update frontend call sites.
5. Run `pnpm typecheck`.
6. Run affected backend and frontend tests.

Never manually patch generated TypeScript output.

After implementing any frontend change, always run `pnpm format`.

## Required commands

Install and prepare:

```bash
pnpm setup
```
