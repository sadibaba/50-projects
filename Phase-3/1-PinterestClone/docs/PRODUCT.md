# Product Notes

This document explains the product decisions behind Pinboard, the gaps found in
Pinterest, and what the current build does about them.

## The core problem

Pinterest is excellent at visual discovery, but the product adds friction around
the edges:

- A login wall appears before a new visitor can browse.
- The home feed is driven by an opaque recommendation system.
- Saving an image often has a multi-step board workflow.
- Downloading an idea is not a first-class action.
- Source attribution is inconsistent.
- Ads and sponsored content mix with organic ideas.
- Private boards are not always clearly separated from public profile data.

Pinboard is a smaller, clearer product that keeps discovery, boards and profiles
and removes as much of that friction as possible.

## What was built

### Public-first browsing

Guests can open the home feed, explore categories, search, open pin details,
view profiles, view boards and scroll Reels. Authentication is optional on the
API (`optionalAuth`) and is only required for writing actions.

### Saving that fits the moment

The save dialog lists the user's boards, allows creating a board inside the
dialog, and also supports saving without a board. Unsaving removes the pin from
the user's boards so the state stays consistent.

### Free image source

The create flow includes a Picsum picker. It needs no API key and no account,
which removes the most common blocker for a new pin: "where do I get an image?"

### Uploads

Users can upload their own image through Multer. The backend limits uploads to
images and 8 MB, stores them on disk and serves them from `/uploads`.

### Profiles

Profiles show a cover image, avatar, bio, website and location, plus real counts
for pins, followers, following and likes. Owners can upload a new avatar and
cover directly from the edit dialog.

### Boards

Boards have covers, descriptions and an optional private flag. Private boards
are filtered on the server for anyone except the owner.

### Notifications

Likes, saves, comments and follows create notifications. The navigation bar
shows an unread count and a preview; the notifications page shows the full list
and supports marking everything as read.

### Reels

The Reels page is a vertical, snap-scrolling feed with autoplaying muted video,
like, save and share actions. This is the TikTok-style surface that Pinterest
users often ask for.

### Search

Search covers pins, boards and people. Results are split into tabs so the user
can choose the kind of result they want.

## Comparison with Pinterest

| Area | Pinterest | Pinboard |
| --- | --- | --- |
| Guest browsing | Limited and interrupted by sign-up prompts | Full public browsing |
| Ads | Present | None |
| Saving | Board-first workflow | Board or direct save, with inline board creation |
| Download | Not a primary action | Dedicated download button |
| Source credit | Inconsistent | Stored and displayed |
| Private boards | Available | Available and server-filtered |
| Home feed | Algorithm-first | Category, search, Following and Explore |
| Free image source | Not built in | Picsum picker |
| Mobile navigation | Dense | Focused bottom navigation |
| Reels | Separate surface | Built into the same app |

## Current scope and honest limits

The project is a learning build, not a production social network. The following
are intentionally out of scope for this iteration:

- email verification and password reset,
- content moderation and reporting,
- real-time notifications (the client polls every 30 seconds),
- object storage and image resizing,
- recommendation ranking,
- comment pagination,
- a native mobile app.

These are listed in the main README roadmap rather than presented as complete.

## Success criteria for this phase

- A guest can browse and open a pin without signing in.
- A signed-in user can create a pin from an upload, a URL or a free image.
- A user can save a pin to an existing or new board.
- Likes, comments and follows create notifications for the recipient.
- A profile shows real pins, boards, saved pins, followers and likes.
- Search returns pins, boards and people.
- Reels play vertical video with working actions.
- Both the API and the Next.js client build and run.
