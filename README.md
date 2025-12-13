# Home Library Service

## Prerequisites

- **Git** — [Download & Install Git](https://git-scm.com/downloads)
- **Node.js** (v22+) with **npm** — [Download & Install Node.js](https://nodejs.org/en/download/)
- **Docker** — [Download & Install Docker](https://docs.docker.com/engine/install/)

## Downloading

```bash
git clone -b task/logging-error-authentication-authorization --single-branch \
  https://github.com/Alex-prokop/nodejs2025Q4-service.git
```

```bash
  cd nodejs2025Q4-service
```

## Installing Dependencies

```bash
npm install
```

## Environment variables

All required environment variables are already described in `.env.example`.

Create a real `.env` file based on this template:

```bash
cp .env.example .env
```

---

## Development Mode

Uses `docker-compose.yml` (default) with live-reload support:

- `app`: built from `Dockerfile.dev`, runs `npm run start:dev`
- `db`: PostgreSQL via `Dockerfile.db`
- Volume bind-mount: `./:/usr/src/app` → enables hot reload on code changes
- Same network (`app-net`) and volumes (`pgdata`, `pglogs`) as prod

### Workflow

#### 1. Start the dev stack

_Optional:_ if some old stack is running, stop it first:

```bash
docker compose down
```

Then, from the project root:

```bash
docker compose up -d
```

Creates containers: `home-library-app`, `home-library-db`.

#### 2. View logs

- Static logs:

  ```bash
  docker compose logs app
  docker compose logs db
  ```

- Live (follow) mode:

  ```bash
  docker compose logs -f app
  ```

  Expected: `Starting compilation in watch mode...`

#### 3. Verify dev API

```bash
curl http://localhost:4000/      # → "Hello World!"
curl http://localhost:4000/user  # → [] (empty array on fresh DB)
```

## Running tests

Option A — Locally (Node on host, DB in Docker)

#### 1. _Optional:_ stop any previous stack:

```bash
docker compose down
```

#### 2. Start only the database:

```bash
docker compose up -d db
```

#### 3. Run migrations:

```bash
npm run prisma:migrate:local
```

#### 4. Run e2e tests with auth:

```bash
npm run test:auth
```

```bash
npm run test:refresh
```

#### 5. _Optional:_ reset database:

```bash
npm run db:reset:local
```

## Option B — Fully in Docker

```bash
npm run docker:test
```
