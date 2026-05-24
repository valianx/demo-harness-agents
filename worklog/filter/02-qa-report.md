# QA Report — Filter Feature

## Task 1 — Backend: add `status` and `keyword` query-param filtering to `GET /api/todos`

**Verdict: PASS**

### Acceptance Criteria Checked (Task 1 scope)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `GET /api/todos` accepts optional `status` param (`all`/`active`/`completed`); omitted or `all` returns all todos | PASS |
| 2 | `GET /api/todos` accepts optional `keyword` param; only todos whose `title` contains keyword (case-insensitive) are returned | PASS |
| 3 | Both params can be combined (intersection filter) | PASS |
| 6 | Unit tests cover all filter combinations for the backend route | PASS |

### Evidence

- `src/routes/todos.js`: `router.get('/')` handler now reads `req.query.status` (default `'all'`) and `req.query.keyword` (default `''`), applies filters in sequence, returns filtered array.
- `src/routes/todos.test.js`: 7 unit tests covering:
  - No params → all todos returned
  - `status=active` → only non-completed todos
  - `status=completed` → only completed todos
  - `keyword=buy` → case-insensitive title match
  - `status=active&keyword=buy` → intersection
  - `status=all` explicit → all todos
  - Empty store → empty array
- All 7 tests pass (`npm test` output: 7 pass, 0 fail).

### Notes

- Criteria 4 and 5 (frontend UI) are out of scope for Task 1 and will be validated in Task 2.

---

## Task 2 — Frontend: filter UI controls (status buttons + keyword search)

**Verdict: PASS**

### Acceptance Criteria Checked (Task 2 scope)

| # | Criterion | Status |
|---|-----------|--------|
| 4 | Frontend exposes three status buttons (All / Active / Completed) and a keyword search input | PASS |
| 5 | Changing any filter control immediately re-fetches and re-renders the filtered list | PASS |

### Evidence

**`public/index.html`**
- `.filter-bar` div added below the form containing:
  - Three `<button class="status-btn">` elements with `data-status="all"`, `data-status="active"`, `data-status="completed"`.
  - `<input type="text" id="filter-input">` for keyword search.
- "All" button has `active` class by default, matching initial state.

**`public/app.js`**
- `activeStatus = 'all'` and `activeKeyword = ''` module-level variables track filter state.
- Click handlers on `.status-btn` elements: remove `active` class from all buttons, add to clicked, update `activeStatus`, call `loadTodos()`.
- `input` event listener on `#filter-input`: updates `activeKeyword`, calls `loadTodos()`.
- `loadTodos()` builds query string via `URLSearchParams({ status: activeStatus, keyword: activeKeyword })` and fetches `/api/todos?${params}` — filter state is always sent on every fetch.

**`public/style.css`**
- `.filter-bar`, `.status-buttons`, `.status-btn`, `.status-btn.active`, `#filter-input` styles added.
- Active button is visually highlighted with filled blue background.

**Tests**
- All 7 existing backend unit tests continue to pass (npm test: 7 pass, 0 fail).
- Task is frontend-only; no new backend logic introduced.

### Notes

- Both filter controls (status + keyword) trigger `loadTodos()` immediately on change, satisfying criterion 5.
- The URL always includes both params, which is consistent with the backend's defaults (`status=all`, `keyword=`).

