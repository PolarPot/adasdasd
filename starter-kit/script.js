/* ════════════════════════════════════════════════════════════
   GDSC-UTP Workshop — Portfolio JavaScript
   script.js
   ════════════════════════════════════════════════════════════

   Concepts used in this file (all covered in the slides!):
     ✅ const / let variables
     ✅ document.querySelector() — selecting DOM elements
     ✅ addEventListener() — listening for user events
     ✅ classList.toggle() — toggling CSS classes
     ✅ Arrow functions  () => { }
     ✅ Template literals  `Hello ${name}!`
     ✅ event.preventDefault() — stopping default behaviour

   ════════════════════════════════════════════════════════════ */


/* ─── STEP 1: SELECT THE ELEMENTS WE NEED ───────────────────
   querySelector() finds the FIRST element matching a CSS selector.
   We store them in const variables so we can reuse them below.
───────────────────────────────────────────────────────────── */

const darkToggleBtn  = document.querySelector('#dark-toggle');
const contactForm    = document.querySelector('#contact-form');
const nameInput      = document.querySelector('#name');
const emailInput     = document.querySelector('#email');
const messageInput   = document.querySelector('#message');


/* ─── STEP 2: DARK MODE TOGGLE ───────────────────────────────
   When the user clicks the 🌙 button, we:
     1. Toggle the "dark-mode" class on <body>  →  swaps all CSS variables
     2. Update the button icon between 🌙 and ☀️
───────────────────────────────────────────────────────────── */

darkToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');

  // Update the button icon and aria-label
  darkToggleBtn.textContent = isDark ? '☀️' : '🌙';
  darkToggleBtn.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );

  // Persist the user's preference (ignore errors in restricted environments)
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (e) {}

});

// Initialize theme from saved preference or system setting
(function () {
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { saved = null; }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const shouldStartDark = saved === 'dark' || (saved === null && prefersDark);
  if (shouldStartDark) {
    document.body.classList.add('dark-mode');
    darkToggleBtn.textContent = '☀️';
    darkToggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    document.body.classList.remove('dark-mode');
    darkToggleBtn.textContent = '🌙';
    darkToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
})();


/* ─── STEP 3: CONTACT FORM SUBMISSION ───────────────────────
   When the user clicks "Send Message", we:
     1. Prevent the page from refreshing (default form behaviour)
     2. Read the values the user typed
     3. Show a friendly thank-you alert
     4. Clear the form fields
───────────────────────────────────────────────────────────── */

contactForm.addEventListener('submit', (event) => {

  // This stops the browser from reloading the page when the form is submitted.
  // Without this line, everything you typed would disappear!
  event.preventDefault();

  // Read the values the user typed into the form fields.
  // .value gives us the text content of an input element.
  const name    = nameInput.value;
  const email   = emailInput.value;
  const message = messageInput.value;

  // Quick check: make sure the user actually filled in the fields.
  if (name === '' || email === '' || message === '') {
    alert('Please fill in all fields before sending!');
    return;   // Stop here — don't continue if fields are empty
  }

  // TODO (3): Show a thank-you alert using a TEMPLATE LITERAL.
  //
  //   Template literals use backticks ` ` instead of quotes,
  //   and let you embed variables directly with ${variableName}.
  //
  //   Write an alert that includes the sender's name AND email.
  //   Example output: "Thanks Ahmad! We'll reply to you@utp.edu.my soon."
  //
  //   Starter:  alert(`Thanks ${  }! We'll reply to ${  } soon.`);
  //
  //   Fill in the blanks below:
  /* ↓ YOUR CODE HERE ↓ */


  /* ↑ YOUR CODE HERE ↑ */


  // Clear the form inputs after sending.
  contactForm.reset();

});


/* ─── BONUS: SMOOTH SCROLL HIGHLIGHTING ─────────────────────
   This is a BONUS feature — only attempt it after finishing the TODOs!

   It highlights the nav link that corresponds to the section
   currently visible on screen as the user scrolls.

   We use the IntersectionObserver API for this.
   Don't worry if this is new — it's beyond today's scope.
───────────────────────────────────────────────────────────── */

// Select all sections that have an id attribute
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove 'active' class from all nav links
        navLinks.forEach((link) => link.classList.remove('active'));

        // Add 'active' class to the link that matches this section
        const activeLink = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }   // 40% of the section must be visible
);

// Start observing each section
sections.forEach((section) => observer.observe(section));


// Skills marquee: clone items for seamless loop and pause/play handlers
(function () {
  const skillsList = document.querySelector('.skills-list');
  if (!skillsList) return;

  // Avoid double-cloning
  if (!skillsList.dataset.cloned) {
    const items = Array.from(skillsList.children);
    items.forEach((it) => skillsList.appendChild(it.cloneNode(true)));
    skillsList.dataset.cloned = 'true';
  }

  const marqueeWrapper = document.querySelector('.skills-marquee') || skillsList;

  function pause() { skillsList.style.animationPlayState = 'paused'; }
  function play()  { skillsList.style.animationPlayState = 'running'; }

  marqueeWrapper.addEventListener('mouseenter', pause);
  marqueeWrapper.addEventListener('mouseleave', play);
  // touch support
  marqueeWrapper.addEventListener('touchstart', pause, { passive: true });
  marqueeWrapper.addEventListener('touchend', play, { passive: true });
})();


// Neural pathway background animation on the hero canvas
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  // Respect reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = window.devicePixelRatio || 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Generate nodes
  let nodes = [];
  function initNodes() {
    nodes = [];
    const count = Math.max(18, Math.floor((w * h) / 40000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1.2 + Math.random() * 1.8
      });
    }
  }

  function hexToRgb(hex) {
    const m = hex.replace('#', '').trim();
    const bigint = parseInt(m.length === 3 ? m.split('').map(c=>c+c).join('') : m, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  // Get stroke color from CSS variable and update on theme change
  let [r,g,b] = [20,186,145]; // fallback rgb for #14ba91
  function updateColor() {
    const rootStyle = getComputedStyle(document.documentElement);
    const cssVar = document.body.classList.contains('dark-mode')
      ? (rootStyle.getPropertyValue('--accent-color') || '#34A853')
      : (rootStyle.getPropertyValue('--primary-color') || '#14ba91');
    try { [r,g,b] = hexToRgb(cssVar.trim()); } catch (e) {}
  }
  updateColor();
  // Watch for dark-mode class changes to update color
  const mo = new MutationObserver(updateColor);
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  let animId = null;

  function step() {
    ctx.clearRect(0, 0, w, h);

    // Move nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // Draw connections
    const maxDist = Math.min(w, h) * 0.25;
    ctx.lineWidth = 0.9;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], bN = nodes[j];
        const dx = a.x - bN.x, dy = a.y - bN.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18; // slightly stronger lines
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bN.x, bN.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${r},${g},${b},0.18)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReduced) animId = requestAnimationFrame(step);
  }

  function start() {
    resize();
    initNodes();
    if (prefersReduced) {
      // draw once and stop
      step();
      return;
    }
    animId = requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    initNodes();
    if (!prefersReduced) animId = requestAnimationFrame(step);
  });

  // Start after a short timeout so layout is stable
  setTimeout(start, 50);

})();
