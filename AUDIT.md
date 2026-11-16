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

### home.html

home.html uses no ARIA. I removed five ARIA attributes because a native element does each job better:

| Removed | Problem | Native replacement |
|---|---|---|
| `role="main"` on a div | Unnecessary | `<main>` |
| `role="button"` on a div | A div is not focusable and ignores Enter; it also navigates, so it is a link | `<a href="book.html">` |
| `aria-label="click here"` on that div | Replaced the real label "Request a Stay" with a meaningless one | The link's visible text |
| `aria-hidden="true"` on the hours | Hid the opening hours from screen readers | Visible `<table>` |
| `aria-label="more"` on a link | Replaced the visible text with something vaguer | Link text "See all of our services" |

### services.html

| ARIA kept | Where | Why a native element could not do the job |
|---|---|---|
| `role="status"` | The estimate message and the availability result | Announces updates (for example "Training removed" or "Good news: your dates are available") to screen readers without moving focus. HTML has `<output>`, but browsers do not announce it reliably, so `role="status"` is the dependable choice. |
| `aria-describedby` | Drop off and pick up date fields | Connects each field to its error message, so the error is read when the field gets focus. A `<label>` can only name a field. It cannot attach a second piece of text like an error. |
| `aria-describedby` | The four quantity number fields | Connects each field to its limit text (for example "Up to 2, one per day of your 2-day stay"), so screen reader users hear the limit before changing the number. |
| `aria-invalid="true"` | Date fields, only while they have an error | Tells screen readers the field has a problem. The native `required` and `min` checks cannot express our custom rules (pick up before drop off, closed on Sunday). |

Not ARIA, but related: `tabindex="-1"` on the "Your estimate" heading lets the script move focus there after a Remove button disappears, so keyboard users are not lost. It does not add the heading to the Tab order.


## Usability review of services.html

Task scenarios:

- Task A: Estimate the cost for a large dog for boarding and grooming.
- Task B: Find out if a stay from December 24, 2026 to December 26, 2026 is possible.
- Task C: You added Training by mistake. Remove only Training.

Findings (at least 6, at least 5 different heuristics):

| # | Task | Evidence (what happened) | Heuristic | Severity | Change to test |
|---|---|---|---|---|---|
| 1 | Task A: Estimate the cost for a large dog for boarding and grooming. | After choosing the services, I did not get any indication that the button selection worked.  If my screen zoom was larger, I would not see any change to the Estimated Price section.| 1. Visibility of system status | Medium| The buttons should have a hover and focused state.  |
| 2 | Task A: Estimate the cost for a large dog for boarding and grooming. | After choosing the services, I can see the estimated cost changing but the individual line items for boarding and grooming are staying the same when I select different dog sizes. | 2. Match between system and real world | High | The dollar amounts should change dynamically based on both the services selected and the information entered. |
| 3 | Task A: Estimate the cost for a large dog for boarding and grooming. | The size chart hyperlink does not work so I have no point of reference to choose the correct size. | 10. Help and documentation | Medium| Create a working size chart.|
| 4 | Task B: Find out if Dec 24 to Dec 26, 2026 is possible. | After selecting the dates, I hit both the "Go" and "Send" buttons and did not get any confirmation as to whether the request was accepted.  I only saw a loading symbol.  | 1. Visibility of system status | High | Show a confirmation message or error message if the request is unsuccessful. |
| 5 | Task B: Find out if Dec 24 to Dec 26, 2026 is possible, | It was unclear to me at first what "Date 1" and "Date 2" meant.  After selecting the dates, I hit both the "Go" and "Send" buttons and did not get any indication as to what I requested.| 4. Consistency and standards | Low | Change the language to match that of hotel booking sites. |
| 6 | Task C: Remove only Training and keep every other choice | There was no way to remove a single service. The only option was to reset and start over, which cleared my other choices too. | 3. User control and freedom | Low | Add a "Remove" button next to each selected service that removes only that service. |

Design checklist for this page:

- Who is using this?
- What is the primary action?
- What competes with it?

The site is for dog owners.  The primary action on this page is to book a stay and any additional services for their dog.  The announcement banners at the top are all competing with this primary action and pushing it below the fold at 100% zoom. 

## Retest of services.html

| Task | Before (result) | After (result) |
|---|---|---|
| Task A: Estimate the cost for a large dog for boarding and grooming. | After choosing the services, I did not get any indication that the button selection worked.  If my screen zoom was larger, I would not see any change to the Estimated Price section.| I can see a clear "selected" state for the services that I chose. Keyboard pass. |
| Task A: Estimate the cost for a large dog for boarding and grooming. | After choosing the services, I can see the estimated cost changing but the individual line items for boarding and grooming are staying the same when I select different dog sizes. | The page is now responsive and the cost changes dynamically when I change the dog size.Keyboard pass. |
| Task A: Estimate the cost for a large dog for boarding and grooming. | The size chart hyperlink does not work so I have no point of reference to choose the correct size. | I am able to see the size chart and I better understand the purpose of the hyperlink before clicking. Keyboard pass.|
| Task B: Find out if Dec 24 to Dec 26, 2026 is possible. | After selecting the dates, I hit both the "Go" and "Send" buttons and did not get any confirmation as to whether the request was accepted.  I only saw a loading symbol.  | Now there is one clear button to "Check availability" and I get a quick status message to show me if the dates are available. Keyboard pass.|
| Task B: Find out if Dec 24 to Dec 26, 2026 is possible, | It was unclear to me at first what "Date 1" and "Date 2" meant.  After selecting the dates, I hit both the "Go" and "Send" buttons and did not get any indication as to what I requested.| Now I can see a clear "Drop off date" and "Pick up date" to select. Keyboard pass.|
| Task C: Remove only Training and keep every other choice | There was no way to remove a single service. The only option was to reset and start over, which cleared my other choices too. | I now not only have the ability to select and deselect a service but I can also add multiple of the same service for the stay with clear limits based on the number of days. Keyboard pass.|

## Verification of book.html

| Check | Result |
|---|---|
| HTML validator errors | 0 errors |
| Lighthouse accessibility score | 100 |
| Keyboard test (notes) | passed all checks|
| DevTools check of the status message container (what attribute did you see?) | `role="status"` on `<div id="booking-status" class="booking-status">`.|

## After (home.html final)

| Check | Before | After |
|---|---|---|
| Lighthouse accessibility score | 84 | 100 |
| WAVE errors | 1 | 0 |
| WAVE contrast errors | 6 | 0 |
| HTML validator errors | 5 | 0 |
| Keyboard test | Keyboard controls do not work at all. |All 7 stops can be reached with Tab |
| 200% zoom and 320px test | Text cut off after zoom and window size changed.| No sideways scrolling and no content past the right edge at 320px wide.|



## Before shipping checklist (all three pages)

- [X] Keyboard access works everywhere. Proof: Every control can be reached with tab.
- [X] Focus is always visible. Proof: Every tab stop shows an outline.
- [X] Contrast passes. Proof: Lighthouse's color contrast audit passed on all three pages.
- [x] Layout works on small screens. Proof: no sideways scrolling and no content past the right edge on all screens.
- [X] Feedback is meaningful (errors and success). Proof: Errors are shown as written textg and do not only rely on color to communicate status.

## One thing I had to check by hand that the tools did not catch
The tools did not catch all of the keyboard accessibility issues. 
