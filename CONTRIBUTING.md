# Contributing

## Local development

```bash
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

See [docs/getting-started.md](./docs/getting-started.md).

## Feature parity

Keep this repo **feature-parallel** with [gym-machine-qr-guide](https://github.com/alexbalut/gym-machine-qr-guide). Differences should be branding, seed gym, copy, and localStorage key prefixes — not product scope drift.

## Do not

- Add a marketing / SaaS pitch landing at `/` — keep `/` as the **member product UI**
- Add **official** YMCA Québec logo image assets
- Remove or bury the unofficial disclaimer
- Commit `.env`, `prisma/dev.db`, or `node_modules`

## Photos

Demo images under `public/machines/` must stay credited — see [CREDITS.md](./CREDITS.md). They are stock Unsplash demos, not club floor photos.
