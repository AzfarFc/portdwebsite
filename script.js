/* ============================================================
   PORTFOLIO — Syed Kasheef Azfar
   script.js
   ============================================================
   TABLE OF CONTENTS
   1. Sticky Navbar (adds background when scrolling)
   2. Mobile Menu (hamburger toggle)
   3. Scroll Reveal Animation (fade-in on scroll)
   4. Active Nav Link Highlight (based on scroll position)
   5. Smooth Close Mobile Menu on Link Click
   ============================================================ */


/* ============================================================
   1. STICKY NAVBAR
   Adds a dark background + shadow to the navbar
   when the user scrolls past 50px from the top.
   ============================================================ */

const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    // Add class to trigger dark background (defined in CSS)
    navbar.classList.add('navbar--scrolled');
  } else {
    navbar.classList.remove('navbar--scrolled');
  }
}

// Run on scroll
window.addEventListener('scroll', handleNavbarScroll);

// Run once on load (in case page is refreshed mid-scroll)
handleNavbarScroll();


/* ============================================================
   2. MOBILE MENU (HAMBURGER TOGGLE)
   When the hamburger button is clicked, we toggle
   the 'is-open' class on the nav-links and hamburger.
   CSS handles the actual slide-in animation.
   ============================================================ */

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  // Toggle open/close classes
  hamburger.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');

  // Prevent body from scrolling when menu is open
  document.body.style.overflow = navLinks.classList.contains('is-open')
    ? 'hidden'
    : '';
});


/* ============================================================
   3. SCROLL REVEAL ANIMATION
   Every element with class="reveal" starts hidden (opacity:0)
   and slides up into view when it enters the viewport.

   We use IntersectionObserver — a modern browser API that
   watches when elements become visible on screen.
   ============================================================ */

// Select every element that should animate on scroll
const revealElements = document.querySelectorAll('.reveal');

// Create the observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      // entry.isIntersecting = true when element is visible
      if (entry.isIntersecting) {
        // Small staggered delay so grouped elements animate one by one
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);

        // Stop watching once it's been revealed (saves performance)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,    // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // Slight offset from bottom
  }
);

// Add a staggered delay to sibling cards (services, pricing, projects, testimonials)
// This makes cards animate one after another instead of all at once
function addStaggerDelays(selector, delayStep = 100) {
  const groups = document.querySelectorAll(selector);
  groups.forEach((group) => {
    const cards = group.querySelectorAll('.reveal');
    cards.forEach((card, index) => {
      card.dataset.delay = index * delayStep; // e.g. 0ms, 100ms, 200ms
    });
  });
}

// Apply stagger to grid sections
addStaggerDelays('.services-grid',      100);
addStaggerDelays('.pricing-grid',       120);
addStaggerDelays('.projects-grid',      100);
addStaggerDelays('.testimonials-grid',  100);

// Now attach the observer to every .reveal element
revealElements.forEach((el) => {
  revealObserver.observe(el);
});


/* ============================================================
   4. ACTIVE NAV LINK HIGHLIGHT
   As the user scrolls through sections, the matching
   nav link gets an 'active' style (red color).
   ============================================================ */

// All sections that have a matching nav link
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

function updateActiveNavLink() {
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop    = section.offsetTop - 100; // offset for navbar height
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });

  // Add/remove 'active' class on each nav link
  navLinkItems.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);


/* ============================================================
   5. CLOSE MOBILE MENU ON LINK CLICK
   When a nav link is clicked on mobile, close the menu
   so the page scrolls to the section smoothly.
   ============================================================ */

navLinkItems.forEach((link) => {
  link.addEventListener('click', () => {
    // Only close if menu is currently open
    if (navLinks.classList.contains('is-open')) {
      hamburger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      document.body.style.overflow = ''; // re-enable scrolling
    }
  });
});


/* ============================================================
   EXTRA: Add active nav link CSS inline
   (so you don't need an extra CSS block for it)
   ============================================================ */

// Inject a small <style> block for the active nav link color
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .nav-links a.active {
    color: #e74c3c !important;
  }
  .nav-links a.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(activeStyle);