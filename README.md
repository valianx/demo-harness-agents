# Demo Harness Agents

A minimal Todo API used to demonstrate how a **harness** orchestrates specialized AI agents through a structured development pipeline.

## What is a Harness?

A harness is the layer that defines what each agent can do, orchestrates the flow between them, maintains state in files, and enforces gates where a human must approve before continuing. It turns "chatting with an LLM" into a predictable team of agents with clear roles.

## The Pipeline

```
User request
     │
     ▼
┌──────────┐
│ Planner  │ → writes worklog/{task}/01-plan.md
└────┬─────┘
     │
     ▼
 User approval (mandatory gate)
     │
     ▼
┌──────────────── per task loop ─────────────────┐
│                                                 │
│  ┌─────────────┐                                │
│  │ Implementer │ → codes + marks task [x]       │
│  └──────┬──────┘                                │
│         ▼                                       │
│  ┌─────────────┐                                │
│  │   Tester    │ → writes + runs unit tests     │
│  └──────┬──────┘                                │
│         ▼                                       │
│  ┌─────────────┐                                │
│  │     QA      │ → validates current task only  │
│  └──────┬──────┘                                │
│         │                                       │
│     pass? ──no──► back to Implementer (loop)    │
│         │                                       │
│        yes                                      │
│         │                                       │
│    notify user ──► next task                    │
│                                                 │
└─────────────────────────────────────────────────┘
     │
     ▼
  CHANGELOG.md + git commit
```

## Base App

A simple Express.js Todo API with an in-memory store and a basic HTML/CSS/JS frontend.

- `GET    /api/todos`     — list all todos
- `GET    /api/todos/:id` — get one todo
- `POST   /api/todos`     — create a todo (`{ "title": "..." }`)
- `PUT    /api/todos/:id` — update a todo (`{ "title": "...", "completed": true }`)
- `DELETE /api/todos/:id` — delete a todo

## Demo Tasks

Three features to implement using the harness pipeline. Each one is broken into at least 2 sub-tasks by the planner.

### 1. Filter
Add search and filter capabilities to the todos endpoint. Users should be able to filter by completion status and search by keyword in the title.

### 2. Tags
Add tags/labels to todos. Users should be able to assign multiple tags to a todo and filter the list by tag.

### 3. Export
Add an endpoint to export all todos as a downloadable JSON file.

## Running

```bash
npm install
npm start        # http://localhost:3000
npm test         # run unit tests
```

## Agents

All agents live in `.claude/agents/` and use `sonnet` model with `medium` effort.

| Agent | Role |
|---|---|
| `orchestrator` | Receives the task, coordinates the pipeline, enforces gates |
| `planner` | Writes the plan: user story, acceptance criteria, task list, implementation approach |
| `implementer` | Implements one task at a time, marks it done, reports back |
| `tester` | Writes and runs unit tests for the current task |
| `qa` | Validates the current task against its acceptance criteria — pass or fail |

## Worklog

Each feature produces a subfolder under `worklog/`:

```
worklog/{feature-name}/
├── 01-plan.md        ← written by planner
└── 02-qa-report.md   ← written by qa
```
