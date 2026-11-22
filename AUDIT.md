# Phase 0 audit

## Inventory

The application is a static set of ten HTML routes. Each HTML file contains an application shell and loads `app.js`; page content is rendered by JavaScript. Without JavaScript, the pages show only an empty `#app` element.

| Route | File | `data-page` | Existing purpose |
| --- | --- | --- | --- |
| Home | `index.html` | `home` | Next journey task, progress, and support destinations |
| My Timeline | `timeline.html` | `timeline` | Personalized starting plan based on goal, English level, county, and completed plan steps |
| My Journey | `journey.html` | `journey` | Six-stage task journey, status, notes, dates, personal tasks, and local-resource search |
| Immigration Support | `immigration.html` | `imm` | Searchable immigration and work/learning resources |
| ICE information | `ice.html` | `ice` | Official ICE/USCIS links and independent rights/legal-help resources |
| Language Learning | `language.html` | `lang` | English levels, situations, phrases, quick checks, and lesson progress |
| Pronunciation Studio | `pronunciation.html` | `pron` | Speech synthesis/listening and browser audio recording |
| Communities | `communities.html` | `com` | External map/search launcher for cultural places and events |
| Community Circle | `community-circle.html` | `circle` | Browser-only discussions, filters, PII warning, and posting |
| Log In / Profile | `profile.html` | `acc` | Demo profile, preferences, saved resources, and learning progress |

`My Timeline` is distinct from `My Journey`: it is a separate four-area personalized starting plan (`PLAN`) in `app.js:92-135`, while `My Journey` is the real 27-task stage and task model in `app.js:155-194`. Both must remain reachable.

Preserved interactions include:

- Menu open/close, Escape close, scrim close, navigation, language switching, and skip link.
- Timeline goal/level/county updates and timeline step completion.
- Journey task open/close via `details`, status changes, target dates, personal notes, skip/restore, related-task links, personal-task creation, and local-resource search.
- Immigration search/category filtering and saved resources.
- Language level/situation selection, quick checks, lesson completion, phrase audio, pronunciation recording, and pronunciation subnavigation.
- Communities location/category updates and external searches.
- Community Circle filters, compose, PII filtering, publication, and profile sign-out.

The data model in `app.js:1-194` includes:

- 7 immigration/work resource records (`RES`) with id, section, organization, title, description, and URL.
- 9 journey resources in `JOURNEY_RESOURCES`, with name, kind, URL, and detail.
- 6 journey stages and 27 active tasks: Getting Started (4), Documents and Legal Support (4), Housing and Daily Life (5), Education (4), Employment (5), Building a Community (5).
- Every journey task has id, title, what, why, how, needs, estimated time, resource ids, related ids, and optional obstacle/vocabulary/phrase mappings.
- 6 English levels (`A1` through `C2`), 7 lesson categories plus 8 lesson categories represented in `LS`, and 6 lessons per category in several cases. Lesson records contain title, phrase, question, choices, answer, explanation, vocabulary, and why-it-works copy.
- 5 culture values, 6 profile language values, 10 community topic values, and browser-only forum post fields.

## Storage

The app has no authentication or server.

- `localStorage["imminent"]` stores language, goal, level, timeline completions, lesson progress, saved resources, county, journey statuses/notes/dates, custom tasks, and local-resource search preferences. Legacy key `immily` is read once for migration.
- `sessionStorage["imminent-profile"]` stores only display name and preferred language.
- IndexedDB database `imminent-community`, object store `posts`, stores Community Circle posts in the current browser/profile origin.
- Speech recordings are temporary `Blob` URLs and are not the persisted profile model.
- Clearing browser data removes local and session storage and IndexedDB posts. Community posts are not shared across devices or other browser profiles.

The existing Profile copy is inconsistent with implementation and must be reconciled: it says “nothing here is stored permanently,” while journey/local progress and saved resources are stored in localStorage and forum posts are stored in IndexedDB. Browser-only storage is persistent until removed, but it is not permanent across devices or browser-data clearing.

## Baseline visual audit

