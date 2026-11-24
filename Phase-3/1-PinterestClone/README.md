# Pinboard

A full-stack Pinterest alternative built with Next.js, Express and MongoDB.
It implements the Phase 3 promise for this project — pins, boards and image
upload — and adds the missing pieces a real Pinterest-style product needs:
public browsing, profiles, likes, saves, comments, notifications, search and a
vertical Reels feed.

The design goal is simple: keep the parts of Pinterest that work, remove the
parts that get in the way, and make the result usable without an account.

## What is implemented

### Discovery

- Masonry pin grid with responsive column counts.
- Pagination through a **Load more** action.
- Category filters with live counts.
- Public home feed for guests and a personalised Following feed for signed-in
  users.
- Explore page sorted by popularity.
- Search across pins, boards and people.
- Free images from **Picsum** with no API key and no registration.
- Related pins on every pin detail page.

### Pins

- Create a pin from an uploaded image, a URL, or the free image picker.
- Title, description, category, tags, source attribution and board selection.
- Like and unlike.
- Save and unsave.
- Save to a specific board, including a new board created inside the save dialog.
- Comments with author names and avatars.
- Share through the Web Share API with a clipboard fallback.
- Download the original image.
- View count.
- Owner can edit or delete a pin through API support.
- Video pins from a video URL, which appear in the Reels feed.

### Boards

- Create public or private boards.
- Add and remove pins.
- Board covers generated from saved pins.
- Board sharing.
- Owner-only delete.
- Private boards are hidden from other users and from guests.
- Profile board grid and dedicated board pages.

### Profiles and social

- Cover image, avatar, name, username, bio, website and location.
- Follow and unfollow.
- Followers and following lists in the API.
- Profile tabs: Pins, Boards and Saved.
- Real counts for pins, followers, following and total likes.
- Profile editing with image upload.
- Demo creators with seeded content.

### Notifications

- In-app notifications for likes, saves, comments and follows.
- Unread badge in the navigation bar.
- Dropdown preview and a full notifications page.
- Mark one or all as read.
- Polling every 30 seconds. No socket server is required for this project.

### Reels

- Vertical, snap-scrolling feed inspired by TikTok.
- Seeded public sample videos with poster images.
- Like, save and share actions on each reel.
- Link to the full pin and comment thread.
- Muted autoplay with a clear mute indicator.

### Engineering

- JWT authentication with bcrypt password hashing.
- Optional authentication for public routes, so guests can browse.
- Ownership checks for pins, boards, comments and profile updates.
- Multer image uploads served from `/uploads`.
- Consistent JSON errors and a global error middleware.
- Seed script that creates demo users, 35 pins, 5 boards and Reels.
- Responsive layout with mobile bottom navigation.
- Accessible labels and keyboard-friendly controls.
- No ads, no tracking pixels, no forced login to view content.

## How this improves on Pinterest

| Pinterest problem | This project |
| --- | --- |
| Login wall for browsing | Guests can view pins, boards, profiles, search and reels without an account |
| Ads and sponsored pins | No ads or sponsored content |
| Saving requires a board flow | Save to a board or save directly, with board creation inside the dialog |
| Hard to download an idea | Download button on every pin |
| Weak source attribution | Source name and source URL are stored and displayed |
| Private boards are mixed into the public profile | Private boards are hidden from other users |
| Endless algorithm-only home feed | Category browsing, search, Following feed and an Explore page |
| No free image source for new pins | Built-in Picsum picker with no key or registration |
| Cluttered mobile navigation | Dedicated mobile bottom navigation for Home, Explore, Reels, Saved and You |

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcrypt |
| Uploads | Multer, local disk storage |
| Images | Picsum, no API key |
| Video samples | MDN and test-videos.co.uk CC sample files |
| Tooling | ts-node, nodemon, ESLint |

## Architecture

