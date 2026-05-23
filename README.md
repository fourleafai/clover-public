# clover-public

Open interview-prep MCP. Works in any MCP-aware client. Hand off to [Four-Leaf](https://four-leaf.ai) for live voice.

This is the public, MIT-licensed companion to [Four-Leaf](https://four-leaf.ai), the AI job search assistant. The canonical install is **hosted** at `https://four-leaf.ai/api/mcp` — most users want that. This repo is the reference implementation for developers who want to read the code, fork it, or self-host without authentication.

## Use the hosted version (recommended)

```json
{
  "mcpServers": {
    "four-leaf": {
      "url": "https://four-leaf.ai/api/mcp"
    }
  }
}
```

Add this to Claude Desktop, Cursor, ChatGPT Desktop, Cline, Continue, or Windsurf. On first tool call you'll be sent to a Four-Leaf login (free trial works). After that, the tools are available to your AI assistant — anywhere you talk to AI.

Detailed install snippets per client are at [four-leaf.ai/oss](https://four-leaf.ai/oss).

## What's in this repo

| Directory | What it is |
|---|---|
| [`mcp/`](./mcp) | Reference MCP server implementation (stdio + npm). Self-hostable, no auth, local-only. Useful as a code reference, for forking, or for power users who want to run it themselves. |
| [`skill/`](./skill) | Claude Skill (v1). Bundled `kickoff`, `find-jobs`, `prep-role`, `practice`, `analyze-jd`, `negotiate-prep`, and `interview-strategy` commands for Claude Code and Claude Desktop. |
| [`questions/`](./questions) | Question bank dataset — coming soon. Vanilla JSON, standalone npm package other tools can build on. |

## How is this different from `noamseg/interview-coach-skill`?

[noamseg/interview-coach-skill](https://github.com/noamseg/interview-coach-skill) is excellent if you only use Claude and want a free self-contained Skill. The difference:

- **Cross-LLM.** Our MCP works in ChatGPT, Claude, Cursor, and any MCP-aware client. Noamseg is Claude-only.
- **Live voice handoff.** Our MCP creates a Four-Leaf voice session for real-time follow-ups. Static Skills can't do voice.
- **Real company intelligence.** Authenticated tier returns company-specific interview formats per round.
- **Maintained as part of a paid product.** Versioned releases, npm-published dataset.

## Status

Pre-launch. Components ship incrementally. Issues and PRs go in this repo.

## License

[MIT](./LICENSE).
