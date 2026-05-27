#!/usr/bin/env node
/**
 * four-leaf-coach CLI.
 *
 * Installs the four-leaf-coach Skill into a supported AI tool by copying the
 * pre-built bundle from dist/<tool>/ into that tool's config location.
 *
 * Commands:
 *   add    detect (or take --tool) and install the Skill
 *   list   show supported tools and whether each is detected here
 *
 * The package ships dist/ pre-built (see prepack), so users don't clone or
 * build. Pure Node stdlib, no dependencies.
 */

const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const readline = require("readline/promises");
const { parseArgs } = require("util");

const PKG_ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(PKG_ROOT, "dist");
const SKILL_NAME = "four-leaf-coach";
const MCP_CMD = "claude mcp add --transport http four-leaf https://four-leaf.ai/api/mcp";

// Read the version straight from package.json so it never drifts.
const VERSION = require(path.join(PKG_ROOT, "package.json")).version;

const TOOLS = ["claude-code", "cursor", "codex", "github-copilot"];

const TOOL_LABELS = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  codex: "OpenAI Codex CLI",
  "github-copilot": "GitHub Copilot",
};

/* ----------------------------- small helpers ----------------------------- */

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Recursively copy a directory tree. */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(from, to);
    } else if (entry.isFile()) {
      await fs.copyFile(from, to);
    }
  }
}

/** Copy a single file, creating parent directories as needed. */
async function copyFileTo(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

function tilde(p) {
  const home = os.homedir();
  return p.startsWith(home) ? p.replace(home, "~") : p;
}

function bail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

/* ------------------------------ detection -------------------------------- */

/**
 * Inspect cwd and $HOME for signals of each tool. Returns an array of
 * { tool, scope, reason } candidates, most specific first.
 */
async function detectTools(cwd, home) {
  const candidates = [];

  if (await pathExists(path.join(cwd, ".cursor"))) {
    candidates.push({ tool: "cursor", scope: "project", reason: ".cursor/ in this directory" });
  }
  if (await pathExists(path.join(cwd, ".claude"))) {
    candidates.push({ tool: "claude-code", scope: "project", reason: ".claude/ in this directory" });
  }
  if (await pathExists(path.join(home, ".claude", "skills"))) {
    candidates.push({ tool: "claude-code", scope: "global", reason: "~/.claude/skills/ exists" });
  }
  if (await pathExists(path.join(cwd, "AGENTS.md"))) {
    candidates.push({ tool: "codex", scope: "project", reason: "AGENTS.md in this directory" });
  }
  if (await pathExists(path.join(cwd, ".github"))) {
    candidates.push({ tool: "github-copilot", scope: "project", reason: ".github/ in this directory" });
  }

  return candidates;
}

/* ------------------------------- prompts --------------------------------- */

async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(question);
    return answer.trim();
  } finally {
    rl.close();
  }
}

async function confirm(question) {
  const answer = (await ask(`${question} [y/N] `)).toLowerCase();
  return answer === "y" || answer === "yes";
}

/** Present a numbered menu and return the chosen item. */
async function choose(label, items, renderItem) {
  console.log(`\n${label}`);
  items.forEach((item, i) => {
    console.log(`  ${i + 1}) ${renderItem(item)}`);
  });
  while (true) {
    const raw = await ask(`Choose 1-${items.length}: `);
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= items.length) {
      return items[n - 1];
    }
    console.log("Enter a number from the list.");
  }
}

/* ----------------------------- resolve target ---------------------------- */

/**
 * Given the chosen tool, scope, and base directory, return the install plan:
 * { tool, scope, source, kind, target, existing }.
 *   kind: "dir" (copy a tree) or "tree+entry" (codex) or "file" (copilot)
 */
async function buildPlan(tool, scope, base) {
  switch (tool) {
    case "claude-code": {
      const source = path.join(DIST_DIR, "claude-code", ".claude", "skills", SKILL_NAME);
      const target = path.join(base, ".claude", "skills", SKILL_NAME);
      return { tool, scope, kind: "skill-dir", source, target, existing: await pathExists(target) };
    }
    case "cursor": {
      const source = path.join(DIST_DIR, "cursor", ".cursor", "skills", SKILL_NAME);
      const target = path.join(base, ".cursor", "skills", SKILL_NAME);
      return { tool, scope, kind: "skill-dir", source, target, existing: await pathExists(target) };
    }
    case "codex": {
      const source = path.join(DIST_DIR, "codex");
      const agents = path.join(base, "AGENTS.md");
      return {
        tool,
        scope,
        kind: "codex",
        source,
        target: base,
        agentsPath: agents,
        existing: await pathExists(agents),
      };
    }
    case "github-copilot": {
      const source = path.join(DIST_DIR, "github", ".github", "copilot-instructions.md");
      const target = path.join(base, ".github", "copilot-instructions.md");
      return { tool, scope, kind: "file", source, target, existing: await pathExists(target) };
    }
    default:
      bail(`unknown tool "${tool}". Supported: ${TOOLS.join(", ")}`);
  }
}

