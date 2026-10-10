const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const scriptSource = fs.readFileSync(path.join(root, "assets/js/main.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(root, "index.html"), "utf8");

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(value) {
    this.values.add(value);
  }

  remove(value) {
    this.values.delete(value);
  }

  contains(value) {
    return this.values.has(value);
  }

  toggle(value, force) {
    const enabled = force === undefined ? !this.contains(value) : Boolean(force);
    if (enabled) this.add(value);
    else this.remove(value);
    return enabled;
  }
}

class FakeElement {
  constructor({ links = [], value = "" } = {}) {
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.focused = false;
    this.links = links;
    this.listeners = new Map();
    this.reportedValidity = false;
    this.textContent = "";
    this.validationMessage = "";
    this.value = value;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  dispatch(type, event = {}) {
    this.listeners.get(type)?.(event);
  }

  focus() {
    this.focused = true;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  querySelectorAll(selector) {
    return selector === "a" ? this.links : [];
  }

  reportValidity() {
    this.reportedValidity = true;
  }

  setCustomValidity(message) {
    this.validationMessage = message;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
}

function loadSiteScript() {
  const homeLink = new FakeElement();
  homeLink.setAttribute("href", "#home");
  const admissionsLink = new FakeElement();
  admissionsLink.setAttribute("href", "#admissions");
  const menuButton = new FakeElement();
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  const navMenu = new FakeElement({ links: [homeLink, admissionsLink] });
  const formNote = new FakeElement();
  const formFields = {
    name: new FakeElement({ value: "Ada Parent" }),
    email: new FakeElement({ value: "ada@example.com" }),
    type: new FakeElement({ value: "admissions" }),
    message: new FakeElement({ value: "Please share the entrance requirements." }),
  };
  const contactForm = new FakeElement();
  contactForm.elements = {
    namedItem(name) {
      return formFields[name] ?? null;
    },
  };
  contactForm.querySelector = (selector) =>
    selector === ".form-note" ? formNote : null;
  const documentListeners = new Map();
  const assignedUrls = [];
  const selectors = new Map([
    [".menu-toggle", menuButton],
    [".nav-menu", navMenu],
    [".contact-form", contactForm],
  ]);

  const document = {
    addEventListener(type, listener) {
      documentListeners.set(type, listener);
    },
    querySelector(selector) {
      return selectors.get(selector) ?? null;
    },
    querySelectorAll(selector) {
      if (selector === ".nav-links a") return [homeLink];
      return [];
    },
  };
  class FakeIntersectionObserver {
    observe() {}
    unobserve() {}
  }

  vm.runInNewContext(scriptSource, {
    Date,
    IntersectionObserver: FakeIntersectionObserver,
    document,
    window: {
      addEventListener() {},
      location: {
        assign(url) {
          assignedUrls.push(url);
        },
      },
      scrollTo() {},
      scrollY: 0,
    },
  });

  return {
    admissionsLink,
    assignedUrls,
    contactForm,
    dispatchKey(key) {
      documentListeners.get("keydown")?.({ key });
    },
    formFields,
    formNote,
    homeLink,
    menuButton,
    navMenu,
  };
}

test("navigation markup exposes its controlled menu and initial state", () => {
  assert.match(
    htmlSource,
    /class="menu-toggle"[\s\S]*?aria-controls="nav-menu"[\s\S]*?aria-expanded="false"/,
  );
  assert.match(htmlSource, /class="nav-menu" id="nav-menu"/);
  assert.match(htmlSource, /class="nav-cta">Admissions<\/a>/);
});

test("every local page resource exists and unavailable photos use honest fallbacks", () => {
  const localReferences = [...htmlSource.matchAll(/\b(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) =>
      !reference.startsWith("#") &&
      !/^(?:https?:|tel:|mailto:)/.test(reference)
    );

  for (const reference of localReferences) {
    assert.equal(
      fs.existsSync(path.join(root, reference)),
      true,
      `Missing local resource: ${reference}`,
    );
  }

  const unavailablePhotos = [
    ...htmlSource.matchAll(/class="media-placeholder"[\s\S]*?aria-label="([^"]+ photo unavailable)"/g),
  ];
  assert.equal(unavailablePhotos.length, 9);
  assert.doesNotMatch(htmlSource, /assets\/images\/(?:boarding-life|staff\/|gallery\/(?:assembly|clubs|students)|facilities\/(?:physics|chemistry)-lab)\.jpg/);
});

test("mobile navigation keeps visual and accessible state synchronized", () => {
  const { homeLink, menuButton, navMenu } = loadSiteScript();

  menuButton.dispatch("click");
  assert.equal(navMenu.classList.contains("is-open"), true);
  assert.equal(menuButton.classList.contains("is-open"), true);
  assert.equal(menuButton.getAttribute("aria-expanded"), "true");
  assert.equal(menuButton.getAttribute("aria-label"), "Close navigation menu");

  homeLink.dispatch("click");
  assert.equal(navMenu.classList.contains("is-open"), false);
  assert.equal(menuButton.getAttribute("aria-expanded"), "false");
  assert.equal(menuButton.getAttribute("aria-label"), "Open navigation menu");
});

test("Admissions closes the mobile menu even though it is outside the link list", () => {
  const { admissionsLink, menuButton, navMenu } = loadSiteScript();

  menuButton.dispatch("click");
  admissionsLink.dispatch("click");

  assert.equal(navMenu.classList.contains("is-open"), false);
  assert.equal(menuButton.getAttribute("aria-expanded"), "false");
});

test("Escape closes an open menu and restores focus to its toggle", () => {
  const { dispatchKey, menuButton, navMenu } = loadSiteScript();

  menuButton.dispatch("click");
  dispatchKey("Escape");

  assert.equal(navMenu.classList.contains("is-open"), false);
  assert.equal(menuButton.getAttribute("aria-expanded"), "false");
  assert.equal(menuButton.focused, true);
});

test("enquiry markup explains that submission continues in WhatsApp", () => {
  assert.match(
    htmlSource,
    /class="form-note" role="status" aria-live="polite"/,
  );
  assert.match(htmlSource, />Send via WhatsApp<\/button>/);
  assert.doesNotMatch(htmlSource, /<form class="contact-form reveal" action="#"/);
});

test("valid enquiries open a trimmed, prefilled WhatsApp message", () => {
  const { assignedUrls, contactForm, formFields, formNote } = loadSiteScript();
  formFields.name.value = "  Ada Parent  ";
  formFields.message.value = "  Please share the entrance requirements.  ";

  contactForm.dispatch("submit", { preventDefault() {} });

  assert.equal(assignedUrls.length, 1);
  const [url] = assignedUrls;
  assert.equal(new URL(url).hostname, "wa.me");
  assert.equal(new URL(url).pathname, "/2349092802779");

  const message = new URL(url).searchParams.get("text");
  assert.match(message, /Name: Ada Parent/);
  assert.match(message, /Email: ada@example\.com/);
  assert.match(message, /Enquiry type: Admissions/);
  assert.match(message, /Please share the entrance requirements\./);
  assert.doesNotMatch(message, /  Ada Parent  /);
  assert.equal(formNote.textContent, "Opening your prepared enquiry in WhatsApp…");
});

test("whitespace-only enquiry fields stay in the form with validation feedback", () => {
  const { assignedUrls, contactForm, formFields } = loadSiteScript();
  formFields.name.value = "   ";

  contactForm.dispatch("submit", { preventDefault() {} });

  assert.equal(assignedUrls.length, 0);
  assert.equal(formFields.name.reportedValidity, true);
  assert.match(formFields.name.validationMessage, /not only spaces/);
});
