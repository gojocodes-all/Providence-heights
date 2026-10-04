// Logo fallback: if assets/images/logo.png is missing, show the temporary PH mark
const brandLogos = document.querySelectorAll(".brand__logo");

brandLogos.forEach((logo) => {
  logo.addEventListener("error", () => {
    const wrapper = logo.closest(".brand__logo-wrap");
    const fallback = wrapper?.querySelector(".brand__mark--fallback");

    logo.classList.add("is-hidden");
    fallback?.classList.add("is-visible");
  });
});

// =========================================================
// PROVIDENCE HEIGHTS SECONDARY SCHOOL WEBSITE
// JavaScript for navigation, animations and small interactions
// =========================================================

const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const backToTopButton = document.querySelector(".back-to-top");
const yearSpan = document.querySelector("#current-year");

// Set current year automatically
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Mobile menu toggle
if (menuButton && navMenu) {
  const menuLinks = navMenu.querySelectorAll("a");

  const closeMobileMenu = ({ restoreFocus = false } = {}) => {
    navMenu.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");

    if (restoreFocus) {
      menuButton.focus();
    }
  };

  menuButton.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");

    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => closeMobileMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMobileMenu({ restoreFocus: true });
    }
  });
}

// Header shadow after scrolling
window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
});

// Reveal sections on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Active navigation link while scrolling
const sections = [...document.querySelectorAll("main section[id]")];

const activeLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isCurrent);
      });
    });
  },
  {
    threshold: 0.35,
  }
);

sections.forEach((section) => activeLinkObserver.observe(section));

// Back to top button
if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Send validated enquiries through the school's published WhatsApp number
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const formNote = contactForm.querySelector(".form-note");
  const enquiryTypes = {
    admissions: "Admissions",
    boarding: "Boarding",
    academics: "Academics",
    alumni: "Alumni",
    general: "General",
  };

  contactForm.addEventListener("input", (event) => {
    event.target?.setCustomValidity?.("");
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = {
      name: contactForm.elements.namedItem("name"),
      email: contactForm.elements.namedItem("email"),
      type: contactForm.elements.namedItem("type"),
      message: contactForm.elements.namedItem("message"),
    };
    const requiredTextFields = [fields.name, fields.message];
    const blankField = requiredTextFields.find(
      (field) => !field.value.trim()
    );

    if (blankField) {
      blankField.setCustomValidity("Please enter a value that is not only spaces.");
      blankField.reportValidity();
      return;
    }

    const fullName = fields.name.value.trim();
    const email = fields.email.value.trim();
    const enquiryType = enquiryTypes[fields.type.value] ?? fields.type.value;
    const enquiryMessage = fields.message.value.trim();
    const whatsappMessage = [
      "Hello Providence Heights Secondary School,",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Enquiry type: ${enquiryType}`,
      "",
      enquiryMessage,
    ].join("\n");
    const whatsappUrl =
      `https://wa.me/2349092802779?text=${encodeURIComponent(whatsappMessage)}`;

    if (formNote) {
      formNote.textContent = "Opening your prepared enquiry in WhatsApp…";
    }

    window.location.assign(whatsappUrl);
  });
}



// Prefect horizontal slider controls
const prefectScroller = document.querySelector(".prefect-grid--scroll");
const prefectPrevButton = document.querySelector(".prefect-prev");
const prefectNextButton = document.querySelector(".prefect-next");

if (prefectScroller && prefectPrevButton && prefectNextButton) {
  const getScrollAmount = () => {
    const firstCard = prefectScroller.querySelector(".profile-card");
    if (!firstCard) return 300;

    const cardWidth = firstCard.getBoundingClientRect().width;
    return cardWidth + 18;
  };

  prefectPrevButton.addEventListener("click", () => {
    prefectScroller.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  });

  prefectNextButton.addEventListener("click", () => {
    prefectScroller.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  });
}
