# Demo Harness Agents

## Project

A Todo API (Express.js, in-memory store) used to demonstrate harness agent orchestration with Claude Code.

## Stack

- Node.js + Express
- Vanilla HTML/CSS/JS frontend
- Node built-in test runner (`node --test`)

## Commands

- `npm start` — run the server on port 3000
- `npm test` — run unit tests

## Agents

Five agents in `.claude/agents/`, all using `sonnet` with `medium` effort:

- **orchestrator** — entry point. Receives a task, coordinates the pipeline, enforces user approval after planning.
- **planner** — generates `workspaces/{task}/01-plan.md` with user story, acceptance criteria, task list, and implementation plan.
- **implementer** — implements one task at a time, marks it `[x]` in `01-plan.md`, reports back.
- **tester** — writes and runs unit tests for the current task.
- **qa** — validates only the current task against its acceptance criteria. Writes `workspaces/{task}/02-qa-report.md`.

## Pipeline flow

1. Planner writes the plan → user must approve
2. Per task: implementer → tester → QA
   - QA pass → notify user, next task
   - QA fail → implementer fixes → tester → QA (loop)
3. All tasks done → update CHANGELOG.md → commit

## Conventions

- Workspace folder: `workspaces/{feature-name}/`
- Each feature must have at least 2 sub-tasks in the plan
- QA only reviews the current task, not the whole feature
- Implementer must report completion before moving to the next task
- CHANGELOG.md lives at the project root, updated only after full QA pass

## Demo tasks (in order)

1. **Filter** — search/filter todos by status and keyword
2. **Tags** — add tags/labels to todos with filter by tag
3. **Export** — export todos as downloadable JSON file
