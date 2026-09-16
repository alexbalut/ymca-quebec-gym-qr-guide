# Member experience

Members never log in. `/` is the in-product gym home for **YMCA Notre-Dame-de-Grâce**.

## Home tabs

Four primary tabs (URL-synced via `?tab=`):

| Tab | Purpose |
|-----|---------|
| **Machines** | Browse active machines; enter-code mode also available |
| **Workout** | Log an in-progress session (strength sets or cardio) |
| **Progress** | Stats from **saved** workouts |
| **Scan** | Camera QR scan (+ manual fallback) |

Deep links: `/?tab=workout`, `/?tab=progress`, `/?tab=scan` (also accepts `?mode=`). Dedicated route `/scan` remains available.

Home shows bilingual brand taglines: EN “Super nice gyms, very low prices” / FR “Super beaux gyms, très bas prix”.

## Language

EN / FR toggle on the home header and on machine guides. Content uses bilingual DB fields.

## QR & guide flow

1. Staff print stickers encoding `{APP_URL}/q/{token}`.
2. Scan → `/q/[token]` machine guide (opaque token).
3. Friendly URLs: `/m/ymca-quebec/lat-pulldown`.
4. Opening a guide increments `Machine.viewCount`.
5. Optional photo strip (`imageUrls`, max 3), steps, tips, warnings.
6. **Add to workout** → localStorage session; **Report an issue** → `POST /api/issues`.

## Workout tracker

- **Strength** (non-cardio categories): sets with required reps + optional weight (kg).
- **Cardio** (`category` case-insensitive `"cardio"`): minutes + seconds, optional distance (km).
- **Save**: writes history, clears in-progress, opens Progress.
- **Finish** / **Clear**: discard without saving.
- In-progress survives refresh.

## localStorage keys

Keyed by gym slug (`ymca-quebec`). No member account.

| Key | Contents |
|-----|----------|
| `ymca-quebec-workout:v1:<slug>` | In-progress session JSON |
| `ymca-quebec-workout-history:v1:<slug>` | Array of saved workouts (newest first) |

Clearing site data resets progress — intentional for the demo.

## Progress

Per machine used in saved history: times used, last used, strength volume hints or cardio durations, short recent history. Empty until at least one **Save**.
