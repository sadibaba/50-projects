# Pinboard Frontend

Next.js 16 App Router client for Pinboard. See the [project README](../README.md)
for product notes, API documentation and backend setup.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

## Configuration

Create `.env.local` from `.env.example` and set:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home feed, categories and guest hero |
| `/explore` | Public | Popular pins by category |
| `/reels` | Public | Vertical video feed |
| `/search` | Public | Pins, boards and people |
| `/pin/[id]` | Public | Pin details, comments and related pins |
| `/profile/[id]` | Public | Profile, pins, boards and saved pins |
| `/board/[id]` | Public or owner | Board detail |
| `/boards` | Public or owner | Boards overview |
| `/login`, `/register` | Public | Authentication |
| `/create-pin` | Authenticated | Create a pin |
| `/saved` | Authenticated | Saved pins |
| `/notifications` | Authenticated | Notification list |

## State

- `AuthContext` owns the JWT, current user and profile updates.
- Each page owns its data fetching and loading state.
- The Axios service layer adds the bearer token to requests.
- Toasts provide action feedback.
