# Security Policy

## Reporting a vulnerability

This repository contains learning projects, not a managed production service. If
you find a security issue, open a private report through the repository host
rather than publishing exploit details in a public issue.

## Credential hygiene

Several project files previously contained example or real credentials in tracked
files. Those files have been removed or replaced with placeholders, but removing a
value from the current commit does not remove it from Git history.

If you have ever committed any of the following, rotate the credential before
using the project:

- the OMDB API key that was stored in `5-movie browser/frontend/.env`,
- the Cloudinary cloud name, API key and secret that appeared in the Blog
  Platform environment example,
- any administrator password used by the Blog seed script,
- any JWT secret copied from an example file.

## Environment files

- Commit only `.env.example` files.
- Keep `.env` files untracked. The repository `.gitignore` excludes them.
- Use a unique, long random value for every `JWT_SECRET`.
- Use a password manager or a secret store for deployed environments.
- Never reuse the example administrator password.

## Authentication notes

- Passwords are hashed with bcrypt in every project that stores accounts.
- JWT secrets are required at startup; the services no longer fall back to a
  hardcoded default.
- The projects use long-lived access tokens and do not implement refresh-token
  rotation. This is documented in each project's limitations section.
- Projects that identify anonymous visitors use a client id in localStorage. It
  is a device identifier, not authentication.

## Dependencies

Run `npm audit` inside each backend and frontend before deploying. The projects
pin their own dependency versions and are not maintained as a monorepo with a
shared lockfile.
