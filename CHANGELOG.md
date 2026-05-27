# Changelog

## [Unreleased]

### Added — Filter todos by status and keyword

- **Backend:** `GET /api/todos` now accepts `?status=completed|pending` and `?q=keyword` query params. Filters can be combined. Covered by 7 unit tests (all passing).
- **Frontend:** Filter UI (status select + search input) already existed; added empty-state message — `<p id="empty-message">` shown in `public/index.html` and toggled in `public/app.js` whenever the filtered list is empty.