/* -------------------------------- install -------------------------------- */

async function runInstall(plan, { dryRun }) {
  const tag = dryRun ? "[dry-run] " : "";

  switch (plan.kind) {
    case "skill-dir": {
      console.log(`${tag}Write Skill to ${tilde(plan.target)}/`);
      if (!dryRun) {
        await fs.rm(plan.target, { recursive: true, force: true });
        await copyDir(plan.source, plan.target);
      }
      break;
    }
    case "codex": {
      console.log(`${tag}Write ${tilde(plan.agentsPath)}`);
      console.log(`${tag}Write ${tilde(path.join(plan.target, "references"))}/`);
      if (!dryRun) {
        await copyFileTo(path.join(plan.source, "AGENTS.md"), plan.agentsPath);
        await copyDir(path.join(plan.source, "references"), path.join(plan.target, "references"));
      }
      break;
    }
    case "file": {
      console.log(`${tag}Write ${tilde(plan.target)}`);
      if (!dryRun) {
        await copyFileTo(plan.source, plan.target);
      }
      break;
    }
    default:
      bail(`internal error: unknown plan kind "${plan.kind}"`);
  }
}

function printNextSteps(plan, dryRun) {
  const scopeNote = plan.tool === "claude-code" ? ` (${plan.scope})` : "";
  const verb = dryRun ? "[dry-run] Would install" : "Installed";
  console.log(`\n${verb} ${SKILL_NAME} for ${TOOL_LABELS[plan.tool]}${scopeNote}.`);

  console.log("\nNext step: install the Four-Leaf MCP for live data.");
  console.log(`  ${MCP_CMD}`);

  if (plan.tool === "claude-code") {
    console.log("\nThen just describe what you're prepping for.");
  } else if (plan.tool === "cursor") {
    console.log("\nEnable Agent Skills (Settings, Rules, Agent Skills on the Nightly channel), then describe what you're prepping for.");
  } else if (plan.tool === "codex") {
    console.log("\nRun Codex from this directory, then describe what you're prepping for.");
  } else if (plan.tool === "github-copilot") {
    console.log("\nCopilot picks up .github/copilot-instructions.md automatically. Ask it to run kickoff.");
  }
}

/* --------------------------------- add ----------------------------------- */

