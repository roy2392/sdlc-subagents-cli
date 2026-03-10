---
name: claude-code
description: Delegate tasks to Claude Code for complex refactoring, architecture-level changes, multi-file edits, in-depth code review, and debugging. Excels at deep reasoning about code structure.
---

## What is Claude Code

Claude Code is Anthropic's terminal-based coding agent. It reads entire codebases, performs multi-file edits, runs commands, manages git, and supports multi-agent workflows with sub-agent delegation.

## When to delegate to Claude Code

Use Claude Code when you need to:
- Perform complex multi-file refactoring
- Make architecture-level changes across a codebase
- Debug complex issues that require deep code understanding
- Conduct thorough code reviews with actionable feedback
- Implement features that span multiple files and modules
- Work on tasks that benefit from Claude's strong reasoning capabilities
- Review git diffs and provide structured feedback

## How to invoke Claude Code

### Non-interactive (recommended for delegation)

Use the `-p` flag for non-interactive print mode:

```bash
claude -p "YOUR PROMPT HERE"
```

### With structured output

```bash
claude -p "YOUR PROMPT" --output-format json
```

### Pipe input for review

```bash
git diff | claude -p "Review these changes for bugs and security issues"
```

### Resume last conversation

```bash
claude -c
```

### With specific model

```bash
claude -p "YOUR PROMPT" --model claude-sonnet-4-5
```

### Restrict available tools

```bash
claude -p "YOUR PROMPT" --allowedTools "read,grep,glob"
```

## Important notes

- Requires Claude Pro/Max subscription or `ANTHROPIC_API_KEY`
- The `-p` flag is essential for non-interactive use
- Supports `--output-format json` for machine-readable structured output
- Supports `--input-format stream-json` for pipeline integration
- Creates `CLAUDE.md` project config file (similar to AGENTS.md)
- Claude Code has its own sub-agent support - useful for breaking down complex tasks

## Delegation pattern

For code changes:

```bash
RESULT=$(claude -p "Refactor the authentication module in src/auth/ to use the strategy pattern. Maintain backward compatibility with existing tests. Return a summary of changes made.")
```

For code review:

```bash
RESULT=$(git diff main..HEAD | claude -p "Review these changes. Focus on: 1) Security vulnerabilities 2) Performance regressions 3) API contract changes. Output as structured markdown." --output-format text)
```

For debugging:

```bash
RESULT=$(claude -p "The test in tests/auth.test.ts is failing with error: [ERROR]. Investigate the root cause and fix it. Return the fix as a diff.")
```
