#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { AGENTS, type SubAgent } from "./agents.js";

// ---------------------------------------------------------------------------
// Colours (inline – zero deps for fast npx cold-start)
// ---------------------------------------------------------------------------
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const magenta = (s: string) => `\x1b[35m${s}\x1b[0m`;
const bgGreen = (s: string) => `\x1b[42m\x1b[30m${s}\x1b[0m`;
const bgYellow = (s: string) => `\x1b[43m\x1b[30m${s}\x1b[0m`;
const bgRed = (s: string) => `\x1b[41m\x1b[37m${s}\x1b[0m`;

// ---------------------------------------------------------------------------
// Spinner utility (zero deps)
// ---------------------------------------------------------------------------
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function createSpinner(text: string) {
  let frame = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  return {
    start() {
      process.stdout.write("\x1b[?25l"); // hide cursor
      interval = setInterval(() => {
        const spinner = cyan(SPINNER_FRAMES[frame % SPINNER_FRAMES.length]);
        process.stdout.write(`\r  ${spinner} ${text}`);
        frame++;
      }, 80);
    },
    succeed(msg: string) {
      if (interval) clearInterval(interval);
      process.stdout.write(`\r  ${green("✔")} ${msg}\x1b[K\n`);
      process.stdout.write("\x1b[?25h"); // show cursor
    },
    fail(msg: string) {
      if (interval) clearInterval(interval);
      process.stdout.write(`\r  ${red("✖")} ${msg}\x1b[K\n`);
      process.stdout.write("\x1b[?25h"); // show cursor
    },
    stop() {
      if (interval) clearInterval(interval);
      process.stdout.write("\x1b[?25h"); // show cursor
      process.stdout.write("\x1b[K");
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Resolve template directory
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = resolve(__dirname, "..", "templates");

// ---------------------------------------------------------------------------
// CLI detection helpers
// ---------------------------------------------------------------------------
function isCommandAvailable(command: string): boolean {
  try {
    const cmd =
      process.platform === "win32"
        ? `where ${command}`
        : `which ${command}`;
    execSync(cmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function detectInstalledAgents(): Map<string, boolean> {
  const results = new Map<string, boolean>();
  for (const agent of AGENTS) {
    results.set(agent.id, isCommandAvailable(agent.detectCommand));
  }
  return results;
}

// ---------------------------------------------------------------------------
// File generation
// ---------------------------------------------------------------------------
function readTemplate(relativePath: string): string {
  const fullPath = join(TEMPLATES_DIR, relativePath);
  return readFileSync(fullPath, "utf-8");
}

function writeFile(targetDir: string, relativePath: string, content: string) {
  const fullPath = join(targetDir, relativePath);
  const dir = dirname(fullPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const existed = existsSync(fullPath);
  writeFileSync(fullPath, content, "utf-8");
  return existed ? "updated" : "created";
}

function generateOpencodeJson(
  targetDir: string,
  installedMap: Map<string, boolean>
): string {
  const existingPath = join(targetDir, "opencode.json");
  let existing: Record<string, unknown> = {};

  if (existsSync(existingPath)) {
    try {
      existing = JSON.parse(readFileSync(existingPath, "utf-8"));
    } catch {
      // If parse fails, start fresh
    }
  }

  // Build permission.skill entries
  const skillPerms: Record<string, string> = {
    "sdlc-orchestrator": "allow",
  };
  for (const agent of AGENTS) {
    skillPerms[agent.id] = "allow";
  }

  // Build custom commands for each agent
  const commands: Record<string, unknown> = {};
  for (const agent of AGENTS) {
    const installed = installedMap.get(agent.id);
    commands[`delegate-${agent.id}`] = {
      template: `Load the "${agent.id}" skill and delegate the following task to ${agent.name}: $ARGUMENTS`,
      description: `Delegate a task to ${agent.name}${installed ? "" : " (not installed)"}`,
    };
  }

  const config = {
    $schema: "https://opencode.ai/config.json",
    ...existing,
    permission: {
      ...(existing.permission as Record<string, unknown> | undefined),
      skill: {
        ...((existing.permission as Record<string, Record<string, string>>)
          ?.skill ?? {}),
        ...skillPerms,
      },
    },
    command: {
      ...(existing.command as Record<string, unknown> | undefined),
      ...commands,
      "delegate": {
        template:
          'Load the "sdlc-orchestrator" skill. Based on the task type, choose the best sub-agent CLI and delegate: $ARGUMENTS',
        description:
          "Auto-route a task to the best available sub-agent CLI",
      },
    },
    instructions: mergeInstructions(
      (existing.instructions as string[] | undefined) ?? [],
      []
    ),
  };

  return JSON.stringify(config, null, 2);
}

function mergeInstructions(
  existing: string[],
  additions: string[]
): string[] {
  const set = new Set([...existing, ...additions]);
  return [...set];
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------
function progressBar(current: number, total: number, width = 20): string {
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const pct = Math.round((current / total) * 100);
  return `${dim("[")}${green(bar)}${dim("]")} ${dim(`${pct}%`)}`;
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------
function printBanner() {
  const banner = `
  ${bold(cyan("╔══════════════════════════════════════════════════╗"))}
  ${bold(cyan("║"))}                                                  ${bold(cyan("║"))}
  ${bold(cyan("║"))}   ${bold("⚡ SDLC Sub-Agents")}                             ${bold(cyan("║"))}
  ${bold(cyan("║"))}   ${dim("Multi-Agent Orchestrator for OpenCode")}           ${bold(cyan("║"))}
  ${bold(cyan("║"))}                                                  ${bold(cyan("║"))}
  ${bold(cyan("╚══════════════════════════════════════════════════╝"))}
`;
  console.log(banner);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const targetDir = process.cwd();

  console.clear();
  printBanner();

  // ── Step 1: Detect installed CLIs ──────────────────────────────────────
  const stepSpinner = createSpinner("Scanning for installed coding agent CLIs...");
  stepSpinner.start();

  const installed = detectInstalledAgents();
  const found: SubAgent[] = [];
  const missing: SubAgent[] = [];

  for (const agent of AGENTS) {
    if (installed.get(agent.id)) {
      found.push(agent);
    } else {
      missing.push(agent);
    }
  }

  await sleep(800); // brief pause for visual effect
  stepSpinner.succeed(`Scanned ${bold(String(AGENTS.length))} coding agent CLIs`);
  console.log();

  // Print detection results with staggered output
  for (const agent of AGENTS) {
    const isInstalled = installed.get(agent.id);
    if (isInstalled) {
      console.log(
        `  ${green("●")} ${bold(agent.name)} ${dim(`(${agent.command})`)} ${green("installed")}`
      );
    } else {
      console.log(
        `  ${red("○")} ${bold(agent.name)} ${dim(`(${agent.command})`)} ${red("not found")}`
      );
    }
    await sleep(150); // staggered reveal
  }

  console.log();
  const summaryParts = [];
  if (found.length > 0)
    summaryParts.push(bgGreen(` ${found.length} found `));
  if (missing.length > 0)
    summaryParts.push(bgYellow(` ${missing.length} missing `));
  console.log(`  ${summaryParts.join("  ")}`);
  console.log();

  // ── Step 2: Write skill files ──────────────────────────────────────────
  const totalFiles = AGENTS.length + 1; // +1 for orchestrator
  let fileCount = 0;

  const skillsDir = ".agents/skills";
  const fileSpinner = createSpinner("Writing skill files...");
  fileSpinner.start();

  // Write orchestrator skill
  const orchestratorContent = readTemplate("skills/sdlc-orchestrator/SKILL.md");
  writeFile(targetDir, `${skillsDir}/sdlc-orchestrator/SKILL.md`, orchestratorContent);
  fileCount++;
  await sleep(200);

  // Write all agent skills
  for (const agent of AGENTS) {
    const content = readTemplate(`skills/${agent.id}/SKILL.md`);
    writeFile(targetDir, `${skillsDir}/${agent.id}/SKILL.md`, content);
    fileCount++;
    // Update spinner text with progress
    fileSpinner.stop();
    process.stdout.write(
      `\r  ${cyan(SPINNER_FRAMES[fileCount % SPINNER_FRAMES.length])} Writing skill files... ${progressBar(fileCount, totalFiles)}`
    );
    await sleep(200);
  }

  process.stdout.write(`\r\x1b[K`);
  console.log(`  ${green("✔")} Created ${bold(String(totalFiles))} skill files in ${cyan(skillsDir + "/")}`);
  console.log();

  // ── Step 3: Configure opencode.json ────────────────────────────────────
  const configSpinner = createSpinner("Configuring opencode.json...");
  configSpinner.start();

  const opencodeJson = generateOpencodeJson(targetDir, installed);
  const jsonResult = writeFile(targetDir, "opencode.json", opencodeJson);

  await sleep(500);
  configSpinner.succeed(`${jsonResult === "created" ? "Created" : "Updated"} ${cyan("opencode.json")} with permissions & commands`);

  // ── Summary ────────────────────────────────────────────────────────────
  console.log();
  console.log(
    `  ${bold(green("✔ Setup complete!"))}`
  );
  console.log();

  // Files created
  console.log(dim("  ─── Files Created ───────────────────────────────────"));
  console.log();
  console.log(`  ${cyan("📁 .agents/skills/")}`);
  console.log(`     ${dim("├──")} ${cyan("sdlc-orchestrator/")} ${dim("← master routing skill")}`);
  for (let i = 0; i < AGENTS.length; i++) {
    const agent = AGENTS[i];
    const isLast = i === AGENTS.length - 1;
    const prefix = isLast ? "└──" : "├──";
    const status = installed.get(agent.id)
      ? green("●")
      : yellow("○");
    console.log(
      `     ${dim(prefix)} ${status} ${cyan(`${agent.id}/`)} ${dim(`← ${agent.bestFor.split(",")[0].trim()}`)}`
    );
  }
  console.log();
  console.log(`  ${cyan("📄 opencode.json")} ${dim("← permissions + /delegate commands")}`);

  // Usage
  console.log();
  console.log(dim("  ─── Usage ───────────────────────────────────────────"));
  console.log();
  console.log(`  OpenCode auto-discovers skills and routes tasks to agents.`);
  console.log();
  console.log(`  ${bold("Commands:")}`);
  console.log(`    ${cyan("/delegate")} ${dim("............")} auto-route to best agent`);
  for (const agent of AGENTS) {
    const pad = ".".repeat(Math.max(1, 20 - agent.id.length));
    console.log(
      `    ${cyan(`/delegate-${agent.id}`)} ${dim(pad)} ${dim(agent.name)}`
    );
  }

  // Missing CLIs with install commands
  if (missing.length > 0) {
    console.log();
    console.log(dim("  ─── Install Missing CLIs ────────────────────────────"));
    console.log();
    for (const agent of missing) {
      console.log(`  ${yellow("▸")} ${bold(agent.name)}`);
      console.log(`    ${dim("$")} ${agent.installCommand}`);
      console.log();
    }
    console.log(
      dim("  Run this command again after installing to update detection.")
    );
  }

  console.log();
}

main().catch((err) => {
  process.stdout.write("\x1b[?25h"); // ensure cursor is shown on error
  console.error(red(`Error: ${err instanceof Error ? err.message : err}`));
  process.exit(1);
});
