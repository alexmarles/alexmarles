# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build production site to ./dist/
pnpm preview    # Preview production build locally
```

## Architecture

Personal portfolio site built with **Astro** (static generation) + **React** (interactive islands) + **Firebase** (dynamic data).

### Key architectural patterns

**Astro islands**: Most components are `.astro` (server-rendered), but `Greeting.jsx` and `Inbox.jsx` are React components hydrated client-side via `client:load`. These two components stay in sync through `chooseGreetingOption.ts`, which picks a random greeting and caches it in `window.sharedContentIndex`.

**Custom HTML elements**: Dynamic content uses native custom elements rather than React:
- `<astro-right-now>` (`src/scripts/getActivities.ts`) — fetches books/videogames from Firestore, caches results in `sessionStorage`
- `<astro-lost-gif>` (`src/pages/404.astro`) — shows a random Giphy GIF on the 404 page

**Google Analytics via Partytown**: GA scripts run in a web worker (off main thread). The `astro.config.mjs` forwards `dataLayer.push` events from the main thread to Partytown. Route-change page view events are fired manually in `Layout.astro` using Astro's `ClientRouter`.

**Firebase**: Initialized in `src/firebase/client.ts` using `PUBLIC_*` env vars. Only Firestore is used at runtime (for the "now" page activities). The `activities` collection has documents with fields: `type` (book/videogame), `title`, `author`/`platform`.

### Environment variables

All variables are prefixed `PUBLIC_` (Astro convention for client-accessible vars). Types are declared in `src/env.d.ts`. Required vars: Firebase config (`PUBLIC_FIREBASE_*`) and `PUBLIC_GA_ID`.

## Git workflow

- Always branch off the most updated `dev` branch for any new work.
- All PRs target `dev`, never `main`.
- After a PR is merged, delete both the local and remote branches.
- To merge `dev` into `main`, open a PR.
- After every PR is merged into `main`, sync `dev` with `main` (`git checkout dev && git merge origin/main && git push origin dev`).
- Never merge PRs automatically. After opening a PR, share the GitHub PR link and the Netlify deploy preview URL from the PR comments.
