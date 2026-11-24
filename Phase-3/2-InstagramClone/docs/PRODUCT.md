# Product Notes

Lumen is an Instagram alternative, not a pixel-for-pixel copy. The goal is to
keep the useful parts of the product and remove the friction.

## Design principles

1. Browsing should not require an account.
2. The feed should be chronological and understandable.
3. Ads and sponsored posts should not exist.
4. A post should be editable and downloadable.
5. Private content must be private on the server.
6. Accessibility should be part of publishing, not an afterthought.
7. The interface should stay calm and readable.

## Instagram problems addressed

| Problem | Lumen response |
| --- | --- |
| Login wall | Public home, explore, post, profile and reel pages |
| Ads and sponsored posts | No ads |
| Algorithmic feed | Following and For you feeds, both chronological |
| Suggested posts mixed into the feed | Kept in Explore and the suggestions rail |
| Hard to save and revisit | Save/unsave plus a private Saved page |
| Download friction | Download button on every post |
| Alt text is buried | Caption or alt text required when publishing |
| Private post link leaks | API-level private access checks |
| Limited editing | Caption, alt text and location editing |
| Tracking-heavy experience | No third-party trackers |
| Dense mobile navigation | Five-item bottom navigation |

## Core loops

### Discover

Guest or member opens the feed, browses Explore, searches, opens a post, opens a
profile, or watches Reels.

### Create

Member uploads an image, writes a caption, adds alt text, tags and location, then
publishes. A video URL turns the post into a Reel.

### Connect

Member follows a creator and receives notifications for likes, comments, saves
and new followers.

## Scope boundaries

The following are deliberately not part of this build:

- direct messages,
- live video,
- shopping and checkout,
- recommendation ranking,
- email notifications,
- content moderation,
- native apps.

These are documented in the README roadmap rather than presented as complete.

## Success criteria

- A guest can browse every public surface.
- A member can register, log in, post, like, comment, save, follow and receive
  notifications.
- A private account is enforced by the API.
- The project builds with TypeScript and passes its unit tests.
- The API and pages work against the seeded MongoDB data.
