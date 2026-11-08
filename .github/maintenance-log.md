# Maintenance log

## 2026-11-08 — Align the repository guide with the current site

### Rationale

The README's project tree still listed nonexistent top-level `css/`, `js/`,
and `images/` directories and did not document the committed tests, workflow,
lockfile, or maintenance log. Its development section also omitted the static
preview and deployment workflow, leaving contributors to infer the current
layout and content-update boundaries from source.

### Files changed

- `README.md` — corrects the project tree and documents verified requirements,
  local preview, content maintenance, validation, deployment, privacy, and
  contribution expectations.
- `.github/maintenance-log.md` — records this documentation change.

### Validation

- Cross-checked every documented path, command, runtime requirement, behavior,
  deployment statement, and contact-data flow against the repository tree,
  `package.json`, lockfile, workflow, HTML, CSS, JavaScript, and tests.
- Ran `npm ci`, `npm run validate`, and `git diff --check`.
- Reviewed the complete diff for factual accuracy, security, privacy,
  accessibility, backward compatibility, and repository scope.

### Risk

Low. This change affects documentation only. Site behavior, content, media,
analytics, dependencies, validation, deployment configuration, and legal terms
are unchanged.

### Rollback

Revert this pull request's squash commit to restore the previous README and
remove this maintenance entry; no runtime or deployment rollback is required.

## 2026-11-07 — Correct committed-photo alternatives

### Rationale

Every committed facility, prefect, and gallery photo was still announced as a
“placeholder” image. Three prefect portraits also exposed unrelated roles:
the Sports Prefect Girl and Hostel Prefect were labelled as Health Prefects,
and the Laboratory Prefect was labelled as a Sports Prefect. These alternatives
gave screen-reader users inaccurate information even though the page already
contains the correct names and roles.

### Files changed

- `index.html` — replaces placeholder wording with concise alternatives derived
  from the existing facility, role, name, and gallery labels.
- `test/site.test.js` — rejects placeholder alternatives and locks the three
  previously mismatched prefect portraits to their visible roles and names.
- `README.md` — documents the expanded accessibility validation contract.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- Reproduced the inaccurate alternatives with a focused failing regression
  test before changing the page.
- Ran `npm run validate`: JavaScript syntax checks and all 14 Node.js tests
  passed.
- Ran `git diff --check` and reviewed the complete diff for accessible names,
  factual accuracy, responsive behavior, privacy, and backward compatibility.

### Risk

Low. Image files, visible copy, layout, loading behavior, navigation, analytics,
and enquiry delivery are unchanged. The patch only corrects text exposed to
assistive technology using facts already visible beside each image.

### Rollback

Revert this pull request to restore the previous placeholder and mismatched
alternatives and remove the regression assertion. No dependency, deployment,
content-data, or configuration migration is required.

## 2026-11-01 — Respect reduced-motion preferences

### Rationale

The page forced smooth scrolling, reveal transforms, and transition effects for
all visitors, including people whose operating-system preference requests less
motion. The existing interactions now retain their current animation by default
while switching to immediate scrolling and static reveal states when
`prefers-reduced-motion: reduce` is active.

### Files changed

- `assets/css/style.css` — disables smooth scrolling and motion effects for the
  reduced-motion media query while keeping content visible.
- `assets/js/main.js` — chooses immediate scrolling for the back-to-top and
  prefect controls when the visitor requests reduced motion.
- `test/site.test.js` — verifies both reduced-motion and default scrolling
  behavior plus the CSS accessibility fallback.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- `npm ci`
- `npm run validate`
- `git diff --check`
- Reviewed the complete diff for accessibility, security, browser fallback,
  responsive behavior, and backward compatibility.

### Risk

Low. The default experience is unchanged. The alternate behavior is activated
only by a standard user preference, introduces no dependency or data flow, and
falls back to the existing smooth behavior when `matchMedia` is unavailable.

### Rollback

Revert the pull request's squash commit to restore unconditional animations and
smooth scrolling.

## 2026-10-28 — Remove the stale stylesheet backup

### Rationale

