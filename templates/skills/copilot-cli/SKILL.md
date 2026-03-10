---
name: copilot-cli
description: Delegate tasks to GitHub Copilot CLI for GitHub workflow automation, PR creation and review, issue management, and repository operations. Deeply integrated with GitHub's ecosystem.
---

## What is GitHub Copilot CLI

GitHub Copilot CLI is GitHub's agentic coding tool for the terminal. It provides deep integration with GitHub workflows including pull requests, issues, code review, and repository management alongside standard coding capabilities.

## When to delegate to Copilot CLI

Use GitHub Copilot CLI when you need to:
- Create, review, or manage pull requests
- Manage GitHub issues (create, update, close, label)
- Perform code review with GitHub-native feedback
- Automate GitHub repository operations (branch management, releases)
- Generate PR descriptions from code changes
- Push changes and create PRs in a single flow using `/delegate`
- Work with GitHub Actions workflows

## How to invoke Copilot CLI

### Non-interactive (recommended for delegation)

```bash
copilot --prompt "YOUR PROMPT HERE"
```

### Auto-approve all operations

```bash
copilot --prompt "YOUR PROMPT" --allow-all
```

### Delegate changes as a PR

Inside Copilot CLI, the `/delegate` command pushes changes as a PR to a remote repo. For non-interactive use:

```bash
copilot --prompt "Make the following changes and create a PR: [DESCRIPTION]" --allow-all
```

## Important notes

- Requires a GitHub Copilot subscription (Pro, Pro+, Business, or Enterprise)
- Authentication is via GitHub account (`/login` on first run)
- The older `gh copilot` extension was deprecated in Oct 2025 - use the standalone `copilot` command
- Requires Node.js v22+
- Copilot CLI has native access to GitHub API - no need for `gh` CLI separately

## Delegation pattern

When delegating GitHub-related tasks to Copilot CLI:

```bash
RESULT=$(copilot --prompt "Review the current branch changes and create a PR with title '[TITLE]' and description covering: [ASPECTS TO COVER]" --allow-all)
```

For read-only operations (e.g., listing issues):

```bash
RESULT=$(copilot --prompt "List all open issues labeled 'bug' in this repository. Return them as a markdown table with columns: number, title, assignee, created date.")
```
