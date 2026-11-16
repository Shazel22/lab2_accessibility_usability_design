# AI LOG

Name: Skye Hazel

## My AI setup

- Tool and where it runs (editor, terminal): Claude Code
- Version or model, if shown: Opus 5.5
- Project context file name and location: CLAUDE.md under docs folder
- Did the tool correctly list and describe my project files on the first try? What did I fix? Yes.  It called out an problem where I would need to move the context file to the project root. 

## Prompt log (at least 6)

| # | Where I used it (file or part) | My prompt | What the AI returned (short summary) | What I did (kept, changed, rejected) and why |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |

## Problems I found in the AI booking form (at least 3)

| # | Problem | How I found it (tool, test, or reading the diff) | Fixed by hand or by follow up prompt |
|---|---|---|---|
| 1 | No clear differentiation between heading sizes on the booking form. | I found it by manually reviewing the page. | Fixed by prompt |
| 2 | The page seems disconnected from the prior page and the context is not carrying over.  It's asking users to add the same information in again. | I found it manually by reviewing the page. | Fixed by prompt |
| 3 | The page seems disconnected from the prior page and the context is not carrying over. The user should be able to see a confirmation of their selections here before submitting. | I found it manually by reviewing the page. | Fixed by prompt |


## A time the AI was wrong or unhelpful

What happened, and how I caught it:
The checkboxes were not keyboard accessible.  I caught it by manual testing.  This made me think more about the user flow and consider that users should be able to add multiple services to the stay and not be limited to only one of each. 