`assets/css/style.css.bak` was an unreferenced 24 KB copy of an older
stylesheet. Keeping it beside the live CSS duplicated obsolete implementation
details and made it unclear which file should be maintained. The backup is now
removed, backup artifacts are ignored, and validation prevents them from being
reintroduced under `assets/`.

### Files changed

- `assets/css/style.css.bak` — removes the unused historical stylesheet copy.
- `.gitignore` — excludes editor and manual `.bak` files.
- `test/site.test.js` — rejects backup artifacts anywhere under `assets/`.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- `npm ci`
- `npm run validate`
- `git diff --check`
- Reviewed the complete diff for active references, runtime behavior,
  accessibility, security, and backward compatibility.

### Risk

Low. The deleted file was not loaded or referenced by the website, tests,
documentation, or configuration. The live `assets/css/style.css` is unchanged.

### Rollback

Revert the pull request's squash commit to restore the backup file and remove
the ignore rule and regression assertion.

## 2026-10-21 — Defer offscreen image loading

### Rationale

The static page contained 17 image elements after the hero, representing about
14.6 MB of unique media not needed for the initial viewport. Without native
loading hints, browsers could request and decode the facilities, prefects,
gallery, and footer imagery during the first page load. The hero is now
explicitly prioritized while later media is deferred until it approaches the
viewport.

### Files changed

- `index.html` — prioritizes the hero and applies native lazy loading plus
  asynchronous decoding to every image after it.
- `test/site.test.js` — locks the above-the-fold and offscreen loading contract.
- `README.md` — documents the performance behavior and validation coverage.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- `npm ci`
- `npm run validate`
- Verified all 19 image elements: two initial-viewport images remain eager and
  all 17 later images are deferred.
- Reviewed the complete diff for accessibility, layout stability, browser
  compatibility, security, and unchanged content.

### Risk

Low. Native loading and decoding hints are progressive enhancements; browsers
that do not support them keep the existing behavior. Existing aspect-ratio
containers preserve layout, and no image, content, analytics, dependency, or
interaction changes.

### Rollback

Revert the pull request's squash commit to restore default image loading.

## 2026-10-16 — Keep page content usable without IntersectionObserver

### Rationale

Reveal animation styles hid most content before JavaScript ran, while the script
unconditionally constructed `IntersectionObserver`. Browsers or embedded
webviews without that API threw before the contact form and slider were wired,
leaving sections invisible and interactions incomplete. Animation is now a
progressive enhancement: content remains visible without JavaScript, and the
script explicitly reveals it when observation is unavailable.

### Files changed

- `index.html` — marks JavaScript-enabled documents before styles load.
- `assets/css/style.css` — limits initial reveal hiding to JavaScript-enabled
  documents.
- `assets/js/main.js` — feature-detects `IntersectionObserver` and fails open
  without stopping later initialization.
- `test/site.test.js` — covers visible fallback content and a working enquiry
  handoff when the observer API is missing.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- Source-level progressive-enhancement assertions.
- Unsupported-observer regression exercises content visibility and WhatsApp
  enquiry initialization.
- Full repository validation is required on the pull request before merge.

### Risk

Low. Supported browsers retain the existing reveal and active-navigation
observers. Unsupported or JavaScript-disabled clients now see static content
instead of hidden sections; no content, destination, dependency, or data flow
changes.

### Rollback

Revert the pull request's squash commit to restore observer-only reveal
initialization.

## 2026-10-10 — Replace broken photos with honest fallbacks

### Rationale

Nine image paths referenced files that are not committed to the repository,
leaving broken-image icons across the facilities, staff, student-life,
boarding, and gallery sections. The unavailable photos now render as neutral,
accessible placeholders without substituting unrelated or fabricated images.

### Files changed

- `index.html` — replaces only missing image references with labelled fallback
  elements while preserving the surrounding verified content.
- `assets/css/style.css` — styles the shared fallback consistently with the
  existing card design.
- `test/site.test.js` — verifies every local page resource exists and locks the
  intentional fallback count.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- `npm ci`
- `npm run validate`
- Verified all local `src` and `href` references against committed files.
- Reviewed the complete diff for accessibility, responsive layout, security,
  backward compatibility, and repository conventions.

### Risk

Low. The change removes failed network requests and broken-image UI without
altering navigation, enquiry delivery, content, or existing verified photos.

