<div align="center">

# SDLC Sub-Agents

### Turn OpenCode into a multi-agent orchestrator

**One command. Six coding agents. Zero config.**

[![npm version](https://img.shields.io/npm/v/sdlc-subagents?style=flat-square&color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/sdlc-subagents)
[![license](https://img.shields.io/npm/l/sdlc-subagents?style=flat-square&color=blue)](./LICENSE)
[![node](https://img.shields.io/node/v/sdlc-subagents?style=flat-square&color=417E38&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![zero deps](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](./package.json)

<br />

<img src="https://opencode.ai/favicon.ico" width="28" alt="OpenCode" />&nbsp;&nbsp;Built for [**OpenCode**](https://opencode.ai) — the open-source AI coding agent for the terminal

<br />

```
npx sdlc-subagents
```

<br />

[Quick Start](#-quick-start) · [Supported Agents](#-supported-agents) · [How It Works](#-how-it-works) · [Usage](#-usage-in-opencode) · [Install CLIs](#-installing-the-sub-agent-clis)

</div>

---

## The Problem

You have access to multiple AI coding agents — Gemini, Claude, Copilot, Aider, Kimi, Cursor — each with different strengths. But switching between them is manual, context is lost, and there's no unified workflow.

## The Solution

`sdlc-subagents` configures [OpenCode](https://opencode.ai) as a **meta-orchestrator** that knows when and how to delegate tasks to the right sub-agent CLI. It generates [Agent Skills](https://opencode.ai/docs/skills/) that teach OpenCode the strengths, invocation patterns, and routing logic for each agent.

```
                          ┌─────────────────┐
                          │    OpenCode      │
                          │  (orchestrator)  │
                          └────────┬────────┘
                                   │
             ┌──────────┬──────────┼──────────┬──────────┬──────────┐
             ▼          ▼          ▼          ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
         │ Gemini │ │Copilot │ │ Claude │ │ Aider  │ │  Kimi  │ │ Cursor │
         │  CLI   │ │  CLI   │ │  Code  │ │        │ │  CLI   │ │  CLI   │
         └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
          Research    GitHub    Refactor     Pair      Front-end   IDE-grade
          & Context  Workflows  & Debug    Programming  & UI      Prototyping
```

---

## Supported Agents

| Agent | CLI | Best For | Install |
|:------|:----|:---------|:--------|
| <img src="https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png" width="16" />&nbsp; [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `gemini` | Large codebase analysis, research, documentation | `npm i -g @google/gemini-cli` |
| <img src="https://github.githubassets.com/favicons/favicon-dark.svg" width="16" />&nbsp; [GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli) | `copilot` | PR creation, issue management, GitHub workflows | `npm i -g @github/copilot` |
| <img src="https://mintlify.s3.us-west-1.amazonaws.com/anthropic/logo/light.svg" width="16" />&nbsp; [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) | `claude` | Complex refactoring, architecture changes, debugging | `npm i -g @anthropic-ai/claude-code` |
| <img src="https://aider.chat/assets/icons/favicon-32x32.png" width="16" />&nbsp; [Aider](https://aider.chat) | `aider` | Pair programming, auto-commits, any LLM provider | `pipx install aider-chat` |
| <img src="https://raw.githubusercontent.com/nicepkg/gpt-runner/main/docs/public/logo.svg" width="16" />&nbsp; [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) | `kimi` | Front-end development, UI components, long-context | `uv tool install --python 3.13 kimi-cli` |
| <img src="https://cursor.sh/favicon.ico" width="16" />&nbsp; [Cursor CLI](https://cursor.sh) | `agent` | IDE-grade coding, cloud handoff, rapid prototyping | `curl https://cursor.sh/cli -fsS \| bash` |

---

## Quick Start

```bash
npx sdlc-subagents
```

That's it. No flags, no wizard, no config files to write. The tool will:

1. **Detect** which coding agent CLIs are installed on your system
2. **Generate** OpenCode skill files for all 6 agents (even uninstalled ones — install later)
3. **Create** `opencode.json` with permissions and `/delegate` custom commands
4. **Merge** safely into existing config (idempotent — re-run anytime)

### What gets created

```
your-project/
├── .agents/
│   └── skills/
│       ├── sdlc-orchestrator/SKILL.md   ← Master routing logic
│       ├── gemini-cli/SKILL.md          ← Gemini delegation patterns
│       ├── copilot-cli/SKILL.md         ← Copilot delegation patterns
│       ├── claude-code/SKILL.md         ← Claude delegation patterns
│       ├── aider/SKILL.md               ← Aider delegation patterns
│       ├── kimi-cli/SKILL.md            ← Kimi delegation patterns
│       └── cursor-cli/SKILL.md          ← Cursor delegation patterns
└── opencode.json                        ← Permissions + /delegate commands
```

---

## How It Works

Each generated skill file teaches OpenCode:

| Section | What it contains |
|:--------|:-----------------|
| **When to delegate** | Task types the agent excels at |
| **How to invoke** | Exact CLI commands for non-interactive use |
| **Delegation patterns** | Bash patterns for capturing output |
| **Important notes** | Auth requirements, flags, gotchas |

The master **`sdlc-orchestrator`** skill provides a routing table that maps task types to the best agent:

| Task Type | Routed To |
|:----------|:----------|
| Large codebase analysis, research, documentation | Gemini CLI |
| GitHub PRs, issues, code review, repo management | Copilot CLI |
| Complex refactoring, architecture changes, debugging | Claude Code |
| Incremental changes with git commits, multi-model | Aider |
| Front-end development, UI components, styling | Kimi CLI |
| IDE-grade coding, cloud handoff, rapid prototyping | Cursor CLI |

---

## Usage in OpenCode

After scaffolding, open your project with OpenCode. The skills are discovered automatically.

### Auto-routing — let OpenCode choose

```
/delegate Analyze the entire codebase and generate API documentation
```

> OpenCode reads the orchestrator skill, identifies this as a research/documentation task, and routes to **Gemini CLI**.

### Force a specific agent

```
/delegate-claude-code   Refactor the auth module to use strategy pattern
/delegate-copilot-cli   Create a PR for the current branch changes
/delegate-aider         Add input validation to all API endpoints
/delegate-kimi-cli      Build a responsive dashboard with Tailwind
/delegate-gemini-cli    Explain how the payment system works across all services
/delegate-cursor-cli    Prototype a new CLI tool for data migration
```

### Natural language — no commands needed

Just describe your task. OpenCode loads the orchestrator skill and routes automatically:

```
> Use Gemini to research how the payment system works across all microservices
> Have Claude refactor the database layer to use Prisma
> Ask Aider to add tests for the auth module, commit each test separately
```

### Multi-agent workflows

Chain agents for complex SDLC workflows:

```
1. /delegate-gemini-cli   Analyze the requirements and existing auth code
2. /delegate-claude-code  Implement the new OAuth2 flow based on Gemini's analysis
3. /delegate-kimi-cli     Build the login UI components
4. /delegate-aider        Add integration tests, commit each one
5. /delegate-copilot-cli  Create a PR with a detailed description
```

---

## Re-running

```bash
npx sdlc-subagents
```

Safe to run multiple times. It will:

- Update skill files with the latest templates
- Merge new config into existing `opencode.json` without overwriting your customizations
- Re-detect installed CLIs and update status

---

## Installing the Sub-Agent CLIs

Skills are generated for **all agents** regardless of installation status. Install any agent when you're ready:

```bash
# Gemini CLI — Google's 1M token context agent
npm install -g @google/gemini-cli

# GitHub Copilot CLI — GitHub-native workflow agent
npm install -g @github/copilot

# Claude Code — Anthropic's deep reasoning agent
npm install -g @anthropic-ai/claude-code

# Aider — Model-agnostic pair programmer
pipx install aider-chat

# Kimi CLI — Moonshot's long-context agent
uv tool install --python 3.13 kimi-cli

# Cursor CLI — IDE-grade terminal agent
curl https://cursor.sh/cli -fsS | bash
```

---

## Requirements

- **Node.js** >= 18
- **OpenCode** — [install from opencode.ai](https://opencode.ai)
- At least one sub-agent CLI installed (or install later)

---

## Contributing

Contributions are welcome! If you'd like to add support for a new coding agent CLI or improve the delegation skills, please open an issue or PR.

## License

[MIT](./LICENSE) — Roy Zalta
