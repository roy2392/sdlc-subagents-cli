export interface SubAgent {
  id: string;
  name: string;
  command: string;
  installCommand: string;
  description: string;
  bestFor: string;
  nonInteractiveFlag: string;
  detectCommand: string;
  env?: string[];
}

export const AGENTS: SubAgent[] = [
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    command: "gemini",
    installCommand: "npm install -g @google/gemini-cli",
    description:
      "Google's Gemini coding agent with 1M token context window, built-in Google Search grounding, and generous free tier",
    bestFor:
      "Context engineering, large codebase analysis, research-heavy tasks, documentation generation",
    nonInteractiveFlag: '-p "PROMPT"',
    detectCommand: "gemini",
    env: ["GOOGLE_API_KEY"],
  },
  {
    id: "copilot-cli",
    name: "GitHub Copilot CLI",
    command: "copilot",
    installCommand: "npm install -g @github/copilot",
    description:
      "GitHub's agentic coding CLI deeply integrated with GitHub workflows - PRs, issues, code review",
    bestFor:
      "GitHub workflow automation, PR creation and review, issue management, repository operations",
    nonInteractiveFlag: '--prompt "PROMPT"',
    detectCommand: "copilot",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    command: "claude",
    installCommand: "npm install -g @anthropic-ai/claude-code",
    description:
      "Anthropic's terminal coding agent with deep agentic capabilities, multi-file editing, and sub-agent support",
    bestFor:
      "Complex refactoring, architecture-level changes, multi-file edits, code review, debugging",
    nonInteractiveFlag: '-p "PROMPT"',
    detectCommand: "claude",
    env: ["ANTHROPIC_API_KEY"],
  },
  {
    id: "aider",
    name: "Aider",
    command: "aider",
    installCommand: "pipx install aider-chat",
    description:
      "Model-agnostic AI pair programming tool that works with any LLM and auto-commits changes to git",
    bestFor:
      "Pair programming, incremental changes with auto-commits, working with any LLM provider, architect mode for complex changes",
    nonInteractiveFlag: '--message "PROMPT" --yes',
    detectCommand: "aider",
    env: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"],
  },
  {
    id: "kimi-cli",
    name: "Kimi CLI",
    command: "kimi",
    installCommand: "uv tool install --python 3.13 kimi-cli",
    description:
      "Moonshot AI's terminal coding agent with long-context support via Kimi K2 model and MCP integration",
    bestFor:
      "Front-end development, full-stack tasks, long-context code understanding",
    nonInteractiveFlag: "stdin pipe",
    detectCommand: "kimi",
    env: ["KIMI_API_KEY"],
  },
  {
    id: "cursor-cli",
    name: "Cursor CLI",
    command: "agent",
    installCommand: "curl https://cursor.sh/cli -fsS | bash",
    description:
      "Cursor's terminal agent with full IDE-grade capabilities, cloud handoff, and multi-model support",
    bestFor:
      "IDE-grade coding in terminal, cloud agent delegation, rapid prototyping",
    nonInteractiveFlag: '-p "PROMPT"',
    detectCommand: "agent",
  },
];
