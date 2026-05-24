# Feature: Filter — Search and Filter Todos by Status and Keyword

## User Story

As a user, I want to search and filter my todo list by status (all / active / completed) and by a keyword in the title, so that I can quickly find relevant tasks without scrolling through the full list.

## Acceptance Criteria

1. The `GET /api/todos` endpoint accepts an optional `status` query parameter (`all`, `active`, `completed`) and returns only the matching todos.
2. The `GET /api/todos` endpoint accepts an optional `keyword` query parameter and returns only todos whose title contains the keyword (case-insensitive).
3. Both filters can be combined: `?status=active&keyword=buy` returns active todos whose title contains "buy".
4. When no query parameters are provided, all todos are returned (existing behavior is preserved).
5. The frontend renders filter controls (a status selector and a keyword input) above the todo list.
6. The frontend re-fetches and re-renders the list whenever the filter inputs change.

---

## Task List

- [x] Task 1 — Backend: add `status` and `keyword` query-param filtering to `GET /api/todos`
- [x] Task 2 — Frontend: add filter controls (status select + keyword input) and wire them to the API

---

## Implementation Plan

### Task 1 — Backend filtering

**File:** `src/routes/todos.js`

- In the `GET /` handler, read `req.query.status` and `req.query.keyword`.
- Apply status filter:
  - `active` → `todo.completed === false`
  - `completed` → `todo.completed === true`
  - `all` or omitted → no filter
- Apply keyword filter: `todo.title.toLowerCase().includes(keyword.toLowerCase())`
- Both filters are applied together (AND logic).
- Return the filtered array.

**Tests:** `src/routes/todos.test.js`

- Returns all todos when no query params are given.
- Returns only incomplete todos when `status=active`.
- Returns only completed todos when `status=completed`.
- Filters by keyword (case-insensitive).
- Combines status and keyword filters correctly.

---

### Task 2 — Frontend filter controls

**Files:** `public/index.html`, `public/app.js`

- In `index.html`, add above `#todo-list`:
  - A `<select id="status-filter">` with options: `all`, `active`, `completed`.
  - An `<input type="text" id="keyword-filter" placeholder="Search...">`.
- In `app.js`:
  - Update `loadTodos()` to read the current values from both controls and append them as query params to `/api/todos`.
  - Add `change` and `input` event listeners on both controls that call `loadTodos()`.

No backend changes are needed for this task.
