# Changelog

## [Unreleased]

### Added

- **Filter feature**: search and filter todos by status and keyword.
  - `GET /api/todos` now accepts `?q=<keyword>` for case-insensitive substring search on todo titles.
  - `GET /api/todos` now accepts `?completed=true|false` to filter by completion status; omitting the param returns all todos.
  - Both filters compose with AND logic when used together.
  - Frontend (`public/index.html`, `public/app.js`) gains a search input and a status dropdown that send the corresponding query params to the API and re-render the list on every change.
  - Unit tests added in `src/routes/todos.test.js` covering all filter combinations.
  - `src/index.js` refactored to use `require.main === module` guard so the server does not auto-start when required by tests.
