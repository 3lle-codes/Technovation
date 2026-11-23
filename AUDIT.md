# Phase 0 audit

## Scope and routes
- The app is a set of static HTML entry points at `index.html`, `journey.html`, `timeline.html`, `immigration.html`, `ice.html`, `language.html`, `pronunciation.html`, `communities.html`, `community-circle.html`, and `profile.html`. Each page mounts the shared JavaScript renderer into `#app`.
- Shared application code is in `app.js`; the presentation system is in `design-system.css`.
- Routing is document-to-page mapping plus hash navigation in `app.js:405-410`. Existing destinations are Home, My Journey, My Timeline, Immigration Support, ICE information, Language Learning, Communities, Community Circle, and Profile.
- Language, personalization, and browsing subpages are stateful JavaScript views rather than separate URLs. Existing pages remain reachable.

## Data and content
- Resources are defined in `RES` at `app.js:1-13` and in `JOURNEY_RESOURCES` at `app.js:127-149`. Resource fields include id, source category, organization/source, title, description, and URL.
- Journey data is defined in `JOURNEY` at `app.js:150-177`. It contains six stages: Getting Started; Documents and Legal Support; Housing and Daily Life; Education; Employment; Building a Community.
- Tasks include title, what/why/how/needs, estimated time, resources, related-task ids, and optional obstacle/vocabulary/phrase data. Personal tasks are user-created in the existing journey view.
- Lessons are defined in `LS` at `app.js:14-25`, levels in `LV`, lesson situations in `CX`, and pronunciation uses those lesson phrases. Lesson fields include title, phrase, prompt, choices, answer index, explanation, vocabulary, and broader explanation. No quiz timer or server-side scoring exists.
- Community data is browser-created; the existing categories, cultures, languages, forum topics, post fields, and filters are declared in `app.js:20-115` and rendered in `app.js:329-348`.
- Profile fields are display name, preferred language, county, and English level. Saved resources and completed lesson counts are derived from existing state.
- The data wins on My Timeline: it is a personalization view built from `PLAN`, goals, location, English level, and completion state, not a duplicate of My Journey.

## Storage and persistence
- Existing local-storage key `imminent` and legacy read key `immily` hold the persisted preferences object under `p` (`app.js:82-84`, `app.js:86-87`). Persisted fields include language, goal, level, lesson completion, task completion, saved resources, county, journey state, custom tasks, and local-resource search fields.
- Demo profile state is written only to session storage key `imminent-profile` (`app.js:85-87`, `app.js:92-94`). The demo profile writes name and preferred language, while broad county and level remain in local storage through the profile form.
- Community Circle posts are persisted in IndexedDB database `imminent-community`, object store `posts` (`app.js:95-105`). Posts are local to one browser and not a shared server-backed community.
- Microphone recordings are session/browser audio state rather than a server upload. Storage availability is surfaced through `storageIssue` and `S.storageIssue`.

## Current visual system
- `:root` in `design-system.css:1-23` is warm/cool mixed: warm near-white canvas `#fcfaf8`, white surfaces, blue primary around `#3066ce`, strong blue `#090c96`, pale blue surfaces, sage success, and soft shadows.
- Typography is `Inter` plus broad CJK/fallback stacks. Several sizes are clamp/rem or ad hoc, and repeated media overrides are spread through `design-system.css:101-1255`.
- `--content-width` is 72rem/1152px, close to the requested 1200px container but implemented with varying main widths.
- The site uses repeated card, eyebrow, stage, task, and alert patterns. It has warm tones and nested surfaces that conflict with the requested quiet cool-white/public-service design.

## Technical and accessibility findings
- Header rendering is in `app.js:383-404`. The brand uses absolute centering and an image tile plus a lowercase `imminent` wordmark, contrary to the brand and exact-header requirements.
- The current menu uses native drawer markup plus JavaScript/focus trapping, but native `<details>` is used for “More.” It is reachable, though it needs the approved accessible button/panel treatment.
- Page content is almost entirely JavaScript-generated. The HTML shell is valid but has no server-rendered page content.
- Repeated inline styles occur in `app.js` and 5 CSS `!important` declarations are present. The audit count found 29 inline-style occurrences across JS/HTML/CSS.
- Fixed or sticky controls include the header, drawer, and menu backdrop. Mobile breakpoints use 1120/760/420px and some fixed drawer widths.
- Numerous cards are nested and bordered in journey resources, local-search results, lessons, and profile. Native `details` triangles conflict with the disclosure treatment.
- Main landmarks and a skip link exist. The menu has `aria-expanded`, `aria-controls`, and Escape/tab handling. Focus moving after close is implemented.
- Visible text and status are not fully consistent: many uppercase/small eyebrows, percent progress, boxed notices, and `imminent` lowercase branding remain.
- Contrast must be checked after tokenization; current pale blue borders and muted text need pair verification.
- Mobile layouts exist but have not been systematically checked at 320/390/768/1024/1440 or in every language. Automated browser QA remains a Phase 7 task.

## Feature status
- Complete: route navigation, journey task state, skip/add-back, target date and notes, personal tasks, resource saving, lesson selection, quizzes, forum post creation, demo profile, local searches, language switching, and existing external links.
- Partial: profile “session”/clear wording is contradictory; local-resource search is external/unverified; Community Circle is browser-local rather than shared; saved-resource count and learning progress are derived; pronunciation records are browser-session audio.
- Placeholder/honest-empty: unavailable live-provider data is explicitly described where used. No new fact or provider data is added.