```text
Next.js client (3000)
├── Public pages: home, explore, search, reels, pin detail, profiles, boards
├── Auth pages: login, register
├── Authenticated pages: create, saved, notifications, board management
├── AuthContext (JWT in localStorage)
└── Service layer (Axios)
        │
        ▼
Express API (5000)
├── /api/auth        register, login, me, profile, password
├── /api/pins        list, detail, create, edit, delete, like, save
├── /api/boards      create, list, detail, update, delete, add/remove pin
├── /api/users       profiles, follow, followers, following, search
├── /api/pins/:id/comments
├── /api/notifications
├── /api/search
├── /api/discover    categories and free images
├── /api/upload      Multer image upload
└── /uploads         served static files
        │
        ▼
MongoDB: users, pins, boards, comments, notifications
```

## Project structure

```text
1-PinterestClone/
├── backend/
│   ├── controllers/          auth, pin, board, user, comment, notification,
│   │                          search, discover
│   ├── middleware/           auth, optional auth, errors
│   ├── models/               User, Pin, Board, Comment, Notification
│   ├── routes/               API routes and upload route
│   ├── types/                Express request types
│   ├── utils/                db, seed, http helpers, notify, jwt
│   ├── uploads/              uploaded images (created at runtime)
│   ├── app.ts
│   └── server.ts
├── frontend/
│   ├── src/app/              App Router pages
│   ├── src/components/       pins, boards, comments, common UI
│   ├── src/context/          AuthContext
│   ├── src/lib/              share and download helpers
│   ├── src/services/         API service layer
│   ├── src/types/            shared TypeScript types
│   └── src/app/globals.css   design tokens and masonry styles
└── docs/
    ├── API.md
    └── PRODUCT.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB 6 or newer
- npm 9 or newer

### 1. Start MongoDB

```bash
mongod --dbpath /path/to/your/mongodb-data
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

The API starts on `http://localhost:5000`. On the first run it seeds demo users,
35 pins, 5 boards and 5 video reels.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

### Demo account

```text
Email:    curator@pinterest.local
Password: demo12345
```

Other seeded creators use the same password:
`maya@pinterest.local`, `noah@pinterest.local`, `aria@pinterest.local`,
`leo@pinterest.local`.

## Environment variables

### Backend

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | API port |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Token signing secret |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `PUBLIC_API_URL` | No | request host | Base URL used for uploaded image URLs |
| `CORS_ORIGINS` | No | `http://localhost:3000,http://localhost:5173` | Allowed frontend origins |

### Frontend

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000/api` | API base URL used by the browser |

## API summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account and return a token |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/auth/me` | Bearer | Current user |
| PUT | `/api/auth/me` | Bearer | Update profile |
| PUT | `/api/auth/me/password` | Bearer | Change password |
| GET | `/api/pins` | Optional | List, search or filter pins |
| GET | `/api/pins/:id` | Optional | Pin detail and related pins |
| POST | `/api/pins` | Bearer | Create a pin |
| PUT | `/api/pins/:id` | Bearer | Update own pin |
| DELETE | `/api/pins/:id` | Bearer | Delete own pin |
| PUT | `/api/pins/:id/like` | Bearer | Like |
| PUT | `/api/pins/:id/unlike` | Bearer | Unlike |
| PUT | `/api/pins/:id/save` | Bearer | Save to a board or directly |
| PUT | `/api/pins/:id/unsave` | Bearer | Remove save |
| GET | `/api/boards` | Optional | List public or own boards |
| POST | `/api/boards` | Bearer | Create a board |
| GET | `/api/boards/:id` | Optional | Board with pins |
| PUT | `/api/boards/:id` | Bearer | Update own board |
| DELETE | `/api/boards/:id` | Bearer | Delete own board |
| POST | `/api/boards/:id/pins` | Bearer | Add a pin |
| DELETE | `/api/boards/:id/pins/:pinId` | Bearer | Remove a pin |
| GET | `/api/users/:id/profile` | Optional | Profile, pins, boards and saved pins |
| PUT | `/api/users/:id/follow` | Bearer | Follow |
| PUT | `/api/users/:id/unfollow` | Bearer | Unfollow |
| GET | `/api/users/search?q=` | Optional | Search people |
| GET | `/api/pins/:id/comments` | Optional | List comments |
| POST | `/api/pins/:id/comments` | Bearer | Add a comment |
| DELETE | `/api/comments/:id` | Bearer | Delete own comment |
| GET | `/api/notifications` | Bearer | Notifications and unread count |
| PUT | `/api/notifications/:id/read` | Bearer | Mark one as read |
| PUT | `/api/notifications/read-all` | Bearer | Mark all as read |
| GET | `/api/search?q=` | Optional | Search pins, boards and people |
| GET | `/api/discover/categories` | No | Categories and counts |
| GET | `/api/discover/images?q=` | No | Free Picsum images |
| POST | `/api/upload` | Bearer | Upload an image, returns a URL |
| GET | `/api/health` | No | Health check |

