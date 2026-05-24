# Plan: Filter Feature

## 1. User Story

> As a web app user, I want to filter and search my todo list by completion status and keyword directly in the browser, so that I can quickly find the todos I'm looking for without scrolling through everything.

## 2. Acceptance Criteria

- [ ] When the user types in the search field, the todo list updates in real time to show only todos whose title contains the typed text (case-insensitive).
- [ ] When the user selects "Completed" from the status dropdown, only completed todos are shown in the list.
- [ ] When the user selects "Active" from the status dropdown, only incomplete todos are shown in the list.
- [ ] When the user selects "All" from the status dropdown, all todos are shown regardless of status.
- [ ] When the user applies both a search term and a status filter at the same time, only todos matching both conditions are shown.
- [ ] When the search field is empty and the status filter is set to "All", all todos are shown (existing behavior preserved).
- [ ] When the user clears the search field, the full list (respecting the current status filter) is restored immediately.

## 3. Task List

- [x] Task 1: Implement query parameter filtering in the GET /api/todos endpoint — add `completed` and `q` filter logic directly in `src/routes/todos.js`.
- [x] Task 2: Add frontend UI controls — add a search input and a status dropdown to `public/index.html` that send filter query params to the API and re-render the list on every change.

## 4. Implementation Plan

### Files to modify

- `src/routes/todos.js` — update the `GET /` handler to read `req.query.completed` and `req.query.q`, apply them as filters on the in-memory `todos` array, and return the filtered result.
- `public/index.html` — add a text input (`q`) and a `<select>` dropdown with options "All / Active / Completed" above the todo list, and wire them to re-fetch todos from the API with the corresponding query parameters on every input/change event.

### Key design decisions

- Filtering is done server-side inside the route handler; no new files needed for this scope.
- `completed` query param: accept only the string values `"true"` or `"false"`; anything else (including absent) returns all todos.
- `q` query param: case-insensitive substring match on `todo.title`; absent or empty string returns all todos.
- Both filters compose with AND logic when both are present.
- Frontend calls `fetch('/api/todos?completed=...&q=...')` on every input/change event and re-renders the list; no framework required.

### Dependencies between tasks

- Task 1 must be completed before Task 2, because the frontend relies on the API supporting the query params.
