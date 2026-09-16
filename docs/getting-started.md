# Getting started

## Prerequisites

- Node.js 20+ recommended
- npm

## Clone & env

```bash
git clone https://github.com/alexbalut/ymca-quebec-gym-qr-guide.git
cd ymca-quebec-gym-qr-guide
cp .env.example .env
```

`.env.example` contains:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-to-a-long-random-string"
APP_URL="http://localhost:3000"
```

Prisma resolves `DATABASE_URL=file:./dev.db` relative to `prisma/` → `prisma/dev.db`.

## Install, database, seed

```bash
npm install
npx prisma db push
npm run seed
```

Or one-shot (also copies `.env` if missing):

```bash
npm install && npm run setup
```

## Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Staff: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Credentials: `admin@ymca-quebec.demo` / `demo1234`

## Production build (local check)

```bash
npm run build && npm start
```

## Re-seed

```bash
npm run seed
```

Seed **wipes** gyms, users, machines, and issues, then recreates YMCA Notre-Dame-de-Grâce with 10 machines and sample issues/views.

## Common errors

### `Environment variable not found: DATABASE_URL`

```bash
cp .env.example .env
```

Then retry Prisma / seed / `npm run dev`.

### Empty home (“No gym seeded”)

```bash
npm run seed
```

### Prisma / SQLite path

Keep `DATABASE_URL="file:./dev.db"`. File appears at `prisma/dev.db` (gitignored).

### Camera scan fails off localhost

Needs HTTPS or `localhost`. Use **Enter code** / manual entry as fallback.

### Wrong host in printed QRs

Update `APP_URL` before generating/printing QRs for a deployed URL.

## Sibling repo

Generic (non-Écono) product demo:

```bash
git clone https://github.com/alexbalut/gym-machine-qr-guide.git
```
