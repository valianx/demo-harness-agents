# Changelog

## [Unreleased]

### Added

- **Filter feature** (2026-05-24): Added `status` and `keyword` query-param filtering to `GET /api/todos`. The frontend now includes a filter bar with three status buttons (All / Active / Completed) and a keyword search input that immediately re-fetches and re-renders the filtered list on every change. Unit tests cover all filter combinations (7 tests, all passing).
