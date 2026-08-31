# Task Tracker API

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-1B4D3E?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7F1D1D?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-B7410E?style=for-the-badge&logo=docker&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-4A0E0E?style=for-the-badge&logo=githubactions&logoColor=white)

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

| Method   | Endpoint                | Purpose                                 |
| -------- | ----------------------- | --------------------------------------- |
| `POST`   | `/auth/register`        | Register a new user                     |
| `POST`   | `/auth/login`           | Authenticate a user                     |
| `POST`   | `/auth/logout`          | Log out the authenticated user          |
| `POST`   | `/projects`             | Create a project                        |
| `GET`    | `/projects`             | List accessible projects                |
| `GET`    | `/projects/:id`         | View a project                          |
| `DELETE` | `/projects/:id`         | Delete a project as owner               |
| `POST`   | `/projects/:id/members` | Add an existing user to a project       |
| `POST`   | `/projects/:id/tasks`   | Create a project task                   |
| `GET`    | `/projects/:id/tasks`   | List project tasks                      |
| `PATCH`  | `/tasks/:id`            | Update a task                           |
| `DELETE` | `/tasks/:id`            | Delete a task                           |
| `GET`    | `/projects/:id/summary` | View task totals by status and priority |


Task lists support pagination, sorting, and filters for status, priority, and assignee; the maximum page size is 50. Project task lists and summaries require project membership. A task may be deleted by its creator or the project owner.

## Live API

[https://task-manager-3l1m.onrender.com](https://task-manager-3l1m.onrender.com)

## Postman Collection

[Open the Postman collection](https://www.postman.com/shashanku346-9208905/workspace/task-manager/collection/49663479-0c02a66b-a176-4d6a-a298-a3fb7019be18?action=share&source=copy-link&creator=49663479)

## Demo

[Demo video](PASTE_DEMO_VIDEO_LINK_HERE)

## AI disclosure

AI-assisted work, including the tools and verification performed, is documented in the separate `AI_USAGE.md` submission artifact.
