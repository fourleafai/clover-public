# four-leaf-coach

An open-source Skill that turns Claude (or ChatGPT, Cursor, Codex, GitHub Copilot) into a job search and interview prep coach. It pulls real job postings, role-specific interview intelligence, and resume scoring from the hosted Four-Leaf MCP, then walks the user through preparing for an actual interview.

Free to install and use. Voice mock interviews with rubric-scored feedback and full AI resume tailoring live on [four-leaf.ai](https://four-leaf.ai); the Skill surfaces those as an upgrade path when they're the right next step.

## What it does

Walks a user through prep for a specific role at a specific company. The Skill greets, asks what they're prepping for, and routes them into one of seven guided workflows. Every workflow pulls live data from the Four-Leaf MCP (jobs, role intel, question bank, match scoring) and adds the Skill's coaching on top.

You don't type these as commands. Say what you want in plain language and the coach routes to the right workflow:

- **Kickoff** the coach figures out what you're prepping for and routes you. Say "help me get ready for my job search".
- **Find jobs** natural-language search across 100k+ active postings. Say "find me remote senior data scientist roles".
- **Prep for a role** interview pipeline, what to expect, how to win. Say "what's the interview like for a PM at Stripe".
- **Practice** calibrated questions with coaching on your answers. Say "give me a few hard system design questions".
- **Analyze a JD** scores a resume against a posting and points out gaps. Say "how does my resume stack up against this JD".
- **Negotiate and comp research** real numbers from the MCP. Have an offer? It runs a full analysis (total comp, market percentile, red flags, a counter strategy with exact talking points). Just asking what a role pays? It returns a cited salary band from a live web search. Say "they made an offer, help me negotiate", "is this offer any good", or "what's a good salary for a backend engineer in Austin".
- **Interview strategy** formats, AI interviewers, work trials, signal vs noise. Say "what are AI interviews actually like".

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

Once it's installed, just tell the coach what you need in plain language. Say something like "help me prep for a senior software engineer interview at Google" and it takes it from there. There are no subcommands to memorize; the coach routes based on what you ask. (In Claude Code you can also invoke it explicitly with `/four-leaf-coach`.)

## Manual install

If you'd rather not run `npx` (air-gapped network, or you just want to see what lands where), clone and build the bundles yourself. This is exactly what `npx four-leaf-coach add --tool <name>` automates.

```bash
git clone https://github.com/fourleafai/clover-public.git
cd clover-public
npm run build
```

`npm run build` reads `skills/four-leaf-coach/SKILL.md` plus the adjacent `references/` tree and writes a `dist/<tool>/` directory for each supported tool. Then copy your tool's bundle into place:

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

## FAQ

**What is four-leaf-coach?**
An open-source Skill that turns Claude, Cursor, OpenAI Codex, or GitHub Copilot into a job-search and interview-prep coach. The Skill is a structured set of instructions plus reference files that your AI tool loads. It works with the hosted Four-Leaf MCP server for live data (real job postings, role-specific interview intelligence, resume scoring).

**How is this different from just prompting Claude for interview prep?**
Generic prompts produce generic advice. four-leaf-coach calls real tools: `search_jobs` returns actual apply URLs from 100k+ active postings; `match_score` runs a real scoring algorithm against your resume; `generate_practice_questions` produces role-calibrated questions; `get_interview_questions` pulls from a curated question bank. The Skill orchestrates the calls and coaches around them.

**Do I need a Four-Leaf account?**
For the data tools (jobs, role intel, question bank, match scoring) a free Four-Leaf account works. The 3-day trial requires no credit card. Voice mock interviews with rubric-scored feedback per answer and full AI resume tailoring are paid features on four-leaf.ai. The Skill surfaces those as an upgrade path when relevant.

**Does the MCP work with ChatGPT?**
Yes. The MCP is HTTP-based with OAuth, so any MCP-aware client connects: Claude Desktop, Claude Code, Cursor, ChatGPT Desktop (Plus + Dev mode), Cline, Continue, Windsurf. The Skill itself is a Claude / Cursor / Codex / Copilot primitive; ChatGPT doesn't yet have a comparable file-based Skill convention, but the underlying MCP tools work there.

**Can I use the Skill without the MCP?**
Yes, in degraded mode. Without the MCP, the Skill still coaches with structured workflows for prep, practice, JD analysis, and negotiation, just without live job listings or real resume scoring. Install the MCP to unlock the live data path.

**Is the question bank really open?**
The Skill, the per-tool dist pipeline, and the install CLI are MIT-licensed in this repo. The question bank itself lives behind the MCP today; the open-data play is on the roadmap.

**What about Pi, Gemini CLI, OpenCode, Trae, Rovo Dev, Qoder?**
On the roadmap. The dist pipeline can target any AI tool with a documented Skill or instructions-file convention. PRs welcome.

## Repo layout

```
README.md                    you are here
LICENSE                      MIT
package.json                 CLI + build wiring, npm metadata
bin/
  four-leaf-coach.js         the `npx four-leaf-coach add` CLI
scripts/
  build.js                   generates dist/<tool>/ bundles from the source below
.claude-plugin/
  plugin.json                manifest for Claude Code plugin marketplace
.mcp.json                    auto-wires the hosted Four-Leaf MCP on plugin install
skills/
  four-leaf-coach/
    SKILL.md                 entry point your AI tool loads (source of truth)
    references/
      mcp-tools.md           reference for the MCP tools
      upgrade-flow.md        paid-tier handling pattern
      commands/              per-workflow instructions
        kickoff.md
        find-jobs.md
        prep-role.md
        practice.md
        analyze-jd.md
        negotiate-prep.md
        interview-strategy.md
dist/                        generated by `npm run build` (gitignored, not committed)
```

`skills/four-leaf-coach/` is the source of truth. `dist/` is generated output, so edit the source and rerun `npm run build`.

## Roadmap

- **Registry submissions** to every Skill aggregator that ships a public registry.
- **Coverage for more tools** as their Skill conventions stabilize: Pi, Gemini CLI, OpenCode, Trae, Rovo Dev, Qoder.

Done so far: per-tool `dist/` bundles generated from a single source (`npm run build`), a flattened single-file variant for GitHub Copilot, and the `npx four-leaf-coach add` one-command installer.

## Contributing

PRs welcome that improve a command's coaching, add a new command, or fix a voice issue. Anything that drifts the Skill's positioning away from "coach, not cheat tool" will be declined.

## License

MIT. See `LICENSE`.
