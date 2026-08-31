# Task Tracker API

![Node.js](https://img.shields.io/badge/Node.js-22-1B5E20?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-1E3A5F?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-111111?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-064E3B?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3F3F46?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-9A3412?logo=docker&logoColor=white)
![CI](https://img.shields.io/badge/CI-6D1F2B?logo=githubactions&logoColor=white)

## Project overview

Task Tracker API is a backend-only REST service for teams to organise projects, manage project membership, and track work items. Registered users can create projects, collaborate with members, assign tasks, and view task summaries through authenticated endpoints. No frontend is included; the API is intended for use with an API client such as Postman.

## Stack

- Node.js 22, TypeScript, and Express 5
- PostgreSQL and Prisma ORM
- JWT authentication, bcrypt password hashing, and Zod validation
- Vitest and Supertest for automated testing
- Docker/Docker Compose and GitHub Actions CI

## Features

- JWT-based authentication with protected project and task routes
- Project creation, member management, and owner/member authorization
- Task creation, assignment, updates, priority, status, and completion tracking
- Paginated and sortable task lists with status, priority, and assignee filtering
- Per-project task summaries grouped by status and priority
- Reproducible Prisma migrations, automated tests, Docker support, and CI/CD

## Setup

Prerequisites: Node.js 22+, npm, and PostgreSQL. Copy `.env.example` to `.env` and provide local values:

```env
DATABASE_URL=
ACCESS_TOKEN_SECRET=
```

Install dependencies, generate Prisma Client, apply migrations, and start the development server:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The API runs on `http://localhost:3000` by default. Docker users can run `docker compose up --build` after configuring `.env`.

## Testing

Use an isolated PostgreSQL database in `.env.test`; the test suite clears its data during execution. Apply migrations to that database and run:

```bash
npx dotenv -e .env.test -- npx prisma migrate deploy
npm run test:run
```

## API overview

Base path: `/api`. Protected endpoints use `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register`, `/auth/login`, `/auth/logout` | Register, authenticate, or log out |
| `POST`, `GET` | `/projects` | Create a project or list accessible projects |
| `GET`, `DELETE` | `/projects/:id` | View a project or delete it as owner |
| `POST` | `/projects/:id/members` | Add an existing user as project owner |
| `POST`, `GET` | `/projects/:id/tasks` | Create or list project tasks |
| `PATCH`, `DELETE` | `/tasks/:id` | Update or delete a task |
| `GET` | `/projects/:id/summary` | View task totals by status and priority |

Task lists support pagination, sorting, and filters for status, priority, and assignee; the maximum page size is 50. Project task lists and summaries require project membership. A task may be deleted by its creator or the project owner.

## Live API

[https://task-manager-3l1m.onrender.com](https://task-manager-3l1m.onrender.com)

## Postman Collection

[Open the Postman collection](https://www.postman.com/shashanku346-9208905/workspace/task-manager/collection/49663479-0c02a66b-a176-4d6a-a298-a3fb7019be18?action=share&source=copy-link&creator=49663479)

## Demo

[Demo video](PASTE_DEMO_VIDEO_LINK_HERE)

## AI disclosure

AI-assisted work, including the tools and verification performed, is documented in the separate `AI_USAGE.md` submission artifact.
