# four-leaf-coach (Skill)

Install instructions, what the Skill does, and how to use each of the seven commands.

## Install

Two steps. First, install the Four-Leaf MCP so the Skill has live data:

```bash
claude mcp add --transport http four-leaf https://four-leaf.ai/api/mcp
```

The first tool call opens the browser for OAuth. A free Four-Leaf account works. The 3-day trial is included with no credit card.

Second, install the Skill itself. Drop `skill/` into your Claude Skills directory, or install via the Anthropic Skills Library when it's listed there.

## Verify the install

In Claude, type `/kickoff`. If you see a greeting that mentions the role catalog, you're set. If you see an MCP-not-connected message, finish the MCP install above.

## The seven commands

| Command | What it does | MCP tools it uses |
|---|---|---|
| `kickoff` | Greets, figures out what you're prepping for, routes you | `list_roles` |
| `find-jobs <query>` | Natural-language search across 100k+ active postings. Returns titles, companies, salary if available, apply URLs | `search_jobs` |
| `prep-role <role> [company] [seniority]` | Interview pipeline, what to expect, how to win, red flags for a specific role | `get_role_intelligence`, `explain_interview_format` |
| `practice <role> [type] [difficulty]` | Generates calibrated practice questions and coaches your answers | `generate_practice_questions`. Offers `start_voice_mock_interview` for paid rubric-scored feedback |
| `analyze-jd` | You paste a JD + resume. The Skill scores fit and points out gaps | `match_score`. Offers `tailor_resume` (paid) for the rewrite |
| `negotiate-prep` | Walks you through a compensation negotiation framework | None. Skill-only coaching |
| `interview-strategy <topic>` | Explains formats (AI interviewers, work trials, panels) and how to read them | `explain_interview_format`, `get_role_intelligence` |

## What's free vs paid

- **Free in the MCP**: all the data (jobs, role intel, question bank, match scoring). Use as much as you want. Rate-limited per day on the more expensive tools.
- **Paid on Four-Leaf**: voice mock interviews with rubric-scored feedback per answer, full AI resume tailoring against a specific JD, application tracking. The Skill surfaces these as an upgrade path when they're the right next step.

Three paid options. 3-day free trial (no card). $5 5-Day Pass (good for one upcoming interview). $20/mo Pro (ongoing job search). All three give you the same features.

## Troubleshooting

**The Skill isn't finding the MCP.** Check `claude mcp list`. If `four-leaf` isn't in the list, run the install command again. If it's listed but tool calls fail, run `claude mcp` and re-authorize.

**A specific tool returns "unknown role".** Call `list_roles` to see what's currently supported. The catalog grows. If your role isn't there, use the closest match or fall back to coaching-only mode.

**The Skill is hallucinating instead of using the MCP.** Tell it to use the MCP. The Skill should default to tool calls. If it's not, that's a Skill bug. Open an issue.

## Architecture

`SKILL.md` is the entry Claude loads. It defines the seven commands and routes between them. Each command's detailed instructions live in `references/commands/`. MCP-tool reference lives in `references/mcp-tools.md`. Upgrade flow lives in `references/upgrade-flow.md`.

The Skill itself contains no business logic. It's all coaching instructions and tool routing. The actual data and the heavy compute live on the hosted Four-Leaf MCP.
