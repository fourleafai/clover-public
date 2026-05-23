# skill/

Claude Skill for interview prep and job search. The low-friction install path for Claude Code and Claude Desktop users. Calls the hosted Four-Leaf MCP server for live tools.

## What's here

```
skill/
├── SKILL.md                          (drop this in ~/.claude/skills/four-leaf/)
└── references/commands/
    ├── kickoff.md
    ├── find-jobs.md
    ├── prep-role.md
    ├── practice.md
    ├── analyze-jd.md
    ├── negotiate-prep.md
    └── interview-strategy.md
```

`SKILL.md` is the entry point. The files under `references/commands/` are per-command workflow guides Claude reads as needed.

## Install

Two pieces. The Skill itself, and the MCP server that gives it live tools.

Install the Skill:

```bash
mkdir -p ~/.claude/skills/four-leaf
cp -R skill/* ~/.claude/skills/four-leaf/
```

Restart Claude Code. The Skill activates when you mention "four-leaf coach" or use one of the commands (`kickoff`, `find-jobs`, `practice`, and the rest).

Connect the MCP server for the live tools (job search, role intelligence, practice questions, match scoring, voice mock interviews):

```bash
claude mcp add --transport http four-leaf https://four-leaf.ai/api/mcp
```

On the first tool call your browser opens for a Four-Leaf login. A free account works.

**Using a different AI assistant?** Skills are Claude-only. For ChatGPT Desktop, Cursor, Cline, Continue, or Windsurf, connect the [MCP server](../mcp) directly. Same tools, same intelligence.

## What you get

- **`kickoff`** starts a coaching session
- **`find-jobs <query>`** searches 100k+ real job listings
- **`prep-role <role> [company] [seniority]`** gives a full prep walk-through
- **`practice <role> [type] [difficulty]`** generates practice questions plus chat coaching, with a voice mock handoff
- **`analyze-jd`** scores a pasted JD against a resume and finds the gaps
- **`negotiate-prep`** runs the comp negotiation framework
- **`interview-strategy <topic>`** explains formats (AI interviewers, work trials, behavioral, system design)

The free tier covers everything except live voice mock interviews and resume tailoring. Those upgrade naturally when you reach them, and the coach surfaces the pricing without over-pitching. See [four-leaf.ai](https://four-leaf.ai) for the paid features.

## Status

v1. Issues and PRs welcome in this repo.

See the [top-level README](../README.md) for the bigger picture.
