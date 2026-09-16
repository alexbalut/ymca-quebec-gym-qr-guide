# YMCA Québec Gym QR Guide (unofficial demo)

**QR machine-instruction app skinned for a YMCA Québec club demo.** Members scan a QR on a machine → bilingual (EN/FR) how-to guide. Staff manage machines, download QRs, print floor sheets, and review ROI insights.

> **Unofficial demo mockup for pitching only.** Not affiliated with YMCA Québec or any parent company. Does **not** use official logo image assets — text wordmark only. Brand colors (`#0060A9` / `#003366`) are approximate pitch tokens.

Seeded demo gym: **YMCA Notre-Dame-de-Grâce**. `/` is the **demo-ready member product UI** — not a marketing landing page.

Sibling (generic GymQR Guide): [gym-machine-qr-guide](https://github.com/alexbalut/gym-machine-qr-guide)

## Disclaimer

This repository is an **unofficial product demo**. YMCA Québec® and related marks belong to their respective owners. Do not represent this app as an official YMCA Québec product. No official logos are bundled.

## Quick start

```bash
cd ymca-quebec-gym-qr-guide
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

Or one-shot setup:

```bash
npm install && npm run setup && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — member gym home for **YMCA Notre-Dame-de-Grâce** (Machines / Workout / Progress / Scan).

## Demo credentials

| Field    | Value                    |
|----------|--------------------------|
| Email    | `admin@ymca-quebec.demo`        |
| Password | `demo1234`             |
| Gym      | YMCA Notre-Dame-de-Grâce                |
| Slug     | `ymca-quebec`           |

Seed creates **10 bilingual machines**, sample view counts, and a few open/resolved issues.

## Branding notes

- Surfaces use secondary `#003366` with primary accent **`#0060A9`**
- Text wordmark **YMCA Québec** — no trademarked logo files
- Tagline: “We build strong kids, families, communities”

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Gym member home |
| `/scan` | Camera QR scan |
| `/q/[token]` | Machine guide |
| `/m/ymca-quebec/[machineSlug]` | Friendly slug URL |
| `/admin/login` | Staff login |
| `/admin/insights` | Owner ROI dashboard |

## Caveats

- Auth is simple credential + JWT cookie — fine for demo; harden for production.
- SQLite at `prisma/dev.db` — don’t commit it.
- Member workout/progress is browser localStorage only (`ymca-quebec-workout:v1:<slug>`).
- Unofficial branding — do not ship as an official YMCA Québec app.

## Photo credits

Demo photos under `public/machines/` are from Unsplash — see [CREDITS.md](./CREDITS.md). Not official YMCA Québec assets.

## License / affiliation

This repository is an **unofficial product demo mockup** for pitch purposes. YMCA Québec® and related marks belong to their respective owners. Do not represent this app as an official YMCA Québec product.

## Repo

https://github.com/alexbalut/ymca-quebec-gym-qr-guide
