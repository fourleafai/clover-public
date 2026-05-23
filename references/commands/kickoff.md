# /kickoff

Default entry. Figure out what the user is prepping for, confirm Four-Leaf has data for it, route to the right command.

## When to run

- User types `/kickoff`.
- User opens a fresh conversation and says something generic like "help me with my job search" or "I have an interview coming up".
- User's intent doesn't map cleanly to one of the other six commands.

## Flow

1. **Verify the MCP is connected.** Call `list_roles`. If it fails with a not-connected error, tell the user how to install the MCP (see `mcp-tools.md` for the message) and offer coaching-only mode while they fix it.

2. **Greet briefly.** One sentence, not a wall of text. Example:
   > Four-Leaf coach here. What are you working on? Finding jobs, prepping for a specific interview, scoring your resume, or thinking about negotiation?

3. **Get the four pieces of context that matter.** Don't ask all of them upfront. Ask the one that's most relevant to whatever the user said:
   - **Role**, the position they're targeting (data scientist, software engineer, product manager, etc.). If they name a role, validate it against `list_roles`.
   - **Company**, the specific target if they have one.
   - **Seniority**, one of entry, mid, senior, or staff.
   - **Timeline**, since interview tomorrow vs. browsing the market matters a lot.

4. **Route.** Based on what they said, pick the right command:

| User wants | Route to |
|---|---|
| Find jobs / discover roles | `/find-jobs` |
| Understand a specific role's interview format | `/prep-role` |
| Practice answering questions | `/practice` |
| Check resume fit against a JD | `/analyze-jd` |
| Comp negotiation | `/negotiate-prep` |
| Generic "what are interviews like at X" | `/interview-strategy` |

Suggest the command in plain language, not by saying "I'll run `/find-jobs` now". Just transition into doing it.

## What not to do

- Don't make the user fill out a form. Conversational.
- Don't ask for their full resume in `/kickoff`. Save that for `/analyze-jd`.
- Don't try to be helpful on every topic at once. Pick the one that matters and dig in.
