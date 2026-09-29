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
  constructor({ links = [] } = {}) {
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.focused = false;
    this.links = links;
    this.listeners = new Map();
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
  const documentListeners = new Map();
  const selectors = new Map([
    [".menu-toggle", menuButton],
    [".nav-menu", navMenu],
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
      scrollTo() {},
      scrollY: 0,
    },
  });

  return {
    admissionsLink,
    dispatchKey(key) {
      documentListeners.get("keydown")?.({ key });
    },
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
