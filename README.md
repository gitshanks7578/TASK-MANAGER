# Task Tracker API

A REST API for teams to create projects, manage membership, and track tasks. It was built for the Backend Engineering Internship assignment and has no frontend.

## Stack

- Node.js 22, TypeScript, and Express 5
- PostgreSQL with Prisma ORM and Prisma migrations
- JWT authentication, bcrypt password hashing, Zod validation
- Vitest and Supertest for automated tests
- Dockerfile and Docker Compose configuration for containerised API runs

## Features implemented

- User registration, login, and logout with bcrypt password hashing.
- Authenticated project creation, retrieval, membership addition, and owner-only project deletion.
- Project-member task creation, task updates, creator-only task deletion, and assignee membership validation.
- Task status and priority, pagination, status/priority filtering, sorting, and per-project summary counts.
- Task updates set `completedAt` when status becomes `DONE` and clear it when a task is reopened.

## Prerequisites

- Node.js 22 or later and npm
- PostgreSQL 14 or later (a local instance or a hosted development database)

## Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create a PostgreSQL database, then create a local `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_tracker?schema=public"
   ACCESS_TOKEN_SECRET="replace-with-a-long-random-secret"
   PORT=3000
   ```

   `DATABASE_URL` and `ACCESS_TOKEN_SECRET` are required. `PORT` is optional and defaults to `3000`. Never commit this file or real credentials.

3. Generate Prisma Client and apply the checked-in migrations:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

   During local schema development, `npx prisma migrate dev` can be used instead of `migrate deploy`.

4. Start the development server:

   ```bash
   npm run dev
   ```

   The service listens at `http://localhost:3000`; `GET /health` returns a health-check response.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the TypeScript server with file watching. |
| `npm run build` | Compile TypeScript into `dist/`. |
| `npm start` | Start the compiled application. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |
| `npm run test:run` | Run the automated test suite once. |
| `npm run test:coverage` | Run tests with V8 coverage. |

### Tests

Tests load `.env.test`. Point its `DATABASE_URL` at an isolated PostgreSQL test database: the suite deletes users, projects, memberships, and tasks before test cases. Run:

```bash
npx dotenv -e .env.test -- npx prisma migrate deploy
npm run test:run
```

The test suite includes authentication success/failure, project authorization, invalid assignees, task filtering, and `completedAt` behaviour.

## Authentication

Login returns an access token and also sets an HTTP-only `accessToken` cookie. For API clients, send the token on protected routes:

```http
Authorization: Bearer <access-token>
```

Example registration and login:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"password123"}'
```

## API reference

All routes below are prefixed with `/api`. Except for registration and login, every endpoint requires authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register with `name`, `email`, and `password` (8-20 characters). |
| `POST` | `/auth/login` | Log in with email and password; returns a JWT. |
| `POST` | `/auth/logout` | Log out the authenticated user. |
| `POST` | `/projects` | Create a project with `name` and `description`; creator becomes owner. |
| `GET` | `/projects` | List projects owned by the authenticated user. |
| `GET` | `/projects/:id` | View a project as one of its members. |
| `POST` | `/projects/:id/members` | Owner only. Add an existing user by `{ "email": "..." }`. |
| `DELETE` | `/projects/:id` | Owner only. Delete a project. |
| `POST` | `/projects/:id/tasks` | Create a task as a project member. |
| `GET` | `/projects/:id/tasks` | List project tasks with query parameters below. |
| `PATCH` | `/tasks/:id` | Update an existing task as a project member. |
| `DELETE` | `/tasks/:id` | Delete a task as its creator. |
| `GET` | `/projects/:id/summary` | Return task totals grouped by status and priority. |

### Task requests

Create a task with `title`, and optionally `description`, `status`, `priority`, `dueDate`, and `assigneeId`. Valid statuses are `TODO`, `IN_PROGRESS`, and `DONE`; valid priorities are `LOW`, `MEDIUM`, and `HIGH`. An assignee must already be a member of the project.

```bash
curl -X POST http://localhost:3000/api/projects/<project-id>/tasks \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Design task schema","priority":"HIGH","status":"TODO"}'
```

`GET /projects/:id/tasks` supports `page` (default `1`), `limit` (default `10`, maximum `100`), `status`, `priority`, `sortBy`, and `order`. Supported `sortBy` values are `createdAt`, `updatedAt`, `title`, `dueDate`, and `priority`; `order` is `asc` or `desc`.

```text
GET /api/projects/<project-id>/tasks?status=TODO&priority=HIGH&page=1&limit=10&sortBy=dueDate&order=asc
```

Responses generally include a success flag or status, a message, and `data`. Errors currently return `{ "success": false, "message": "..." }` with an appropriate HTTP status.

## Design notes and assumptions

- PostgreSQL is used because the assignment prefers a relational database; Prisma migrations reproduce the schema.
- Past due dates are allowed. Due dates are parsed as ISO-compatible date/time values by the API.
- A project description is required by the current validation (10-100 characters), although the assignment permits it to be optional.
- The owner is created as a `ProjectMember` with the `OWNER` role when the project is created. Other members have the default `MEMBER` role.
- The project summary reports `totalTasks`, plus status counts and priority counts.

## Current limitations / follow-up work

- No Swagger/OpenAPI document or importable Postman/Bruno collection is included; this README is the current API reference.
- No `.env.example` file, seed script, demo video link, or `AI_USAGE.md` is currently included. These are required deliverables in the assignment brief and should be added before submission.
- Registration responses currently expose the stored `passwordHash`; this must be removed before submission because passwords or their hashes must never be returned by the API.
- `GET /projects` currently lists projects the user owns, not every project where they are a member.
- Task listing currently filters only by status and priority. Assignee and due-date-range filters from the brief are not yet implemented; its maximum page size is `100`, while the brief specifies `50`.
- Project membership is enforced for project detail and task creation/update routes, but the task-list and summary services should be strengthened with an explicit membership check before submission.
- Task deletion is limited to the creator; the brief also permits project owners to delete tasks.
- Docker Compose starts the API container but does not provision PostgreSQL or run migrations. Supply a reachable database and apply migrations separately.

## AI disclosure

This README was prepared with AI assistance after reviewing the repository and assignment brief. Before submitting, add the required `AI_USAGE.md` with the tools used, representative prompts/use cases, what was manually verified or changed, and one AI suggestion that was incorrect or insufficient, as required by the assignment.
