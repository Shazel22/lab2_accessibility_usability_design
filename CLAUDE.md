# Project context for AI tools

## Project

- Name: MPLS Dog Boarding website
- What it is: A small static website for a dog boarding business (home page, services page, booking request page)
- Who uses it: Dog owners looking for prices, hours, and a way to request a stay. Include people who use a keyboard only, people who zoom the page, and people on phones.
- My course and assignment: CPST342 Intro to Web App Development, Fall II 2026. Lab 2: Audit and Improve the MPLS Dog Boarding Site (accessibility, usability, and design)

## Technology rules

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no libraries, no build step, no new dependencies.
- There is no server yet. A Node.js backend comes in the next module, so build the form to be ready for it. For now, simulate success with a small script and leave a code comment where the real request will go.
- Files live in the project root: `home.html`, `services.html`, `book.html`, `styles.css`, `services.css`, `services.js`, `booking.js`. Images are in `img/` and course docs are in `docs/`.
- Shared styles go in `styles.css`. Use the CSS custom properties defined at the top of that file. Form styles belong in `styles.css`, not a new CSS file.
- No inline styles and no inline scripts.

## Business facts (use these exactly, do not invent others)

- Business name: MPLS Dog Boarding
- Monday to Friday: 7:00 am to 6:00 pm
- Saturday: 8:00 am to 4:00 pm
- Sunday: Closed
- Weekly boarding: $425 for 7 days (24 hours from drop off time)
- Daily rate: $75 per day (24 hours from drop off time)
- Phone: 612 555 0142
- Address: 123 Example Street, Minneapolis, MN 55401

## Accessibility rules (not negotiable)

- Use native HTML elements first. Add ARIA only when a native element cannot do the job, and explain why. The one expected exception is a status message container with `role="status"` that is already in the page before the message is added.
- Every form field has a visible, connected label. Placeholder text is never the only label.
- Normal text meets 4.5:1 contrast. Large text and UI components meet 3:1.
- Never remove the focus outline. Focus must always be visible.
- Never use color as the only way to show meaning. Error messages must be written in text.
- One `h1` per page and headings in order.
- Pages work at 320px wide and at 200% zoom with no sideways scrolling.
- Every page has a skip to main content link that becomes visible on focus.
- Use real links and buttons. No positive `tabindex` values.
- Every page has `lang="en"`, a unique title, a viewport meta tag, and a description meta tag.

## Style

- Plain, direct text for visitors, with a friendly tone.
- Match the existing header, navigation, skip link, and footer on every page.
- Button labels are specific (for example "Request a stay"), never just "Submit."
- Error messages are plain language and appear next to the field with the problem.
- Add short comments where behavior is not obvious.

## How I want you to work

- Show me changes I can review before they are applied.
- Tell me what you are unsure about.
- Do not change files I did not ask you to change.
- Do not move keyboard focus after a form is submitted.
- When you finish, list what you created or changed and what I should test.