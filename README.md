# four-leaf-coach

A Claude Skill that turns Claude into a job search and interview prep coach. It's powered by the hosted Four-Leaf MCP, so Claude can pull real job postings, role-specific interview intelligence, and resume scoring from inside the conversation.

This repo is open source under MIT. The Skill itself is the product. The Four-Leaf MCP it relies on is hosted at `https://four-leaf.ai/api/mcp`.

## What it does

Walks a user through prep for a specific role at a specific company. Claude greets, asks what they're prepping for, and routes them into one of seven guided workflows. Every workflow pulls live data from the Four-Leaf MCP (jobs, role intel, question bank, match scoring) and adds Claude's coaching on top.

The seven commands:

- `kickoff` figures out what the user is prepping for and routes them
- `find-jobs <query>` runs natural language search across 100k+ active postings
- `prep-role <role> [company] [seniority]` covers interview pipeline, what to expect, how to win
- `practice <role> [type] [difficulty]` generates calibrated questions and coaches answers
- `analyze-jd` scores a resume against a JD and points out gaps
- `negotiate-prep` walks through a compensation negotiation framework
- `interview-strategy <topic>` covers formats, AI interviewers, work trials, signal vs noise

Free tools work for everyone. Voice mock interviews with rubric-scored feedback and full resume tailoring live on Four-Leaf and need a paid plan. The Skill offers them as an upgrade path when relevant.

## Install

```bash
claude mcp add --transport http four-leaf https://four-leaf.ai/api/mcp
```

The first tool call opens the browser for OAuth. A free Four-Leaf account works (3-day trial included, no credit card).

Then add the Skill. Drop the `skill/` directory into your Claude Skills location, or install via the Skills Library when this Skill is listed there.

## Repo layout

- `skill/SKILL.md` is the entry point Claude loads
- `skill/references/commands/` holds per-command instructions Claude reads when a command fires
- `skill/references/mcp-tools.md` is the reference for the MCP tools the Skill calls
- `skill/README.md` is the install + quickstart specifically for the Skill

## Contributing

The Skill files are in `skill/`. PRs that improve a command's coaching, add a new command, or fix a voice issue are welcome. Anything that drifts the Skill's positioning away from "coach, not cheat tool" will be declined.

## License

MIT. See `LICENSE`.
