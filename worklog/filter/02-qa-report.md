# QA Report — Task 2: Frontend filter controls

## Verdict: PASS

## Acceptance Criteria Checked (Task 2 only)

### AC5: The frontend renders filter controls (a status selector and a keyword input) above the todo list.
- PASS. `public/index.html` contains `<select id="status-filter">` with options `all`, `active`, `completed` and `<input type="text" id="keyword-filter" placeholder="Search...">`. Both appear above `<ul id="todo-list">`.

### AC6: The frontend re-fetches and re-renders the list whenever the filter inputs change.
- PASS. `public/app.js`:
  - `loadTodos()` reads `statusFilter.value` and `keywordFilter.value`, builds query params via `URLSearchParams`, and fetches `/api/todos?...`.
  - `statusFilter.addEventListener('change', loadTodos)` — re-fetches on status change.
  - `keywordFilter.addEventListener('input', loadTodos)` — re-fetches on every keystroke.

## Tests
- 7 frontend static-analysis tests in `src/frontend.test.js` — all PASS.
- 5 backend filtering tests in `src/routes/todos.test.js` — all PASS (no regressions).
- Total: 12/12 tests passing.

## Files Modified
- `public/index.html` — added filter controls div with status select and keyword input.
- `public/app.js` — updated `loadTodos()` to build query params; added event listeners on both filter controls.
- `src/frontend.test.js` — new test file with 7 static analysis tests for frontend filter controls.
- `worklog/filter/01-plan.md` — Task 2 marked `[x]`.
