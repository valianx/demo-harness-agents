# Filter Feature — Work Plan

## User Story

As a user, I want to filter my todos by status (all / active / completed) and by a keyword so that I can quickly find relevant tasks without scrolling through the entire list.

---

## Acceptance Criteria

1. `GET /api/todos` accepts an optional `status` query param (`all` | `active` | `completed`). When omitted or `all`, all todos are returned.
2. `GET /api/todos` accepts an optional `keyword` query param. When provided, only todos whose `title` contains the keyword (case-insensitive) are returned.
3. Both params can be combined (e.g. `?status=active&keyword=buy`).
4. The frontend exposes a status filter (three buttons: All / Active / Completed) and a keyword search input.
5. Changing any filter control immediately re-fetches and re-renders the filtered list.
6. Unit tests cover all filter combinations for the backend route.

---

## Task List

- [x] Task 1 — Backend: add `status` and `keyword` query-param filtering to `GET /api/todos`
- [x] Task 2 — Frontend: add filter UI controls (status buttons + keyword search) that drive the API call

---

## Implementation Plan

### Task 1 — Backend filtering (`src/routes/todos.js`)

Modify the `router.get('/')` handler to:

1. Read `req.query.status` (default `'all'`).
2. Read `req.query.keyword` (default `''`).
3. Filter `todos` array:
   - If `status === 'active'` → keep only `completed === false`.
   - If `status === 'completed'` → keep only `completed === true`.
   - If `keyword` is non-empty → keep only items where `todo.title.toLowerCase().includes(keyword.toLowerCase())`.
4. Return the filtered array.

Write unit tests in `src/routes/todos.test.js`:
- No params → returns all todos.
- `status=active` → returns only active todos.
- `status=completed` → returns only completed todos.
- `keyword=buy` → returns only todos whose title contains "buy" (case-insensitive).
- Combined `status=active&keyword=buy` → intersection filter.

### Task 2 — Frontend filter UI (`public/index.html` + `public/app.js`)

HTML changes (`public/index.html`):
- Add a filter bar below the form with:
  - Three `<button>` elements: "All", "Active", "Completed" (with `data-status` attributes).
  - A `<input type="text">` with id `filter-input` as the keyword search field.

JS changes (`public/app.js`):
- Track current `activeStatus = 'all'` and `activeKeyword = ''` variables.
- Update `loadTodos()` to build the query string from those variables and fetch `/api/todos?status=...&keyword=...`.
- Add click handlers on status buttons (highlight active button, update `activeStatus`, call `loadTodos()`).
- Add `input` event listener on keyword field (update `activeKeyword`, call `loadTodos()`).

CSS changes (`public/style.css`):
- Style the filter bar and active-button highlight.
