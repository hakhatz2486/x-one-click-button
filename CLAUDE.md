# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-file Tampermonkey/Greasy Fork userscript (`x-one-click-button.user.js`) that adds one-click
account-action buttons (Block, Mute, Unfollow, Remove follower, "Not interested in this post") to
X (Twitter)'s web UI. It works by automating clicks through X's own menus and confirmation dialogs
rather than calling any API. There is no build system, package manager, linter, or test suite — the
entire project is the one `.user.js` file plus bilingual docs.

## Development workflow

There are no build/lint/test commands. Development means editing `x-one-click-button.user.js`
directly and verifying behavior manually in a browser:

1. Install a userscript manager (e.g. Tampermonkey) and load this file's contents (or point a local
   file/`@require` at it during development).
2. Reload `x.com` or `twitter.com` and exercise the three surfaces the script targets:
   - A timeline/detail post (`article[data-testid="tweet"]`) — Block/Mute buttons and the
     "Not interested" icon.
   - `/<user>/following` — the Unfollow button next to the native follow-state button.
   - `/<user>/followers` — Unfollow (removes a follower) and Block buttons.
3. Since X's DOM and menu wording change often, always re-verify against the live site after editing
   selectors or keyword lists — there is no automated way to catch breakage.

Releases are published to Greasy Fork (the `@downloadURL`/`@updateURL` metadata point there), not
GitHub Releases — this repo does not use git tags for versioning.

## Architecture

Everything lives inside one IIFE. The core pattern is: **find the native "..." menu button → open it →
find a menu item matching known keywords → click it → optionally click the confirmation dialog that
X shows.** This same `executeAction`/`executeCurrentMenuAction` flow is reused for every menu-driven
action (block, mute, unfollow-from-followers-list, remove-follower, not-interested).

- **`ACTION_CONFIG`** is the single source of truth per action: the Japanese/English keywords to match
  in `[role="menuitem"]` text, keywords that must be *excluded* (to avoid matching the inverse action,
  e.g. "Unblock" containing "Block"), whether X shows a `confirmationSheetConfirm` dialog for it, and
  the hover colors used by the injected buttons. Adding a new menu-driven action starts here.
- **`executeAction(menuBtn, actionType)`** clicks `menuBtn`, waits for a *newly opened* `[role="menu"]`
  via `waitForNewElement` (which diffs against elements already visible before the click, so stale
  menus from other open dropdowns are ignored), matches an item by keyword, and clicks it — then, if
  `needsConfirm`, waits for and clicks a newly-appeared `confirmationSheetConfirm` button.
- **`executeUnfollowButton`** is the one action that bypasses the menu flow entirely: the "Following"
  list page exposes a native unfollow button directly (`button[data-testid$="-unfollow"]`), so this
  just clicks it and confirms.
- **Button creation** has two variants sharing the same click/disable/success/failure lifecycle logic:
  `createActionButton` (bordered pill button with text, used for Block/Mute/Unfollow) and
  `createIconActionButton` (circular icon-only button styled to match X's native reply/like/share
  icons, currently used only for "Not interested"). Both mark themselves `custom-btn-<actionType>` and
  the global `actionInProgress` flag plus a `document.querySelectorAll('button[class^="custom-btn-"]')`
  disable-all-during-action guard is shared across variants to prevent concurrent actions.
- **`addActionButtons()`** is the injection entry point, called on initial load and re-scheduled (via
  `requestAnimationFrame`, deduped by `addButtonsScheduled`) whenever a `MutationObserver` on
  `document.body` sees added nodes. It has two independent sections:
  1. Tweets: finds `article[data-testid="tweet"]` not yet marked `data-custom-action-added`, inserts
     Block/Mute before the tweet's caret button, then places the "Not interested" icon via
     `placeNotInterestedButton`, which locates the tweet's Grok-actions button by `aria-label`
     containing "grok" and inserts the icon into the DOM branch immediately before it (falling back to
     right before Mute if no Grok button is found — X does not always render one).
  2. Follow/follower list cells (`[data-testid="UserCell"]`): behavior branches on
     `location.pathname` (`following` vs `followers` vs other list pages), since the "following" list
     has a different native control than everywhere else, and existing buttons from a prior SPA
     navigation must be detected and swapped when the page type changes without a full reload.
- The `data-custom-action-added` attribute is the reprocessing guard (per tweet/cell) and also doubles
  as the marker `createActionButton`/`createIconActionButton` walk up to when fading out the
  completed container on success.

## Docs conventions

`README.md`/`CHANGELOG.md` (English) and `README-ja.md`/`CHANGELOG-ja.md` (Japanese) are maintained in
parallel — check both when documenting a user-facing change, but confirm with the user which language(s)
they want updated before editing, since English and Japanese docs have been intentionally updated
independently before.
