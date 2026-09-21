# Maintenance log

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
