# MalinKiddy Backend

Express + TypeScript API for `api.malinkiddy.com`.

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `npm install`
3. Run development server:
   - `npm run dev`
4. Build and run production:
   - `npm run build`
   - `npm start`

## Seed Admin

- `npm run seed`

Default seed credentials:
- Admin Email: `developer@gmail.com`
- Admin Password: `password123`
- User Email: `thisemail@gmail.com` (Magic-Link Login, kein Passwort)

Change password immediately after first login.

## API Prefixes

- `/api/auth`
- `/api/play`
- `/api/upload`
- `/api/user`
- `/api/admin`
