# Security

## Authentication

- bcrypt hashing with 12 rounds.
- Password field uses `select: false`.
- JWT in an HttpOnly, SameSite=Lax cookie, secure in production.
- Seven-day expiry and server-side logout.
- Login and registration rate limited per client.

## Authorization

- `requireUser` protects customer routes.
- `requireAdmin` protects every `/api/admin/*` and upload route.
- Orders are readable only by their owner or an admin.
- Admins can change order status but cannot read another customer's password.
- Admin UI redirects are convenience only; the API is the real check.

## Input and money handling

- Usernames, emails, passwords and slugs are validated.
- Prices are parsed, rounded and checked as non-negative.
- Captions, descriptions, addresses and review text are trimmed and length
  limited.
- Image URLs must be HTTPS or a local upload path.
- Checkout reloads products and recalculates every total server-side.
- Coupons are normalized and checked for active status, expiry and minimum order.

## Uploads

- Admin only.
- JPEG, PNG, WebP and GIF; 8 MB maximum.
- MIME type and magic-byte signature checked.
- Random filename; extension derived from the MIME type.
- No SVG uploads.

## Cross-site and injection

- SameSite=Lax cookie plus same-origin checks on auth and upload mutations.
- React escapes rendered user text; no `dangerouslySetInnerHTML`.
- Mongoose models and explicit request fields prevent raw query operator injection.
- Object ids are validated before product and order lookups.

## Secrets

- `.env.local` is ignored by Git.
- `.env.example` contains placeholders.
- `JWT_SECRET` has no fallback value.

## Known gaps

- No email verification, password reset or two-factor authentication.
- No audit log for admin changes.
- Rate limiting is process-local.
- Card payments are simulated; no PCI scope is handled here.
- A public deployment needs HTTPS, object storage, a shared rate-limit store and
  a content security policy at the reverse proxy.
