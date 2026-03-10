---
name: kimi-cli
description: Delegate tasks to Kimi CLI for front-end development, full-stack coding, and long-context code understanding. Powered by Moonshot AI's Kimi K2 model with extended context support.
---

## What is Kimi CLI

Kimi CLI is Moonshot AI's terminal-based autonomous coding agent. It leverages the Kimi K2 model with long-context support, reads and edits code, executes shell commands, and supports MCP tools integration.

## When to delegate to Kimi CLI

Use Kimi CLI when you need to:
- Build or modify front-end components (React, Vue, Svelte, etc.)
- Implement full-stack features end-to-end
- Work on tasks that benefit from long-context understanding
- Generate UI code from descriptions or mockups
- Perform front-end-specific tasks (styling, responsive design, accessibility)
- Work with MCP-connected tools and resources

## How to invoke Kimi CLI

### Non-interactive (recommended for delegation)

Kimi CLI accepts prompts via stdin pipe:

```bash
echo "YOUR PROMPT HERE" | kimi
```

### With specific model

```bash
echo "YOUR PROMPT" | kimi --model kimi-k2
```

### With MCP configuration

```bash
echo "YOUR PROMPT" | kimi --mcp-config-file ~/.config/kimi/mcp.json
```

## Important notes

- Install via `uv tool install --python 3.13 kimi-cli` (requires `uv` package manager)
- Authentication via `/login` command on first run (OAuth) or `KIMI_API_KEY` env var
- Non-interactive mode uses stdin pipe (not a `-p` flag like other tools)
- Kimi CLI creates an `AGENTS.md` project config (via `/init` command)
- Supports OpenAI-compatible API format
- Excels at front-end and UI-related coding tasks

## Delegation pattern

For front-end component creation:

```bash
RESULT=$(echo "Create a responsive navigation bar component using React and Tailwind CSS. It should have a logo, links (Home, About, Contact), a mobile hamburger menu, and dark mode toggle. Export as NavBar from src/components/NavBar.tsx" | kimi)
```

For full-stack features:

```bash
RESULT=$(echo "Implement a user profile page with the following: 1) React component at src/pages/Profile.tsx 2) API endpoint at src/api/profile.ts 3) Form for editing name, email, avatar. Use existing auth context from src/contexts/auth.tsx" | kimi)
```

For styling and accessibility:

```bash
RESULT=$(echo "Audit the components in src/components/ for accessibility issues. Fix any WCAG 2.1 AA violations. Add proper ARIA labels, keyboard navigation, and focus management." | kimi)
```
