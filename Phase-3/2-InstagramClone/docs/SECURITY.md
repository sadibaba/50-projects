# Security

## Threat model

The application protects user accounts, private posts and uploaded files from:

- credential stuffing and brute-force login attempts,
- cross-site request forgery,
- cross-site scripting through captions, comments and profile fields,
- NoSQL operator injection,
- unauthorized edits and deletes,
- private content leaking through direct links or search,
- malicious file uploads,
- path traversal in uploaded filenames,
- secret leakage through client bundles.

## Controls

### Passwords

- bcrypt with 12 rounds.
- Password field uses `select: false` so it is not returned by normal queries.
- Passwords are never logged or sent to the client.
- Password changes require the current password.

### Sessions

- JWT signed with `JWT_SECRET`; the server refuses to start the app without it
  through the seed and runtime environment checks.
- Token stored in an HttpOnly cookie.
- `SameSite=Lax`, `Secure` in production, seven-day maximum age.
- Logout expires the cookie.
- No token is stored in `localStorage`.

### CSRF

- Session cookie is `SameSite=Lax`.
- Auth and upload mutations call `assertSameOrigin`, which compares the
  `Origin` header with `NEXT_PUBLIC_APP_URL` and the request host.
- Requests without an Origin header are allowed for local tooling and tests; a
  production proxy should enforce the header.

### Input validation

- Username, email and password rules in `lib/validators.ts`.
- Object ids checked before database queries.
- Captions, comments, bios and locations are trimmed and length-limited.
- Image and video URLs restricted to HTTPS or `/uploads/...`.
- Tags are normalized, de-duplicated and capped.

### NoSQL injection

Mongoose casts query values and the API never passes raw request bodies directly
into query operators. Body fields are selected explicitly.

### XSS

- React escapes text content.
- No `dangerouslySetInnerHTML` is used.
- Captions and comments render as text, not HTML.
- Uploaded SVG is not allowed.

### Uploads

- Authentication required.
- JPEG, PNG, WebP and GIF only.
- 8 MB limit.
- MIME type and magic-byte signature checked.
- Random filename generated with `crypto.randomBytes`.
- Extension derived from the MIME type, not the original filename.
- Served from `public/uploads`; directory traversal is not possible through the
  generated name.

### Privacy

- Private accounts are enforced in list queries and in `lib/privacy.ts`.
- Direct post links return `404` for non-followers of a private account.
- Comments and likes use the same visibility check.
- `savedPosts` are only returned to the owner.
- The API never exposes email addresses on public profiles.

### Rate limiting

In-memory limits:

| Action | Limit |
| --- | --- |
| Registration | 8 per minute per client |
| Login | 12 per minute per client |
| Password change | 6 per minute per client |

This is suitable for a single instance. Multi-instance deployment needs a shared
store such as Redis.

## Secrets

- `.env.local` is ignored by Git.
- `.env.example` contains placeholders only.
- `JWT_SECRET` has no fallback.
- The demo accounts are for local development and should be removed or have
  their passwords changed before deployment.

## Dependency and deployment notes

- Run `npm audit` before deploying.
- Serve over HTTPS so the `Secure` cookie flag is active.
- Use a reverse proxy that sets `X-Forwarded-Proto` and `X-Forwarded-For`.
- Replace local uploads with object storage and a virus scanner for a public
  deployment.
- Add a Content Security Policy at the reverse proxy or in `next.config.ts`.
- Add moderation and reporting before opening registration to the public.

## Known gaps

- No email verification or password-reset email.
- No two-factor authentication.
- No refresh-token rotation.
- No audit log for administrative actions.
- No report or moderation queue.
- Rate limits reset when the process restarts.
