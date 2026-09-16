# Deployment notes

## Local vs production

| Concern | Local | Production |
|---------|-------|------------|
| `APP_URL` | `http://localhost:3000` | Public HTTPS origin |
| `AUTH_SECRET` | Demo OK | Long random secret |
| `DATABASE_URL` | `file:./dev.db` | SQLite OK for demo; plan Postgres for scale |
| Camera | Works on localhost | Needs **HTTPS** |
| Cookie `secure` | Dev off | On in production |

## APP_URL and printed QRs

QRs embed `{APP_URL}/q/{token}` at generation time. Domain change ⇒ re-print or redirect old host.

## HTTPS for camera

Secure context required. Manual entry always works without camera.

## SQLite limits

Fine for demos / single-club pilots. Concurrent write limits; back up the DB file; migrate to Postgres when scaling.

## What to harden later

- Unique strong `AUTH_SECRET`
- Rate-limit login + public issue POST
- CSRF for cookie-authenticated mutations
- XSS review on guide text rendering
- Member accounts + server workout history if productizing
- Do not ship unofficial branding as an official YMCA Québec product
- Do not commit `.env` or `prisma/dev.db`

## Hosting sketch

```bash
npm install
npx prisma db push
npm run seed   # or a controlled production seed
npm run build
npm start
```

Set env vars on the host. Ensure the SQLite path is writable if you stay on SQLite.