The baseline is a warm off-white canvas `#fcfaf8`, matching `meta[name="theme-color"]` in all ten routes. The existing CSS has multiple generations of competing component definitions. `design-system.css:1-769` defines an initial system, `:787-1117` adds a civic-editorial system, and `:1119-1255` overrides it again for the current centered-header/drawer direction. Near-duplicate and contradictory selectors are present for `.brand`, `.side`, `.menu-toggle`, `.profile-toggle`, `.btn`, `.card`, `.task`, `.bar`, and responsive breakpoints.

Observed baseline values:

- Text: `#15254a`; secondary `#607191`; primary blue `#3066ce`; deep blue `#1648bb` / `#090c96`.
- Surfaces: warm canvas `#fcfaf8`; white `#fff`; blue tint `#f5f8ff`.
- Borders: `#dce6f6`, `#b4c5e4`, and multiple near-duplicates.
- Existing radii range from 2px to 16px; buttons and panels lack one consistent shape.
- Inter is loaded, with CSS fallbacks for Noto Sans KR/SC and CJK fonts.
- Desktop header height is 72px; mobile target height is 44px at the observed baseline widths.
- The brand is currently an image plus visible lowercase text `imminent`, not the required capitalized typeset wordmark.
- The language selector is currently in the main area on every page, contrary to the target drawer placement.
- The baseline baseline home screenshot at 1440px is clean enough at the shell level, but keeps the branded hero copy, repeated progress percentage, three-column icon grid, uppercase eyebrow, and “Also available” line reported in the brief.

Measured with the local rendered site at 320, 375, 768, 1024, 1440, and 1920 viewport widths:

- Header brand center remains near the viewport center in the three-column header, but the implementation has offsets and duplicate CSS rather than a stable shared contract.
- At 320px, the rendered brand and Log In/Menu controls remain visually three-part, but the language row consumes a separate block.
- No horizontal page overflow was measured in the baseline home viewport probes.
- The baseline is not a valid mobile drawer model: at this branch it opens a left drawer with a close control and transforms, but existing desktop/civic overrides still make more navigation behavior than the target brief.

## Confirmed/partly confirmed/not confirmed

- **Confirmed:** 6 stages and 27 tasks match the data and task counts. Storage is browser-only with a mix of localStorage, sessionStorage, and IndexedDB.
- **Confirmed:** Header composition is currently Menu, a small illustrated mark/lowercase wordmark, and Log In; the wordmark is approximately centered.
- **Confirmed:** Language selector is in a separate row above page content.
- **Confirmed:** Home has the eyebrow, repeated “footing” copy, next-task block, 0% progress, three support columns, Personalize link, ICE/Circle “Also available” line, and prototype footer.
- **Confirmed:** Journey has the repeated intro, large 0% progress panel, privacy notice, native `<details>`, task metadata, local-resource finder, and 27 active tasks.
- **Confirmed:** Immigration, Communities, Profile, Language Learning, and Community Circle contain the features described in the brief, with Profile copy and Community Circle storage needing reconciliation.
- **Confirmed:** My Timeline is separate personalized plan data, not a duplicate of My Journey.
- **Partly:** Drawer/More disclosure exists, but not with the final grouped structure or language-in-drawer behavior.
- **Partly:** Native task disclosures are usable but will need a shared button/panel implementation for consistent spacing and semantics.
- **Not confirmed until post-edit QA:** mobile behavior in every page/state and full contrast status across the final token set.

## Phase 1-5 QA update

- All ten routes render at 320px and 1440px without document horizontal overflow.
- The first implementation pass removes the separate language row and places language choices in the drawer.
- The 320px header keeps Menu, `Imminent`, and `Log In` in one 56px-tall three-zone row; the brand remains centered while the outer controls change.
- The drawer opens with a scrim, lists language and grouped destinations, and focuses the Close control when opened.
- `My Journey` renders all 6 stages and 27 task rows. The first task can expand and the task metadata now separates status and estimated time without repeating the stage name.
- Immigration filtering shows 2 of 7 work/learning resources when “Work and learning” is selected.
- Browser-only storage wording is consistent: demo profile/session profile, local progress/saved resources, and IndexedDB posts remain in the browser and disappear when browser data or the profile session is cleared.
- Journey disclosure QA found that the task-status/skip actions rerendered the page and collapsed open task details. The current fix carries all open task IDs across rerenders; browser checks confirmed open tasks stay open through status changes and skip/restore.