Full request and response examples: [docs/API.md](docs/API.md).

## Data model

### User

`username` (unique), `name`, `email` (unique), `password` (hashed, excluded),
`bio`, `avatar`, `cover`, `website`, `location`, `role`, `followers`,
`following`, timestamps.

### Pin

`title`, `description`, `imageUrl`, `videoUrl`, `posterUrl`, `type`
(`image` or `video`), `sourceName`, `sourceUrl`, `category`, `tags`,
`createdBy`, `board`, `likes`, `saves`, `commentsCount`, `views`, `width`,
`height`, timestamps.

### Board

`name`, `description`, `cover`, `isSecret`, `createdBy`, `pins`, timestamps.

### Comment

`text`, `user`, `pin`, timestamps.

### Notification

`recipient`, `actor`, `type` (`like`, `save`, `comment`, `follow`), `pin`,
`board`, `read`, timestamps.

## Scripts

### Backend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with nodemon and ts-node |
| `npm start` | Start with ts-node |
| `npm run build` | Compile TypeScript to `dist` |
| `npm run typecheck` | Type-check without emitting |

### Frontend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Verification performed

- Backend `tsc --noEmit`: pass.
- Frontend `next build`: pass, all 13 routes generated.
- API smoke test against MongoDB:
  - login, pins, categories, free images, search
  - profile, boards, create pin, like, save, comment
  - notifications from a second user, mark all read
  - image upload and static serving
- All frontend routes return HTTP 200 in production mode:
  `/`, `/explore`, `/reels`, `/search`, `/login`, `/register`, `/boards`,
  `/create-pin`, `/saved`, `/notifications`, `/pin/[id]`, `/profile/[id]`.

## Known limitations

- Email verification and password reset are not implemented.
- Notifications use polling, not WebSockets.
- Uploaded images are stored on local disk. A multi-instance deployment needs
  object storage.
- Seed images use Picsum and are randomised; they are demo content, not curated
  recommendations.
- Reels use public sample videos for demonstration, plus any video URL a user
  posts. Direct video file upload is not implemented; replace the samples with
  licensed content before production use.
- There is no moderation queue, report workflow or spam detection.
- Comments are not paginated.
- There is no mobile app.

## Roadmap

- Refresh tokens and logout-all-sessions.
- Real-time notifications with Socket.IO or SSE.
- Object storage and image resizing for uploads.
- Moderation and reporting.
- Password reset and email verification.
- Comment pagination and mentions.
- Full keyboard navigation for the masonry grid.
- PWA support and offline saved pins.

## Security notes

- Passwords are hashed with bcrypt using 12 rounds.
- JWT secrets are required at startup; there is no fallback secret.
- Owners are checked before edits and deletes.
- Private boards are filtered on the server.
- Uploads are restricted to image MIME types and 8 MB.
- The demo credentials are for local development only. Change or remove the
  seeded accounts before deploying.

## License

MIT
