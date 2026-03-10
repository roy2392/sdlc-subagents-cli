---
name: cursor-cli
description: Delegate tasks to Cursor CLI (agent command) for IDE-grade coding in the terminal, cloud agent handoff for long-running tasks, and rapid prototyping with multi-model support.
---

## What is Cursor CLI

Cursor CLI brings the full Cursor IDE agent experience to the terminal. It supports cloud agent handoff (start locally, continue remotely), works with any model in your Cursor subscription, and provides the same powerful coding capabilities as the Cursor editor.

## When to delegate to Cursor CLI

Use Cursor CLI when you need to:
- Perform IDE-grade code generation and editing from the terminal
- Hand off long-running tasks to cloud agents
- Rapidly prototype features with multi-model support
- Work on tasks that benefit from Cursor's proprietary model routing
- Use plan mode to get implementation strategies before coding
- Run background coding tasks while you work on other things

## How to invoke Cursor CLI

### Non-interactive (recommended for delegation)

Use the `-p` flag for non-interactive print mode:

```bash
agent -p "YOUR PROMPT HERE"
```

### With cloud handoff (long-running tasks)

```bash
agent -p "YOUR PROMPT" -c --cloud
```

### With specific model

```bash
agent -p "YOUR PROMPT" --model gpt-5.2
```

### Plan mode (get strategy without making changes)

```bash
agent -p "YOUR PROMPT" --mode=plan
```

### Ask mode (answer questions without changes)

```bash
agent -p "YOUR PROMPT" --mode=ask
```

### Full agent mode (default - makes changes)

```bash
agent -p "YOUR PROMPT" --mode=agent
```

### List active/previous sessions

```bash
agent ls
```

### Resume a previous session

```bash
agent resume
```

## Important notes

- Install via `curl https://cursor.sh/cli -fsS | bash`
- Requires a Cursor subscription for authentication
- The CLI command is `agent` (NOT `cursor`)
- Still in beta - some features may change
- The `-p` flag is essential for non-interactive use
- Cloud mode (`-c` or `--cloud`) hands off to remote agents - useful for long tasks
- Supports `--output-format text` for clean output capture

## Delegation pattern

For rapid prototyping:

```bash
RESULT=$(agent -p "Create a complete CRUD API for a blog post system using Express.js and TypeScript. Include routes, controllers, types, and basic validation. Structure files under src/api/posts/")
```

For planning before implementation:

```bash
PLAN=$(agent -p "How should I implement real-time notifications in this Next.js app? Consider WebSocket vs SSE, database design, and component architecture." --mode=plan)
```

For cloud-delegated long tasks:

```bash
agent -p "Migrate the entire test suite from Jest to Vitest. Update all config files, test utilities, and mocks. Ensure all tests pass." -c --cloud
```
