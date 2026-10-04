# Maintenance log

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
