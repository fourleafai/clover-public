# clover-public

Open interview-prep MCP. Works in any MCP-aware client. Hand off to [Four-Leaf](https://four-leaf.ai) for live voice.

This is the public, MIT-licensed companion to [Four-Leaf](https://four-leaf.ai), the AI job search assistant.

## Three components

| Component | What it is | Install |
|---|---|---|
| [`mcp/`](./mcp) | MCP server — live tools for question lookup, role intelligence, scoring feedback, voice handoff. Works in **ChatGPT Desktop, Claude Desktop, Claude Code, Cline, Continue, Cursor, Windsurf** — anywhere [Model Context Protocol](https://modelcontextprotocol.io) is supported. | Add to your client's `mcp.json` |
| [`skill/`](./skill) | Claude Skill — bundled commands for Claude Code / Claude Desktop users who want the lowest-friction install. Claude-only by primitive. | Drop into `~/.claude/skills/four-leaf/` |
| [`questions/`](./questions) | Question bank dataset — 500+ interview questions across 24 roles, with scoring rubric anchors. Vanilla JSON, no client lock-in. | `npm i four-leaf-questions` |

The MCP is the cross-LLM core. The Skill is a low-friction wrapper for Claude users. The dataset is everyone's substrate.

## Why this exists

Job-seekers shouldn't have to switch AI assistants to get good prep. The protocol is open, so the prep should be too.

**What ships today:** role intelligence lookup and a question bank inside any MCP-aware client. Voice mock interviews already exist on [Four-Leaf](https://four-leaf.ai) — you can go there now and use them.

**On the roadmap:** MCP tools that connect the two — letting an AI assistant kick off a voice session, look up company-specific interview formats, and tailor a resume against a specific job description without leaving your editor.

## How is this different from `noamseg/interview-coach-skill`?

[noamseg/interview-coach-skill](https://github.com/noamseg/interview-coach-skill) is excellent and we recommend it for Claude users who want a free, self-contained Skill. The difference:

- **Cross-LLM.** Our MCP works in ChatGPT, Claude, Cursor, and every other MCP-aware client. Noamseg is Claude-only.
- **Live voice handoff.** Our MCP creates a Four-Leaf voice session you can speak into and get adaptive follow-ups in real time. Static Skills can't do voice.
- **Real company intelligence.** Paid MCP tool returns company-specific interview formats per round, sourced from our database.
- **Production reliability.** Paid product, maintained team, versioned releases, npm-published dataset.

## Status

Pre-launch. Components ship incrementally. Issues and PRs go in this repo.

## License

[MIT](./LICENSE).
