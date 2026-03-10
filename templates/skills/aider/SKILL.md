---
name: aider
description: Delegate tasks to Aider for AI pair programming with auto-git-commits, model-agnostic LLM support, and architect mode for complex changes. Works with any LLM provider.
---

## What is Aider

Aider is a model-agnostic AI pair programming tool for the terminal. It works with any LLM (OpenAI, Anthropic, DeepSeek, local models via Ollama), automatically commits every change to git with descriptive messages, and supports an architect mode where one model plans and another edits.

## When to delegate to Aider

Use Aider when you need to:
- Make incremental code changes with automatic git commits for each step
- Work with a specific LLM that other tools don't support (e.g., DeepSeek, local Ollama models)
- Use architect mode to have one model plan changes and another implement them
- Pair program on a specific set of files
- Make changes that should be individually tracked in git history
- Work with repositories where you want fine-grained commit history of AI changes

## How to invoke Aider

### Non-interactive (recommended for delegation)

Use `--message` with `--yes` for fully non-interactive execution:

```bash
aider --message "YOUR PROMPT HERE" --yes
```

### With specific model

```bash
aider --message "YOUR PROMPT" --yes --model sonnet
```

### With architect mode (plan + implement split)

```bash
aider --message "YOUR PROMPT" --yes --architect --model o3-mini --editor-model sonnet
```

### With specific files in context

```bash
aider --message "YOUR PROMPT" --yes --file src/auth.ts --file src/types.ts
```

### With read-only context files

```bash
aider --message "YOUR PROMPT" --yes --file src/auth.ts --read docs/api-spec.md
```

### Dry run (preview changes without applying)

```bash
aider --message "YOUR PROMPT" --yes --dry-run
```

### Disable auto-git-commit

```bash
aider --message "YOUR PROMPT" --yes --no-git
```

## Important notes

- Requires API keys via environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) or `--api-key` flag
- By default, Aider auto-commits every change to git with a descriptive message
- The `--yes` flag is essential for non-interactive use (auto-confirms all prompts)
- Aider exits after completing the `--message` task
- Architect mode (`--architect`) is powerful for complex changes: one model reasons about the approach, another implements
- Use `--file` to explicitly add files to context (otherwise Aider uses its own heuristics)
- Use `--no-stream` if you want to capture complete output

## Delegation pattern

For targeted file changes:

```bash
aider --message "Add input validation to the createUser function in src/users.ts. Validate email format and password strength. Add corresponding tests." --yes --file src/users.ts --file tests/users.test.ts
```

For architect-mode complex changes:

```bash
aider --message "Migrate the database layer from raw SQL to Prisma ORM. Update all repository files accordingly." --yes --architect --model o3-mini --editor-model sonnet
```

For changes with specific LLM:

```bash
aider --message "Optimize the rendering performance of the dashboard component" --yes --model deepseek --file src/components/Dashboard.tsx
```