async function cmdAdd(opts) {
  if (!(await pathExists(DIST_DIR))) {
    bail("dist/ not found. If you're running from a clone, run `npm run build` first.");
  }

  const cwd = process.cwd();
  const home = os.homedir();

  if (opts.tool && !TOOLS.includes(opts.tool)) {
    bail(`unknown --tool "${opts.tool}". Supported: ${TOOLS.join(", ")}`);
  }
  if (opts.scope && !["project", "global"].includes(opts.scope)) {
    bail(`unknown --scope "${opts.scope}". Use project or global.`);
  }

  // 1. Decide the tool.
  let tool = opts.tool;
  let scope = opts.scope;

  if (!tool) {
    const candidates = await detectTools(cwd, home);
    if (candidates.length === 1) {
      tool = candidates[0].tool;
      scope = scope || candidates[0].scope;
      console.log(`Detected ${TOOL_LABELS[tool]} (${candidates[0].reason}).`);
    } else if (candidates.length > 1) {
      const picked = await choose(
        "Found more than one tool. Which one?",
        candidates,
        (c) => `${TOOL_LABELS[c.tool]} (${c.reason})`
      );
      tool = picked.tool;
      scope = scope || picked.scope;
    } else {
      const picked = await choose(
        "No tool detected here. Which one are you installing for?",
        TOOLS.map((t) => ({ tool: t })),
        (c) => TOOL_LABELS[c.tool] + (c.tool === "claude-code" ? " (default)" : "")
      );
      tool = picked.tool;
    }
  }

  // 2. Decide scope + base directory.
  let base;
  if (opts.dir) {
    // Explicit base directory. The tool's standard subpath is appended.
    base = path.resolve(opts.dir);
    scope = scope || (tool === "claude-code" ? "global" : "project");
  } else if (tool === "claude-code") {
    if (!scope) {
      const hasProject = await pathExists(path.join(cwd, ".claude"));
      const hasGlobal = await pathExists(path.join(home, ".claude"));
      if (hasProject && hasGlobal) {
        const picked = await choose(
          "Install Claude Code Skill where?",
          [
            { scope: "global", where: tilde(path.join(home, ".claude", "skills")) },
            { scope: "project", where: path.join(cwd, ".claude", "skills") },
          ],
          (c) => `${c.scope} (${c.where})`
        );
        scope = picked.scope;
      } else if (hasProject) {
        scope = "project";
      } else {
        scope = "global";
      }
    }
    base = scope === "global" ? home : cwd;
  } else {
    scope = scope || "project";
    base = cwd;
  }

  // 3. Build the plan and handle overwrites.
  const plan = await buildPlan(tool, scope, base);

  if (plan.existing && !opts.force && !opts.yes && !opts.dryRun) {
    const what =
      plan.kind === "skill-dir"
        ? `${tilde(plan.target)}/`
        : plan.kind === "codex"
        ? tilde(plan.agentsPath)
        : tilde(plan.target);
    const ok = await confirm(`${what} already exists. Replace?`);
    if (!ok) {
      console.log("Cancelled. Nothing was written.");
      return;
    }
  } else if (plan.existing && opts.dryRun) {
    console.log(`[dry-run] ${tilde(plan.target)} already exists and would be replaced.`);
  }

  // 4. Install.
  await runInstall(plan, { dryRun: opts.dryRun });
  printNextSteps(plan, opts.dryRun);
}

/* --------------------------------- list ---------------------------------- */

async function cmdList() {
  const cwd = process.cwd();
  const home = os.homedir();
  const detected = await detectTools(cwd, home);
  const byTool = new Set(detected.map((c) => c.tool));

  console.log("Supported tools:\n");
  for (const tool of TOOLS) {
    const hits = detected.filter((c) => c.tool === tool);
    const status = byTool.has(tool)
      ? `detected (${hits.map((h) => h.reason).join(", ")})`
      : "not detected here";
    console.log(`  ${TOOL_LABELS[tool].padEnd(18)} ${status}`);
  }
  console.log(`\nInstall with: four-leaf-coach add [--tool <name>]`);
}

/* --------------------------------- usage --------------------------------- */

function printUsage() {
  console.log(`four-leaf-coach ${VERSION}

Install the four-leaf-coach Skill into your AI tool.

Usage:
  four-leaf-coach add [options]    Detect your tool and install the Skill
  four-leaf-coach list             Show supported tools and what's detected here

Options for add:
  --tool <name>     claude-code | cursor | codex | github-copilot
  --scope <s>       project | global   (Claude Code only; default global)
  --dir <path>      Install under this base directory instead of detecting
  --yes, -y         Skip confirmation prompts
  --force           Overwrite existing files without asking
  --dry-run         Print what would happen, write nothing

Other:
  --help, -h        Show this help
  --version         Print the version

After installing, add the Four-Leaf MCP for live data:
  ${MCP_CMD}`);
}

/* --------------------------------- main ---------------------------------- */

async function main() {
  const argv = process.argv.slice(2);

  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      tool: { type: "string" },
      scope: { type: "string" },
      dir: { type: "string" },
      yes: { type: "boolean", short: "y", default: false },
      force: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", default: false },
    },
  });

  if (values.version) {
    console.log(VERSION);
    return;
  }

  const command = positionals[0];

  if (values.help || command === "help" || !command) {
    printUsage();
    // No command at all is a usage error; explicit --help/help is success.
    if (!command && !values.help) process.exitCode = 1;
    return;
  }

  switch (command) {
    case "add":
      await cmdAdd({
        tool: values.tool,
        scope: values.scope,
        dir: values.dir,
        yes: values.yes,
        force: values.force,
        dryRun: values["dry-run"],
      });
      break;
    case "list":
      await cmdList();
      break;
    default:
      console.error(`Unknown command "${command}".\n`);
      printUsage();
      process.exitCode = 1;
  }
}

main().catch((err) => bail(err.stack || String(err)));
