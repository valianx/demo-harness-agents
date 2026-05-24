# Changelog

## [Unreleased]

### Added

- **Filter feature** — Search and filter todos by status and keyword.
  - `GET /api/todos` now accepts optional `status` (`all`, `active`, `completed`) and `keyword` query parameters.
  - Both filters can be combined (AND logic).
  - Frontend adds a status selector and a keyword input above the todo list; the list re-fetches on every change.
  - 12 unit tests covering backend filtering and frontend structure (all passing).
