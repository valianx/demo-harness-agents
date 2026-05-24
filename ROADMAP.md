# Roadmap

Three features to implement using the harness pipeline. Each one will be processed by the orchestrator and broken into at least 2 sub-tasks by the planner.

## 1. Filter

Add search and filter capabilities to the todos endpoint.

- Filter todos by completion status (`completed=true|false`)
- Search todos by keyword in the title (`q=keyword`)
- Support combining both filters in a single request

## 2. Tags

Add tags/labels support to todos.

- Assign multiple tags to a todo on creation and update
- Filter todos by tag (`tag=work`)
- Return tags in all todo responses

## 3. Export

Add an endpoint to export todos as a downloadable JSON file.

- `GET /api/todos/export` returns a `.json` file download
- The export includes all todos with their current state
- Response uses `Content-Disposition` header for file download
