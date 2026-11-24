# Contributing to 50 Full-Stack Projects

Thank you for considering a contribution. This repository is a collection of
learning and portfolio projects, and it gets better when other developers test
it, report what is confusing and improve the documentation.

## Good first contributions

You do not need to rewrite an application to help. Useful contributions include:

- Fixing a broken link or a setup command in a project README.
- Adding or correcting an `.env.example` file.
- Improving responsive layout on a specific screen size.
- Adding a missing loading, empty or error state.
- Writing a unit test for a validator or a small helper.
- Improving keyboard navigation or form labels.
- Reporting a bug with exact reproduction steps.
- Adding screenshots or a short demo recording to a project README.
- Reviewing a pull request and leaving constructive feedback.

Look for issues labelled `good first issue` or `documentation`. If an issue does
not exist for your idea, open one before starting a large change.

## Before you start

1. Read the root README and the README of the project you want to change.
2. Check open issues and pull requests so work is not duplicated.
3. For a small fix, open a pull request directly.
4. For a new feature or a large refactor, open an issue first and describe the
   scope, the affected files and how you plan to test it.

## Local setup

Each project has its own setup. Phase 1 projects are usually static HTML; Phase
2 projects have separate React and Express folders; Phase 3 projects use Next.js
and often MongoDB.

The general pattern is:

```bash
cd Phase-X/project-name
cat README.md
cp .env.example .env
npm install
npm run dev
```

Use the exact commands in the project README. If a command is wrong, that is a
documentation bug worth fixing.

## Branch and commit style

```text
feat/voltnest-product-compare
fix/lumen-private-post
docs/pinboard-api-example
test/chat-message-validation
```

Commit messages should describe the change:

```text
feat: add product comparison tray to VoltNest
fix: reject private post links for guests
docs: add coupon example to VoltNest API reference
test: cover invalid image URLs
```

## Pull request checklist

- The change is scoped to one project or one shared concern.
- The project still builds, or the README explains why a build is not possible.
- New behaviour is documented.
- New validation or business logic has at least one test where practical.
- No secrets, API keys, `.env` files or database dumps are committed.
- Screenshots are included for visible UI changes.
- The pull request description explains what changed, why, and how it was tested.
- Existing code style and folder conventions are respected.

Use the pull request template. Small pull requests are reviewed faster than large
ones.

## Code and documentation standards

- Use TypeScript for new Next.js work and keep types meaningful.
- Prefer small, readable functions over clever one-liners.
- Keep components and routes focused on one responsibility.
- Validate all user input on the server, not only in the browser.
- Never trust prices, roles or ownership sent by the client.
- Use environment variables for secrets; commit only examples.
- Write documentation in plain English without emojis.
- Update the project status table when a planned project becomes built.
- Do not describe unfinished features as complete.

## Reporting bugs

Include:

- project name and folder,
- operating system and Node.js version,
- exact commands,
- expected behaviour,
- actual behaviour,
- relevant logs with secrets removed,
- screenshots when the issue is visual.

Open a private security report for vulnerabilities instead of a public issue. See
[SECURITY.md](SECURITY.md).

## AI-assisted contributions

AI-assisted work is allowed. You are responsible for understanding the change,
testing it and being able to explain it in review. Do not submit generated code
that you have not run or reviewed.

## Review and response

Maintainers aim to respond to new issues and pull requests within a few days.
If a pull request becomes stale, a polite reminder is welcome. Contributions of
all sizes are credited in the project history.

## Code of conduct

Be direct, patient and respectful. Critique the code, not the person. Harassment,
personal attacks and discriminatory language are not welcome.