### Rollback

Revert the pull request's squash commit to restore the previous missing-image
references.

## 2026-10-04 — Make contact enquiries deliverable

### Rationale

The contact form intercepted submission, discarded the visitor's details, and
displayed a development-only message saying that a backend still needed to be
connected. Visitors could therefore complete every required field without
actually sending an enquiry. The site already publishes the school's phone
number, so the form now prepares a reviewable WhatsApp message for that
documented contact channel.

### Files changed

- `index.html` — accurately labels the WhatsApp handoff and exposes progress
  feedback as an accessible status message.
- `assets/js/main.js` — validates non-blank text, formats the submitted
  details, and navigates to the school's published WhatsApp number without
  relying on a popup.
- `test/site.test.js` — covers the form contract, trimmed message content,
  destination, and whitespace-only rejection.
- `README.md` — documents the expanded validation coverage.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- `npm ci`
- `npm run validate` (JavaScript syntax checks and seven tests)
- Reviewed the generated WhatsApp URL, encoded message, blank-input behavior,
  accessibility status, and complete diff.

### Risk

Low. The change only replaces a non-delivering placeholder submission with a
client-side handoff to the phone number already published on the page. No
backend, dependency, tracking, or stored user data is introduced.

### Rollback

Revert the pull request's squash commit to restore the placeholder-only contact
form behavior.

## 2026-09-29 — Add reproducible navigation validation

### Rationale

The mobile-navigation behavior had been exercised with a temporary test harness,
but the repository had no committed test command, lockfile, or CI workflow.
Future changes could therefore regress menu state or keyboard behavior without a
repeatable check.

### Files changed

- `test/site.test.js` — adds dependency-free regression coverage for navigation
  markup, open/close state, the Admissions link, and Escape focus restoration.
- `package.json` and `package-lock.json` — define reproducible syntax, test, and
  combined validation commands without adding runtime dependencies.
- `.github/workflows/validate.yml` — runs the locked validation suite with
  read-only permissions, pinned actions, concurrency cancellation, and a timeout.
- `.gitignore` — excludes local npm installation and debug output.
- `README.md` — documents the local and hosted validation workflow.
- `.github/maintenance-log.md` — records this maintenance work.

### Validation

- `npm ci`
- `npm run validate`
- Parsed the workflow as YAML and verified action pins and permissions.
- `git diff --check`
- Reviewed the complete diff for security, accessibility, backward
  compatibility, repository conventions, and dependency changes.

### Risk

Low. The website's HTML, CSS, and runtime JavaScript are unchanged. The new
files only validate the existing navigation contract and add CI with read-only
repository access.

### Rollback

Revert the pull request's squash commit to remove the validation toolchain and
workflow.

## 2026-09-21 — Mobile navigation keyboard behavior

### Rationale

The mobile navigation exposed its initial open/closed state through `aria-expanded`, but the toggle did not identify the menu it controlled, its accessible label stayed “Open navigation menu” while the menu was open, and keyboard users could not dismiss the menu with Escape. The Admissions link also sat outside `.nav-links`, so selecting it did not close the mobile menu. Closing the menu after other links duplicated state-reset code.

### Files changed

- `index.html` — connected the menu toggle to `#nav-menu` with `aria-controls`.
- `assets/js/main.js` — centralized menu closing for every menu link, synchronized the accessible label with the visual state, and added Escape-key dismissal with focus restoration.
- `.github/maintenance-log.md` — recorded this maintenance work.

### Validation

- Ran `node --check assets/js/main.js`.
- Verified every local `src` and `href` reference and recorded pre-existing missing image placeholders separately from this change.
- Checked that the toggle's `aria-controls` target exists and that its initial `aria-expanded` state matches the closed menu.
- Exercised open, standard-link close, Admissions-link close, and Escape-close state transitions with a DOM test harness.
- Ran `git diff --check` and reviewed the complete diff.

### Risk

Low. The change only synchronizes existing mobile-menu state and adds a conventional keyboard dismissal path. Layout, navigation destinations, and desktop behavior are unchanged.

### Rollback

Revert the pull request's squash commit to restore the previous menu behavior.
