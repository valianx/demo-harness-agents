# Todo API

A simple Todo application with an Express.js REST API and a vanilla HTML/CSS/JS frontend. Todos are stored in memory.

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/todos` | List all todos |
| `GET` | `/api/todos/:id` | Get a single todo |
| `POST` | `/api/todos` | Create a todo (`{ "title": "..." }`) |
| `PUT` | `/api/todos/:id` | Update a todo (`{ "title": "...", "completed": true }`) |
| `DELETE` | `/api/todos/:id` | Delete a todo |

## Running

```bash
npm install
npm start        # http://localhost:3000
npm test         # run unit tests
```

## Roadmap

1. **Filter** — search and filter todos by completion status and keyword
2. **Tags** — assign multiple tags to todos and filter by tag
3. **Export** — download all todos as a JSON file
