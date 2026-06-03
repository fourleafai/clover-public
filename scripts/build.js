#!/usr/bin/env node
/**
 * Build per-tool bundles of the four-leaf-coach Skill.
 *
 * Source of truth is skills/four-leaf-coach/SKILL.md plus its adjacent
 * references/ tree. This script reads that source and writes dist/<tool>/
 * directories, each laid out exactly the way that tool's auto-load
 * convention expects:
 *
 *   claude-code  .claude/skills/four-leaf-coach/SKILL.md + references/   (file tree)
 *   cursor       .cursor/skills/four-leaf-coach/SKILL.md + references/    (file tree)
 *   codex        AGENTS.md + references/                                  (SKILL.md renamed)
 *   github       .github/copilot-instructions.md                         (flattened single file)
 *
 * Claude Code, Cursor, and Codex follow file references from the entry point,
 * so a tree copy is enough. GitHub Copilot reads one file and follows nothing,
 * so its variant inlines the whole Skill (frontmatter stripped) into one doc.
 *
 * Run with `npm run build`. No dependencies, no bundler. Idempotent: dist/ is
 * wiped and regenerated on every run.
 */

const fs = require("fs/promises");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKILL_NAME = "four-leaf-coach";
// Canonical skill location follows the Claude Code plugin layout:
// `<plugin-root>/skills/<name>/SKILL.md` + adjacent references/.
const SKILL_DIR = path.join(ROOT, "skills", SKILL_NAME);
const SKILL_PATH = path.join(SKILL_DIR, "SKILL.md");
const REFERENCES_DIR = path.join(SKILL_DIR, "references");
const DIST_DIR = path.join(ROOT, "dist");

// Top-level reference docs, in the order they should appear when flattened.
const TOP_LEVEL_ORDER = ["mcp-tools.md", "upgrade-flow.md"];

function fail(message) {
  console.error(`\n  build failed: ${message}\n`);
  process.exit(1);
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Recursively collect every file under dir as paths relative to dir. */
async function listFiles(dir, base = dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listFiles(full, base)));
    } else if (entry.isFile()) {
      out.push(path.relative(base, full));
    }
  }
  return out.sort();
}

/** Split SKILL.md into { frontmatter, body }. Validates the frontmatter block. */
function parseSkill(raw) {
  if (!raw.startsWith("---")) {
    fail("SKILL.md is missing its YAML frontmatter (must start with '---').");
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    fail("SKILL.md frontmatter is not closed with a second '---' line.");
  }
  const frontmatter = raw.slice(raw.indexOf("\n") + 1, end).trim();
  // Body starts after the closing '---' line.
  const afterClose = raw.indexOf("\n", end + 1);
  const body = (afterClose === -1 ? "" : raw.slice(afterClose + 1)).trim();

  if (!/^name:\s*\S+/m.test(frontmatter)) {
    fail("SKILL.md frontmatter is missing a 'name:' field.");
  }
  if (!/^description:\s*\S+/m.test(frontmatter)) {
    fail("SKILL.md frontmatter is missing a 'description:' field.");
  }
  return { frontmatter, body };
}

/**
 * Validate that every reference the source points at actually exists, and
 * return an ordered list of reference files for flattening.
 */
async function validateAndOrderReferences(skillRaw) {
  if (!(await pathExists(REFERENCES_DIR))) {
    fail("references/ directory not found next to SKILL.md.");
  }

  const refFiles = await listFiles(REFERENCES_DIR); // relative to references/
  if (refFiles.length === 0) {
    fail("references/ directory is empty.");
  }

  // 1. Every `references/...md` path written literally in SKILL.md must exist.
  const literalRefs = new Set(
    [...skillRaw.matchAll(/references\/([\w./-]+\.md)/g)].map((m) => m[1])
  );
  for (const rel of literalRefs) {
    if (!(await pathExists(path.join(REFERENCES_DIR, rel)))) {
      fail(`SKILL.md references references/${rel}, which does not exist.`);
    }
  }

  // 2. Every slash command named in SKILL.md must have a command file.
  const commandTokens = new Set(
    [...skillRaw.matchAll(/`\/([a-z][a-z0-9-]*)`/g)].map((m) => m[1])
  );
  const commandOrder = [];
  for (const cmd of commandTokens) {
    const rel = path.join("commands", `${cmd}.md`);
    if (!(await pathExists(path.join(REFERENCES_DIR, rel)))) {
      fail(`SKILL.md routes to /${cmd}, but references/${rel} does not exist.`);
    }
    commandOrder.push(rel);
  }

  // Build the flatten order: known top-level docs first, then any other
  // top-level docs alphabetically, then command files in the order SKILL.md
  // introduces them, then anything left over.
  const ordered = [];
  const seen = new Set();
  const add = (rel) => {
    if (refFiles.includes(rel) && !seen.has(rel)) {
      ordered.push(rel);
      seen.add(rel);
    }
  };

  for (const rel of TOP_LEVEL_ORDER) add(rel);
  for (const rel of refFiles) {
    if (!rel.includes(path.sep) && !seen.has(rel)) add(rel);
  }
  for (const rel of commandOrder) add(rel);
  for (const rel of refFiles) add(rel); // sweep up anything not yet added

  return { refFiles, ordered };
}

