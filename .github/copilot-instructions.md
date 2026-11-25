## 1. Preserve behavior
- This is a static HTML/CSS/JavaScript redesign. Keep every route, feature, data source, storage key, guest mode, demo-profile behavior, and existing interaction.
- Do not change app.js data or persistence without a presentation-only reason. Use existing handlers and state.

## 2. CSS architecture
- Use a single container, 12-column grid, and label/content rows. Delete legacy layout CSS.
- Layout only with grid/flex and gap. Border-box globally. No fixed heights, negative margins, 100vw, absolute/fixed layout, or rounded nested surfaces.
- Header, every page, ICE band, and footer use the same 1200px container with 32px padding (20px below 600px).

## 3. Visual direction
- Route: warm editorial, calm blue-led public-service design with Instrument Serif display type and Inter UI type.
- Colors: navy-950 #08142E, ink #0A1A3A, text-2 #3F5170, text-3 #5A6A86, blue existing primary, blue-300 #8FAEFF, paper #F7F8FA, white #FFFFFF, line #E3E8F0, dark line rgba(255,255,255,.18), input line #8593A8.
- No generic cards, hero cards, equal-card grids, chips, gradients, emoji, drop shadows, or decorative illustrations.
- Keep the Imminent logo and wordmark, exactly three header elements, ICE band content and footer structure, and all existing copy.

## 11. QA and commits
- Run `node --check app.js`, start a local server, and use Playwright or browser screenshots at 320, 390, 768, 1024, 1440, and 1920px.
- Verify no horizontal overflow, clipping, unintended overlap, header/footer edge alignment, centered header brand, console/network failures, or broken images.
- Commit after each execution step with `visual:` or `qa:` prefixes.

## 1. Diagnosis
- Pages load only `design-system.css` and `app.js`; ten HTML shells reference the same repository assets and no stale duplicate or build-output copy exists.
- Profile form misalignment came from the old `.profile-layout` two-column layout and sibling-specific spacing, not missing storage.
- The menu gap and internal scrollbar came from the legacy fixed drawer/nav and a separate absolutely positioned backdrop, plus retained `.nav-more-items` disclosure markup.
- The Language Learning footer became flush-left because it was outside `.wrap` and relied on legacy `.foot` sizing.
- The quiz overlap came from fixed/sidebar lesson grid rules and legacy absolutely positioned or overlapping `.lesson-panel`/`.quiz` styles.
