# sdlc-subagents

Configure [OpenCode](https://opencode.ai) as an orchestrator of multiple coding agent CLIs.

Run one command and your OpenCode agent learns how to delegate tasks to the right sub-agent CLI based on the task type.

## Supported Sub-Agents

| Agent | Command | Best For |
|-------|---------|----------|
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `gemini` | Context engineering, large codebase analysis, research |
| [GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli) | `copilot` | PR creation, issue management, GitHub workflows |
| [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) | `claude` | Complex refactoring, architecture changes, debugging |
| [Aider](https://aider.chat) | `aider` | Pair programming, auto-commits, any LLM provider |
| [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) | `kimi` | Front-end development, UI components, long-context |
| [Cursor CLI](https://cursor.sh) | `agent` | IDE-grade coding, cloud handoff, rapid prototyping |

## Quick Start

```bash
npx sdlc-subagents
```

That's it. The tool will:

1. **Detect** which coding agent CLIs are installed on your system
2. **Generate** OpenCode skill files (`.agents/skills/*/SKILL.md`) for each agent
3. **Configure** `opencode.json` with permissions and `/delegate` commands

## What Gets Created

```
your-project/
  .agents/
    skills/
      sdlc-orchestrator/SKILL.md    # Master routing skill
      gemini-cli/SKILL.md           # Gemini CLI delegation
      copilot-cli/SKILL.md          # GitHub Copilot delegation
      claude-code/SKILL.md          # Claude Code delegation
      aider/SKILL.md                # Aider delegation
      kimi-cli/SKILL.md             # Kimi CLI delegation
      cursor-cli/SKILL.md           # Cursor CLI delegation
  opencode.json                     # Permissions + custom commands
```

## Usage in OpenCode

After running `npx sdlc-subagents`, open your project with OpenCode. The agent will automatically discover the skills.

### Auto-routing

Ask OpenCode to delegate and it will pick the best agent:

```
/delegate Analyze the entire codebase and generate API documentation
```

OpenCode routes this to Gemini CLI (large context + research).

### Force a specific agent

```
/delegate-claude-code Refactor the auth module to use strategy pattern
/delegate-copilot-cli Create a PR for the current branch changes
/delegate-aider Add input validation to all API endpoints
/delegate-kimi-cli Build a responsive dashboard with Tailwind
```

### Natural language

You don't even need the commands. Just describe your task and OpenCode will load the orchestrator skill and route to the right agent:

```
> Use Gemini to research how the payment system works across all microservices
> Have Claude refactor the database layer to use Prisma
> Ask Aider to add tests for the auth module, commit each test separately
```

## How It Works

The tool generates [OpenCode Agent Skills](https://opencode.ai/docs/skills/) - markdown files that teach OpenCode when and how to delegate to each sub-agent CLI.

Each skill contains:
- **When to delegate**: Task types the agent excels at
- **How to invoke**: Exact CLI commands for non-interactive use
- **Delegation patterns**: Copy-paste bash patterns for capturing output
- **Important notes**: Auth requirements, flags, gotchas

The master `sdlc-orchestrator` skill provides a routing table that maps task types to the recommended agent.

## Re-running

Running `npx sdlc-subagents` again is safe. It will:
- Update skill files with latest templates
- Merge new config into existing `opencode.json` (preserves your customizations)
- Re-detect installed CLIs

## Installing the Sub-Agent CLIs

The tool works even if not all CLIs are installed - it scaffolds skills for all agents so you can install them later. Install commands:

```bash
# Gemini CLI
npm install -g @google/gemini-cli

# GitHub Copilot CLI
npm install -g @github/copilot

# Claude Code
npm install -g @anthropic-ai/claude-code

# Aider
pipx install aider-chat

# Kimi CLI
uv tool install --python 3.13 kimi-cli

# Cursor CLI
curl https://cursor.sh/cli -fsS | bash
```

## License

MIT
