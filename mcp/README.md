# four-leaf-mcp

Open [MCP](https://modelcontextprotocol.io) server for interview prep. Cross-LLM. Hands off to [Four-Leaf](https://four-leaf.ai) for live voice.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

## What this is

A Model Context Protocol server that exposes Four-Leaf's interview intelligence to any MCP-aware AI assistant. All tools are free today. Future tools that tie back to a [Four-Leaf](https://four-leaf.ai) account (voice mock interview kickoff, company-specific intelligence, resume tailoring against a specific JD) are on the roadmap.

The MCP protocol is governed by the [Linux Foundation](https://www.linuxfoundation.org/) and natively supported by Anthropic, OpenAI, Google, AWS, and Microsoft. Pick your assistant — this server works with it.

## Tools (current scaffold)

| Tool | Tier | What it does |
|---|---|---|
| `list_roles` | free | List all roles with available interview intelligence |
| `get_role_intelligence` | free | Structured intel for a role: pipeline, experience levels, question categories, scoring dimensions, resume + cover-letter guidance |

More tools shipping incrementally — question bank lookup, scoring feedback, voice handoff.

## Install

Once published to npm, configure your client to launch the server. Snippets below for the major clients.

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or equivalent on Windows/Linux:

```json
{
  "mcpServers": {
    "four-leaf": {
      "command": "npx",
      "args": ["-y", "four-leaf-mcp"]
    }
  }
}
```

### ChatGPT Desktop

Settings → Developer → MCP servers → Add:

```json
{
  "name": "four-leaf",
  "command": "npx",
  "args": ["-y", "four-leaf-mcp"]
}
```

### Cursor

`~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "four-leaf": {
      "command": "npx",
      "args": ["-y", "four-leaf-mcp"]
    }
  }
}
```

### Cline (VS Code extension)

Cline settings → MCP servers → Add Server. Use the same `npx four-leaf-mcp` command.

### Continue

`~/.continue/config.json`:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "four-leaf-mcp"]
        }
      }
    ]
  }
}
```

### Windsurf

Settings → MCP servers → Add. Same `npx four-leaf-mcp` command.

### Claude Code (terminal)

```bash
claude mcp add four-leaf -- npx -y four-leaf-mcp
```

## Develop locally

```bash
git clone https://github.com/fourleafai/clover-public.git
cd clover-public/mcp
npm install
npm run dev
```

Wire to your client by pointing `command` at `tsx` and `args` at the local source:

```json
{
  "command": "npx",
  "args": ["-y", "tsx", "/absolute/path/to/clover-public/mcp/src/index.ts"]
}
```

## Status

Pre-release (`0.0.1`). API may break. See the [top-level README](../README.md) for the bigger picture.

## License

MIT
