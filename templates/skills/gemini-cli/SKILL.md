---
name: gemini-cli
description: Delegate tasks to Gemini CLI for context engineering, large codebase analysis, research-heavy coding tasks, and documentation generation. Gemini has a 1M token context window and built-in Google Search grounding.
---

## What is Gemini CLI

Gemini CLI is Google's agentic coding tool for the terminal. It leverages Gemini models with up to 1M tokens of context, built-in Google Search grounding, and can read/edit files, run shell commands, and fetch web content.

## When to delegate to Gemini CLI

Use Gemini CLI when you need to:
- Analyze very large codebases or files that exceed your context window
- Research external APIs, libraries, or frameworks using Google Search grounding
- Generate documentation from large amounts of source code
- Perform context engineering tasks that benefit from massive context windows
- Cross-reference multiple large files simultaneously
- Understand complex dependency trees across an entire monorepo

## How to invoke Gemini CLI

### Non-interactive (recommended for delegation)

Use the `-p` flag for non-interactive execution. The agent will run the prompt, produce output, and exit:

```bash
gemini -p "YOUR PROMPT HERE"
```

### With specific model

```bash
gemini -p "YOUR PROMPT" -m gemini-2.5-pro
```

### With all project files in context

```bash
gemini -p "YOUR PROMPT" -a
```

### Auto-approve all tool calls (use with caution)

```bash
gemini -p "YOUR PROMPT" --yolo
```

## Important notes

- Gemini CLI requires authentication via Google account (free tier: 60 req/min, 1000/day) or `GOOGLE_API_KEY` env var
- The `-p` flag is essential for non-interactive use - without it, Gemini enters interactive mode
- Output from `-p` mode goes to stdout and can be captured
- Gemini CLI creates a `GEMINI.md` project config file (similar to AGENTS.md)
- For sandboxed execution, use `-s` flag (requires Docker)

## Delegation pattern

When delegating to Gemini CLI, structure your bash command like this:

```bash
RESULT=$(gemini -p "Analyze the following codebase concern: [SPECIFIC TASK]. Focus on [SPECIFIC ASPECTS]. Return your analysis as structured markdown.")
```

Then use the captured output to continue your work.
