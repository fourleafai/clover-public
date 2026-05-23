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

Two steps. The Skill tells your AI tool how to coach. The hosted MCP gives the Skill live data.

### Step 1: install the Skill

```bash
npx four-leaf-coach add
```

That's it. The CLI detects your tool (Claude Code, Cursor, Codex, or GitHub Copilot), asks for scope when it matters, and copies the right bundle into the right place. Useful flags:

- `--tool <name>` pick the tool yourself: `claude-code`, `cursor`, `codex`, or `github-copilot`
- `--scope <project|global>` Claude Code only; where to install
- `--dry-run` show what it would do without writing anything
- `--yes` skip confirmation prompts, `--force` overwrite an existing install
- `four-leaf-coach list` show the supported tools and what's detected in the current directory

Cursor needs the Nightly channel with **Settings, Rules, Agent Skills** enabled. The other tools work out of the box.

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

## Manual install

If you'd rather not run `npx` (air-gapped network, or you just want to see what lands where), clone and build the bundles yourself. This is exactly what `npx four-leaf-coach add --tool <name>` automates.

```bash
git clone https://github.com/fourleafai/clover-public.git
cd clover-public
npm run build
```

`npm run build` reads `SKILL.md` plus the `references/` tree and writes a `dist/<tool>/` directory for each supported tool. Then copy your tool's bundle into place:

| Tool | Build output | Copy into place |
|---|---|---|
| Claude Code (global, all projects) | `dist/claude-code/` | `cp -r dist/claude-code/.claude ~/` |
| Claude Code (single project) | `dist/claude-code/` | `cp -r dist/claude-code/.claude PROJECT/` (replace `PROJECT` with your project path) |
| Cursor (Nightly + Agent Skills enabled) | `dist/cursor/` | `cp -r dist/cursor/.cursor PROJECT/` |
| OpenAI Codex CLI | `dist/codex/` | `cp -r dist/codex/AGENTS.md dist/codex/references PROJECT/`, then run Codex from `PROJECT` |
| GitHub Copilot | `dist/github/` | `cp -r dist/github/.github PROJECT/` (flattened single-file variant) |

The GitHub Copilot bundle is a single flattened file (`.github/copilot-instructions.md`) because Copilot reads one instructions file and doesn't follow references. The build inlines the whole Skill for it. The other three tools follow file references, so they get the source tree as-is.

## What's free vs paid

- **Free**: the Skill itself, all the data tools in the MCP (jobs, role intel, question bank, match scoring). Daily rate limits on a few of the compute-heavier tools.
- **Paid on [four-leaf.ai](https://four-leaf.ai)**: voice mock interviews with adaptive AI follow-ups and rubric-scored feedback per answer, full AI resume tailoring against a specific JD, application tracking. Three options at [four-leaf.ai/pricing](https://four-leaf.ai/pricing). 3-day free trial (no card), $5 5-Day Pass, $20/mo Pro. All three give you the same features.

The Skill surfaces these when they're the right next step. It doesn't push.

## Repo layout

```
README.md                    you are here
LICENSE                      MIT
package.json                 CLI + build wiring, npm metadata
bin/
  four-leaf-coach.js         the `npx four-leaf-coach add` CLI
scripts/
  build.js                   generates dist/<tool>/ bundles from the source below
SKILL.md                     entry point your AI tool loads (source of truth)
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
dist/                        generated by `npm run build` (gitignored, not committed)
```

`SKILL.md` and `references/` are the source of truth. `dist/` is generated output, so edit the source and rerun `npm run build`.

## Roadmap

- **Registry submissions** to every Skill aggregator that ships a public registry.
- **Coverage for more tools** as their Skill conventions stabilize: Pi, Gemini CLI, OpenCode, Trae, Rovo Dev, Qoder.

Done so far: per-tool `dist/` bundles generated from a single source (`npm run build`), a flattened single-file variant for GitHub Copilot, and the `npx four-leaf-coach add` one-command installer.

## Contributing

PRs welcome that improve a command's coaching, add a new command, or fix a voice issue. Anything that drifts the Skill's positioning away from "coach, not cheat tool" will be declined.

## License

MIT. See `LICENSE`.
