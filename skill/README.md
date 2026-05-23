# skill/

Claude Skill for interview prep + job search — the low-friction install path for Claude Code and Claude Desktop users. Calls the hosted Four-Leaf MCP server for live tools.

## What's here

```
skill/
├── SKILL.md                          ← drop this in ~/.claude/skills/four-leaf/
└── references/commands/
    ├── kickoff.md
    ├── find-jobs.md
    ├── prep-role.md
    ├── practice.md
    ├── analyze-jd.md
    ├── negotiate-prep.md
    └── interview-strategy.md
```

`SKILL.md` is the entry point. `references/commands/*.md` are per-command workflow guides Claude reads as needed.

## Install

```bash
# Clone or download this directory, then:
mkdir -p ~/.claude/skills/four-leaf
cp -R skill/* ~/.claude/skills/four-leaf/
```

Restart Claude Code. The Skill activates when you mention "four-leaf coach" or use one of the commands (`kickoff`, `find-jobs`, `practice`, etc.).

For live tools (job search, role intelligence, practice question generation, match scoring, voice mock interviews), also install the MCP server:

```bash
claude mcp add four-leaf --transport http https://four-leaf.ai/api/mcp
```

On first tool call your browser opens for a Four-Leaf login. Free account works.

**Using a different AI assistant?** Skills are Claude-only. For ChatGPT Desktop, Cursor, Cline, Continue, or Windsurf — install the [MCP server](../mcp) directly. Same tools, same intelligence.

## What you get

- **`kickoff`** — start a coaching session
- **`find-jobs <query>`** — search 100k+ real job listings
- **`prep-role <role> [company]`** — full prep walk-through
- **`practice <role> [type] [difficulty]`** — practice questions + chat coaching, with voice mock handoff
- **`analyze-jd`** — paste a JD + resume, get match score + gaps
- **`negotiate-prep`** — comp negotiation framework
- **`interview-strategy <topic>`** — format guides (AI interviewers, work trials, behavioral, system design)

Free tier covers everything except live voice mock interviews and resume tailoring. Those upgrade naturally when you hit them; the coach surfaces the pricing without over-pitching.

## Status

v1. Issues + PRs welcome in this repo.

See the [top-level README](../README.md) for the bigger picture.
