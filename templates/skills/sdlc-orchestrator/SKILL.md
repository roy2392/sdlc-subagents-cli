---
name: sdlc-orchestrator
description: Orchestrate multiple coding agent CLIs as sub-agents. Load this skill to understand which coding agent CLI to delegate tasks to based on task type (front-end, context engineering, GitHub workflows, refactoring, pair programming, rapid prototyping).
---

## SDLC Sub-Agent Orchestration

You have access to multiple coding agent CLIs that you can delegate tasks to via the Bash tool. Each agent has different strengths. Use the `skill` tool to load the specific agent's skill for detailed invocation instructions.

## Agent Routing Table

| Task Type | Recommended Agent | Skill to Load |
|-----------|-------------------|---------------|
| Large codebase analysis, research, documentation | Gemini CLI | `gemini-cli` |
| GitHub PRs, issues, code review, repo management | Copilot CLI | `copilot-cli` |
| Complex refactoring, architecture changes, debugging | Claude Code | `claude-code` |
| Incremental changes with git commits, multi-model | Aider | `aider` |
| Front-end development, UI components, styling | Kimi CLI | `kimi-cli` |
| IDE-grade coding, cloud handoff, rapid prototyping | Cursor CLI | `cursor-cli` |

## How to delegate

1. **Identify the task type** from the user's request
2. **Load the specific agent skill** using the `skill` tool (e.g., `skill({ name: "gemini-cli" })`)
3. **Follow the delegation pattern** described in that skill
4. **Execute via Bash** using the agent's non-interactive mode
5. **Process the output** and continue your work

## Quick reference for non-interactive invocation

```
gemini -p "PROMPT"                    # Gemini CLI
copilot --prompt "PROMPT"             # GitHub Copilot CLI
claude -p "PROMPT"                    # Claude Code
aider --message "PROMPT" --yes        # Aider
echo "PROMPT" | kimi                  # Kimi CLI
agent -p "PROMPT"                     # Cursor CLI
```

## Multi-agent workflows

You can chain multiple agents for complex SDLC workflows:

1. **Research phase**: Use Gemini CLI to analyze requirements and existing code
2. **Implementation phase**: Use Claude Code or Aider for the actual coding
3. **Front-end phase**: Use Kimi CLI for UI components
4. **Review phase**: Use Copilot CLI to create PRs with review
5. **Iteration phase**: Use Aider for incremental fixes based on review feedback

## Important rules

- Always check if the target CLI is available before delegating (use `which <command>`)
- Use non-interactive mode to capture output - never launch interactive sessions
- If a CLI is not installed, inform the user and provide the install command
- Prefer delegating to the agent best suited for the task type
- Capture output using command substitution: `RESULT=$(command)`
- If a task is simple enough for you to handle directly, don't delegate - only delegate complex or specialized tasks
