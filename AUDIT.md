# AUDIT

Name: Skye Hazel

## Baseline (home.html before any changes)

| Check | Result |
|---|---|
| Lighthouse accessibility score | 84 |
| Lighthouse failed audits | 4 |
| WAVE errors | 1 |
| WAVE contrast errors | 6 |
| WAVE alerts | 9 |
| HTML validator errors | 5 |
| Keyboard test (notes) | Keyboard controls do not work at all. |
| 200% zoom and 320px test (notes) | Text cut off after zoom and window size changed. |

Contrast pairs checked:

| Text color | Background color | Ratio | Pass or fail (4.5:1 normal, 3:1 large) |
|---|---|---|---|
| 8AB4FF | FFFFFF | 2.08:1 | Fail |
| FFFFFF | F5A25D | 2.08:1 | Fail |
| AAAAAA | F4F4F4 | 2.11:1 | Fail |

## Problems found on home.html (at least 8)

| # | What I saw (evidence) | Tool or test that showed it | POUR principle | WCAG idea | Severity | Planned fix |
|---|---|---|---|---|---|---|
| 1 | Image not rendering, no descriptive text | Manual | Perceivable | 1.1.1 Non-text Content: All non-text content that is presented to the user has a text alternative that serves the equivalent purpose. | Low | Fix image rendering. Add descriptive text alternatives. |
| 2 | Poor text color contrast on navigation tabs | Lighthouse | Perceivable | 1.4.3 Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1. | High | Improve to a contrast ratio of at least 4.5:1. |
| 3 | Poor text color contrast on page hyperlinks | Lighthouse | Perceivable | 1.4.3 Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1. | High | Improve to a contrast ratio of at least 4.5:1. |
| 4 | No ability to navigate using keyboard | WAVE | Operable | 2.1.1 Keyboard: All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes. | High | Improve keyboard accessibility. |
| 5 | Poor information hierarchy. All descriptive sections have equal heading size and it is unclear which information is most important | Lighthouse and WAVE | Perceivable | 1.3.1 Info and Relationships: Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text. | Medium | Introduce appropriate heading sizes and content hierarchy. |
| 6 | Hours of operation are unclear. Some days contain no text. | Manual | Perceivable | 1.4.1 Use of Color: Color is not used as the only visual means of conveying information. | High | Ensure that color is not the only means of conveying information. |
| 7 | Request a stay button doesn't work | Manual | Understandable | 3.3.1 Error Identification: If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text. | High | Ensure button functionality. |
| 8 | No form submission message | Manual | Understandable | 3.2.5 Change on Request: Changes of context are initiated only by user request or a mechanism is available to turn off such changes. | Medium | Add a form submission success message and a status change on the page. |
| 9 | Page content is not legible when resized | Manual | Perceivable | 1.4.4 Resize Text: Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality. | High | Improve browser responsiveness. |

## ARIA notes (Part 2, step 13)

For each ARIA attribute you kept or added, explain why a native HTML element could not do the job. If you use none, say so.

## Usability review of services.html

Task scenarios:

- Task A: Estimate the cost for a large dog for boarding and grooming.
- Task B: Find out if a stay from December 24, 2026 to December 26, 2026 is possible.
- Task C: You added Training by mistake. Remove only Training.

Findings (at least 6, at least 5 different heuristics):

| # | Task | Evidence (what happened) | Heuristic | Severity | Change to test |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |

Design checklist for this page:

- Who is using this?
- What is the primary action?
- What competes with it?

## Retest of services.html

| Task | Before (result) | After (result) |
|---|---|---|
| A | | |
| B | | |
| C | | |

## Verification of book.html

| Check | Result |
|---|---|
| HTML validator errors | |
| Lighthouse accessibility score | |
| Keyboard test (notes) | |
| DevTools check of the status message container (what attribute did you see?) | |

## After (home.html final)

| Check | Before | After |
|---|---|---|
| Lighthouse accessibility score | | |
| WAVE errors | | |
| WAVE contrast errors | | |
| HTML validator errors | | |
| Keyboard test | | |
| 200% zoom and 320px test | | |

## Before shipping checklist (all three pages)

- [ ] Keyboard access works everywhere. Proof:
- [ ] Focus is always visible. Proof:
- [ ] Contrast passes. Proof:
- [ ] Layout works on small screens. Proof:
- [ ] Feedback is meaningful (errors and success). Proof:

## One thing I had to check by hand that the tools did not catch

