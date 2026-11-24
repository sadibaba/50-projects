# Testing

## Automated checks

### Type checking

```bash
npx tsc --noEmit
```

Uses strict TypeScript. The project contains `.ts` and `.tsx` files only.

### Unit tests

```bash
npm test
```

The Node test runner covers validation helpers:

- username rules,
- email rules,
- password length,
- text cleaning,
- safe image URL rules,
- MongoDB object id checks.

### Production build

```bash
npm run build
```

This also type-checks the application and generates all routes.

### API smoke test

Start MongoDB and the app, then:

```bash
npm run smoke
```

The smoke script performs:

1. health check,
2. register a unique user,
3. list the public feed,
4. create a post,
5. like the post,
6. comment on the post,
7. search,
8. logout.

It uses `BASE_URL` if set, otherwise `http://localhost:3001`.

## Manual checklist

### Guest

- Open `/` without an account and confirm posts are visible.
- Open `/explore`, `/reels`, a post, and a profile.
- Confirm login and signup are offered but not forced.
- Confirm the private Saved page redirects to login.

### Account

- Register with a valid username, email and password.
- Try a duplicate username and a short password; confirm clear errors.
- Log in with the demo account.
- Change the password from Settings, log out and sign in with the new password.

### Posts

- Upload an image and publish a post.
- Try a non-image file and a file over 8 MB; confirm rejection.
- Add a video URL and confirm the post appears in Reels.
- Like, save, comment and download a post.
- Edit the caption, alt text and location as the owner.
- Delete the post as the owner.

### Social

- Follow and unfollow a creator.
- Confirm follower and following counts change.
- Open the followers and following lists.
- Like and comment on another user's post, then check their notifications.
- Mark all notifications as read.

### Privacy

- Enable private account in Settings.
- In a second browser, open the profile; confirm posts are hidden.
- Open a known post id from the private account; confirm a 404.
- Follow the account; confirm posts become visible.

### Stories and Reels

- Add a story and open the viewer.
- Confirm stories expire after 24 hours in the database.
- Open Reels, like, save and share a reel.

### Mobile

- At 390 px width, confirm the bottom navigation is visible.
- Confirm the feed, profile header, post detail and create form do not overflow.
- Confirm the story bar scrolls horizontally.

## Test data

The seed creates:

- 5 users,
- 12 image posts,
- 4 video reels,
- 4 stories,
- comments and likes.

Demo login: `demo@lumen.local` / `demo12345`.

## What is not covered

- No browser end-to-end test runner is included.
- No load test is included.
- No coverage report is generated.
- Database-backed integration tests are performed through the smoke script.
