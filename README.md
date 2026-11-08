# Providence Heights Secondary School

A responsive, single-page website for Providence Heights Secondary School in
the Fagba/Iju area of Lagos. The site presents the school's identity,
academics, leadership, facilities, student life, gallery, admissions details,
and contact information.

[Visit the live website](https://providence-heights.vercel.app)

## About the project

This project is a modern school website designed to provide students, parents, staff, and visitors with easy access to important information about Providence Heights Secondary School.

The website focuses on accessibility, responsiveness, clean design, and an intuitive user experience across desktop, tablet, and mobile devices.

## Features

- Responsive design for all screen sizes
- Modern and professional user interface
- School information and history
- Academic programs section
- Facilities showcase
- Staff and leadership profiles
- Gallery section
- Contact information and a WhatsApp enquiry flow
- Prioritized hero loading and native lazy loading for offscreen photography
- Mobile-friendly navigation
- Reduced-motion support for reveal and scrolling effects

## Built with

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

## 📂 Project Structure

```text
.
├── .github/
│   ├── maintenance-log.md  Maintenance decisions and rollback notes
│   └── workflows/
│       └── validate.yml    Pull-request and main-branch validation
├── assets/
│   ├── css/style.css       Visual design and responsive layouts
│   ├── images/             Logo, campus, facility, prefect, and gallery media
│   └── js/main.js          Navigation, reveal effects, enquiry, and controls
├── test/site.test.js       Dependency-free site regression tests
├── .gitignore              Local and generated files excluded from commits
├── index.html              Page content, metadata, and semantic structure
├── package-lock.json       Locked npm metadata
├── package.json            Node.js requirement and validation commands
└── README.md               Project and contribution guide
```

## Run locally

Requirements:

- Node.js 20 or newer for validation
- A modern browser for previewing the static site

Install from the committed lockfile and run the validation suite:

```bash
npm ci
npm run validate
```

There is no build step. To preview the site over HTTP, serve the repository
root. For example, with Python 3:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Updating the site

- Edit page copy, contact details, links, and section structure in `index.html`.
- Replace committed media under `assets/images/` and keep the matching `src`
  paths and accurate alternative text in `index.html`.
- Update colours, layout, breakpoints, and motion preferences in
  `assets/css/style.css`.
- Update navigation, enquiry, reveal, and slider behaviour in
  `assets/js/main.js`.

The contact form prepares an enquiry for the school's published WhatsApp
number; it does not submit to a custom backend. When contact details change,
keep the visible telephone links and the WhatsApp destination in
`assets/js/main.js` aligned.

## Validation

`npm run validate` syntax-checks the site JavaScript and runs regression tests
for local resources, mobile navigation, contact enquiries, accessible state,
whitespace validation, WhatsApp message formatting, accurate image
alternatives, reduced motion, and image-loading priority. Pull requests and
updates to `main` run the same command in GitHub Actions.

Before publishing a content or media change:

1. Run `npm run validate`.
2. Preview desktop and mobile navigation in a browser.
3. Submit a sample enquiry and verify the WhatsApp destination and message.
4. Check that every new image has an accurate alternative or is intentionally
   decorative.

## Deployment

Deploy the repository root as a static site. The host must serve `index.html`
at the root and preserve the relative `assets/` paths. No server runtime,
generated output directory, or environment variable is required by the current
site.

## Contributing

Create focused branches from `main`, preserve the existing static structure,
and include validation notes with each pull request. Do not commit private
student or parent information, credentials, analytics secrets, or unverified
school claims.

---

🎯 Project Goals

- Improve the school's online presence
- Provide easy access to information for students and parents
- Present a modern digital identity for the institution
- Deliver a smooth user experience on all devices

---

👨‍💻 Developer

GOJO.DEV

GitHub: https://github.com/gojocodes-all

Building modern web experiences with creativity, performance, and simplicity.

---

📜 License

This project is intended for educational and institutional use.

© Providence Heights Secondary School. All rights reserved.
