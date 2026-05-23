# four-leaf-coach

An open-source Skill that turns Claude (or ChatGPT, Cursor, Codex, GitHub Copilot) into a job search and interview prep coach. It pulls real job postings, role-specific interview intelligence, and resume scoring from the hosted Four-Leaf MCP, then walks the user through preparing for an actual interview.

Free to install and use. Voice mock interviews with rubric-scored feedback and full AI resume tailoring live on [four-leaf.ai](https://four-leaf.ai); the Skill surfaces those as an upgrade path when they're the right next step.

## What it does

Walks a user through prep for a specific role at a specific company. The Skill greets, asks what they're prepping for, and routes them into one of seven guided workflows. Every workflow pulls live data from the Four-Leaf MCP (jobs, role intel, question bank, match scoring) and adds the Skill's coaching on top.

The seven commands:

- `kickoff` figures out what the user is prepping for and routes them
- `find-jobs <query>` runs natural language search across 100k+ active postings
- `prep-role <role> [company] [seniority]` covers interview pipeline, what to expect, how to win
- `practice <role> [type] [difficulty]` generates calibrated questions and coaches answers
- `analyze-jd` scores a resume against a JD and points out gaps
- `negotiate-prep` walks through a compensation negotiation framework
- `interview-strategy <topic>` covers formats, AI interviewers, work trials, signal vs noise

## Install

Two steps. The Skill (this repo) tells your AI tool how to coach. The hosted MCP gives the Skill live data.

### Step 1: install the Skill

Clone the repo:

```bash
git clone https://github.com/fourleafai/clover-public.git
cd clover-public
```

Then run one command for your tool:

| Tool | One-line install | Scope |
|---|---|---|
| Claude Code (project) | `cd /path/to/your/project && mkdir -p .claude/skills/four-leaf-coach && cp -r /path/to/clover-public/SKILL.md /path/to/clover-public/references .claude/skills/four-leaf-coach/` | project |
| Claude Code (global) | `mkdir -p ~/.claude/skills/four-leaf-coach && cp -r SKILL.md references ~/.claude/skills/four-leaf-coach/` | user-wide |
| Cursor (Nightly + Agent Skills enabled) | `cd /path/to/your/project && mkdir -p .cursor/skills/four-leaf-coach && cp -r /path/to/clover-public/SKILL.md /path/to/clover-public/references .cursor/skills/four-leaf-coach/` | project |
| OpenAI Codex CLI | `cp SKILL.md AGENTS.md` (work in this cloned dir, or move both `AGENTS.md` and `references/` to your project root) | cwd |
| GitHub Copilot | `cd /path/to/your/project && mkdir -p .github && cp /path/to/clover-public/SKILL.md .github/copilot-instructions.md` | repo |

Cursor requires the Nightly channel with **Settings → Rules → Agent Skills** enabled. Other tools work out of the box.

### Step 2: install the Four-Leaf MCP for live data

The Skill works in degraded mode (coaching only, no live job data) without the MCP. To get real job search, role intel, and resume scoring, install the hosted MCP:

```bash
# Claude Code, Claude Desktop, and any tool that uses claude-mcp config
claude mcp add --transport http four-leaf https://four-leaf.ai/api/mcp
```

The first tool call opens the browser for OAuth. A free Four-Leaf account works (3-day trial included, no credit card).

For Cursor, ChatGPT Desktop, and other MCP-aware tools, configure the same URL (`https://four-leaf.ai/api/mcp`) per that tool's MCP setup docs.

### Step 3: use it

In your tool, type `/kickoff` (or `kickoff` if your tool doesn't use slash commands). The coach takes it from there.

## What's free vs paid

- **Free**: the Skill itself, all the data tools in the MCP (jobs, role intel, question bank, match scoring). Daily rate limits on a few of the compute-heavier tools.
- **Paid on [four-leaf.ai](https://four-leaf.ai)**: voice mock interviews with adaptive AI follow-ups and rubric-scored feedback per answer, full AI resume tailoring against a specific JD, application tracking. Three options at [four-leaf.ai/pricing](https://four-leaf.ai/pricing). 3-day free trial (no card), $5 5-Day Pass, $20/mo Pro. All three give you the same features.

The Skill surfaces these when they're the right next step. It doesn't push.

## Repo layout

```
README.md                    you are here
LICENSE                      MIT
SKILL.md                     entry point your AI tool loads
references/
  mcp-tools.md               reference for the eight MCP tools
  upgrade-flow.md            paid-tier handling pattern
  commands/                  per-command instructions
    kickoff.md
    find-jobs.md
    prep-role.md
    practice.md
    analyze-jd.md
    negotiate-prep.md
    interview-strategy.md
```

## Contributing

PRs welcome that improve a command's coaching, add a new command, or fix a voice issue. Anything that drifts the Skill's positioning away from "coach, not cheat tool" will be declined.

## License

MIT. See `LICENSE`.
