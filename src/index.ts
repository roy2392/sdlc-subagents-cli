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
// Main
// ---------------------------------------------------------------------------
async function main() {
  const targetDir = process.cwd();

  console.log();
  console.log(
    bold("  SDLC Sub-Agents") +
      dim(" — Configure OpenCode as an orchestrator of coding agent CLIs")
  );
  console.log();

  // 1. Detect installed CLIs
  console.log(dim("  Detecting installed coding agent CLIs..."));
  console.log();

  const installed = detectInstalledAgents();
  const found: SubAgent[] = [];
  const missing: SubAgent[] = [];

  for (const agent of AGENTS) {
    if (installed.get(agent.id)) {
      found.push(agent);
      console.log(
        `  ${green("+")} ${bold(agent.name)} ${dim(`(${agent.command})`)}`
      );
    } else {
      missing.push(agent);
      console.log(
        `  ${red("-")} ${bold(agent.name)} ${dim("not found")} ${dim(`— install: ${agent.installCommand}`)}`
      );
    }
  }

  console.log();
  console.log(
    `  ${green(String(found.length))} detected, ${yellow(String(missing.length))} not found`
  );
  console.log();

  // 2. Write skill files
  console.log(dim("  Writing skill files..."));

  const skillsDir = ".agents/skills";

  // Write orchestrator skill (always)
  const orchestratorContent = readTemplate(
    "skills/sdlc-orchestrator/SKILL.md"
  );
  const orchResult = writeFile(
    targetDir,
    `${skillsDir}/sdlc-orchestrator/SKILL.md`,
    orchestratorContent
  );
  console.log(
    `  ${green("+")} ${orchResult} ${cyan(`${skillsDir}/sdlc-orchestrator/SKILL.md`)}`
  );

  // Write all agent skills (even for missing CLIs — user may install later)
  for (const agent of AGENTS) {
    const content = readTemplate(`skills/${agent.id}/SKILL.md`);
    const result = writeFile(
      targetDir,
      `${skillsDir}/${agent.id}/SKILL.md`,
      content
    );
    const status = installed.get(agent.id)
      ? green("+")
      : yellow("~");
    console.log(
      `  ${status} ${result} ${cyan(`${skillsDir}/${agent.id}/SKILL.md`)}`
    );
  }

  // 3. Write/update opencode.json
  console.log();
  console.log(dim("  Configuring opencode.json..."));

  const opencodeJson = generateOpencodeJson(targetDir, installed);
  const jsonResult = writeFile(targetDir, "opencode.json", opencodeJson);
  console.log(`  ${green("+")} ${jsonResult} ${cyan("opencode.json")}`);

  // 4. Summary
  console.log();
  console.log(bold("  Done!") + " Your project is now configured.");
  console.log();
  console.log(dim("  What was created:"));
  console.log(
    `  ${dim("1.")} ${cyan(`${skillsDir}/sdlc-orchestrator/SKILL.md`)} ${dim("— master routing skill")}`
  );
  for (const agent of AGENTS) {
    console.log(
      `  ${dim("  ")} ${cyan(`${skillsDir}/${agent.id}/SKILL.md`)} ${dim(`— ${agent.bestFor.split(",")[0]}`)}`
    );
  }
  console.log(
    `  ${dim("2.")} ${cyan("opencode.json")} ${dim("— permissions + /delegate commands")}`
  );

  console.log();
  console.log(bold("  Usage in OpenCode:"));
  console.log(
    `  ${dim(">")} OpenCode will automatically discover the skills and`
  );
  console.log(
    `    know how to delegate to each sub-agent based on task type.`
  );
  console.log();
  console.log(`  ${dim(">")} You can also use custom commands:`);
  console.log(
    `    ${cyan("/delegate")} ${dim("auto-route to best agent")}`
  );
  for (const agent of AGENTS) {
    console.log(
      `    ${cyan(`/delegate-${agent.id}`)} ${dim(`force ${agent.name}`)}`
    );
  }

  if (missing.length > 0) {
    console.log();
    console.log(yellow("  Missing CLIs (install when ready):"));
    for (const agent of missing) {
      console.log(`    ${dim("$")} ${agent.installCommand}`);
    }
  }

  console.log();
}

main().catch((err) => {
  console.error(red(`Error: ${err instanceof Error ? err.message : err}`));
  process.exit(1);
});
