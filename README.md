# Home Library Service

## Prerequisites

- **Git** — [Download & Install Git](https://git-scm.com/downloads)
- **Node.js** (v22+) with **npm** — [Download & Install Node.js](https://nodejs.org/en/download/)
- **Docker** — [Download & Install Docker](https://docs.docker.com/engine/install/)

## Downloading

```bash
git clone <repository-url>
cd nodejs2025Q4-service
```

## Checkout task branch

```bash
git checkout task/docker-postgres-orm
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

#### 4. Run tests inside the dev container

```bash
docker compose exec app npm test
```

#### 5. Run script for vulnerabilities scanning

```bash
npm run scan:vuln
```

> **Note**: The only difference from production is the runtime — dev uses source code with live reload; prod uses the prebuilt, optimized image.

---

## Production Deployment (DockerHub)

A ready-to-use production image is published on Docker Hub:

```
alexprokop7/home-library:latest
```

### Image Build Strategy (`multi-stage`)

- **`builder` stage**:  
  `npm ci` → `npm run build` → NestJS compiled to `dist/`

- **`runner` stage**:  
  `npm ci --omit=dev` → copies `dist/` and `doc/api.yaml`  
  Entrypoint: `npm run start:prod` → `node dist/src/main.js`

### Running with `docker-compose.hub.yml`

The repository includes `docker-compose.hub.yml`, which uses the prebuilt Docker Hub image and starts:

- `app`: application container (`alexprokop7/home-library:latest`)
- `db`: PostgreSQL container (`postgres:16-alpine`)
- Custom bridge network: `app-net`
- Volumes: `pgdata`, `pglogs` (for Postgres data & logs)

#### Step-by-step setup:

_Optional:_ if dev stack is running, you can stop it:

```bash
 docker compose down
```

1. **Start the database only**

   ```bash
   docker compose -f docker-compose.hub.yml up -d db
   ```

2. **Run Prisma migrations**

   ```bash
   npm run prisma:migrate:hub
   ```

3. **Start the full stack**

   ```bash
   docker compose -f docker-compose.hub.yml up -d
   ```

4. **Verify the service is running**
   - Application logs:

     ```bash
     docker compose -f docker-compose.hub.yml logs app
     ```

     Expected output includes:

     ```
     Nest application successfully started
     ```

     and route registration for `/`, `/user`, `/artist`, `/album`, `/track`, `/favs`, etc.

   - HTTP endpoint test:
     ```bash
     curl http://localhost:4000/      # → "Hello World!"
     curl http://localhost:4000/user  # → [] (empty array on fresh DB)
     ```