/** Copy SKILL.md (optionally renamed) + the references/ tree into destDir. */
async function copyTree(destDir, refFiles, skillRaw, entryName) {
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(path.join(destDir, entryName), skillRaw);
  let bytes = Buffer.byteLength(skillRaw);

  for (const rel of refFiles) {
    const src = path.join(REFERENCES_DIR, rel);
    const dest = path.join(destDir, "references", rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const contents = await fs.readFile(src);
    await fs.writeFile(dest, contents);
    bytes += contents.length;
  }
  return bytes;
}

/** Turn a reference path into a readable h2 heading. */
function sectionHeading(rel) {
  if (rel.startsWith(`commands${path.sep}`)) {
    const name = path.basename(rel, ".md");
    return `## References: ${name} command`;
  }
  const name = path.basename(rel, ".md");
  return `## References: ${name}`;
}

/** Build the flattened single-file variant for GitHub Copilot. */
async function buildFlattened(body, ordered) {
  const parts = [
    "<!-- Generated by scripts/build.js from SKILL.md + references/. Do not edit by hand. -->",
    "",
    body,
  ];

  for (const rel of ordered) {
    const contents = (await fs.readFile(path.join(REFERENCES_DIR, rel), "utf8")).trim();
    parts.push("", sectionHeading(rel), "", contents);
  }

  return parts.join("\n") + "\n";
}

async function main() {
  if (!(await pathExists(SKILL_PATH))) {
    fail(`SKILL.md not found at ${path.relative(ROOT, SKILL_PATH)}.`);
  }
  const skillRaw = await fs.readFile(SKILL_PATH, "utf8");
  const { body } = parseSkill(skillRaw);
  const { refFiles, ordered } = await validateAndOrderReferences(skillRaw);

  // Clean dist/ so reruns are deterministic.
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  console.log(`Building dist/ from SKILL.md + ${refFiles.length} reference files\n`);

  // Claude Code: .claude/skills/four-leaf-coach/
  const claudeDir = path.join(DIST_DIR, "claude-code", ".claude", "skills", SKILL_NAME);
  const claudeBytes = await copyTree(claudeDir, refFiles, skillRaw, "SKILL.md");
  console.log(`  claude-code  ${claudeBytes.toLocaleString()} bytes  (.claude/skills/${SKILL_NAME}/)`);

  // Cursor: .cursor/skills/four-leaf-coach/
  const cursorDir = path.join(DIST_DIR, "cursor", ".cursor", "skills", SKILL_NAME);
  const cursorBytes = await copyTree(cursorDir, refFiles, skillRaw, "SKILL.md");
  console.log(`  cursor       ${cursorBytes.toLocaleString()} bytes  (.cursor/skills/${SKILL_NAME}/)`);

  // Codex CLI: AGENTS.md + references/ alongside.
  const codexDir = path.join(DIST_DIR, "codex");
  const codexBytes = await copyTree(codexDir, refFiles, skillRaw, "AGENTS.md");
  console.log(`  codex        ${codexBytes.toLocaleString()} bytes  (AGENTS.md + references/)`);

  // GitHub Copilot: single flattened file.
  const flattened = await buildFlattened(body, ordered);
  const githubDir = path.join(DIST_DIR, "github", ".github");
  await fs.mkdir(githubDir, { recursive: true });
  await fs.writeFile(path.join(githubDir, "copilot-instructions.md"), flattened);
  console.log(
    `  github       ${Buffer.byteLength(flattened).toLocaleString()} bytes  (.github/copilot-instructions.md, ${ordered.length} sections inlined)`
  );

  console.log("\nBuild complete.");
}

main().catch((err) => fail(err.stack || String(err)));
