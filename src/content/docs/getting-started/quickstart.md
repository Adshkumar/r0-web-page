---
title: First steps with r0
description: Open a project, edit files, work with AI agents, and run your development workflow.
category: getting-started
order: 2
---

# First steps with r0

This guide walks through a typical project workflow in r0. Panel names and available integrations can differ between versions, so use the controls shown in your installed build.

## 1. Open a project folder

Start r0 and choose the action to open a folder or project. Select the root directory of an existing project—not just an individual source file. The project tree in the file explorer shows its files and folders.

If you are starting from scratch, create or choose an empty folder on your computer, then open that folder in r0. Keeping the project in one root folder makes it easier to browse files, use the integrated terminal, and work with Git.

## 2. Browse, create, and organize files

Use the file explorer to move through the project tree. Select a file to open it in the editor. To add project content, use the explorer's new-file or new-folder action if available in your build:

1. Select the parent folder where the new item belongs.
2. Choose **New File** or **New Folder**.
3. Enter a descriptive name, including the file extension when creating a file (for example, `README.md` or `src/main.rs`).
4. Open the new file and add the content it needs.

To reorganize work, move files into the appropriate project folder using the controls available in your build or your operating system's file manager. Avoid renaming or moving configuration files unless you understand how the project uses them.

## 3. Edit and understand code

Make changes in the editor and save them. Language support, diagnostics, and navigation depend on the languages and tools configured for the project. Use workspace search to find related code before making a broad change. The [keyboard shortcut reference](/docs/reference/keyboard-shortcuts) lists r0's default Windows and Linux bindings.

## 4. Work with an AI coding agent

If an AI provider or agent is enabled in your installation, open the agent interface and complete the provider setup required by that integration. Then use a focused request:

1. **Give context.** Name the relevant file, folder, feature, or error and explain what the project is supposed to do.
2. **State the task and boundaries.** For example: “Add validation to the signup form in `src/forms/signup.ts`. Keep the existing API and do not change unrelated files.”
3. **Ask for a plan for larger work.** Confirm the files and behavior to change before requesting a multi-file implementation.
4. **Review proposed changes.** Read every modified file and inspect the diff. Accept, revise, or reject the changes using the controls available in your build.
5. **Verify the result.** Ask the agent what it changed, then run the project's relevant tests, lint, or build in the integrated terminal.

Treat agent output as a proposed change, not an authority. Check behavior, errors, dependencies, and generated files yourself. Do not provide passwords, access tokens, private keys, or other secrets in prompts.

### Example requests

**Understand before editing**

> Explain how the settings page loads and saves preferences. Do not change any files yet.

**Make a focused code change**

> Add an empty-state message to the project list when there are no projects. Reuse the existing styles and limit the change to the relevant component.

**Create a small feature**

> Add a `src/utils/format-date.ts` helper that formats dates using the project's existing conventions. Add or update focused tests, and list the files you changed.

**Review a change**

> Review the current diff for bugs or missing edge cases. Do not edit files; report findings with file names and line references.

## 5. Run the project

Open the integrated terminal and run the commands documented by the project, such as its development, build, or test command. Commands vary by project; check its README or package/tool configuration rather than guessing. Read command output and fix reported errors before relying on a successful-looking UI.

## 6. Review and save Git changes

For a Git project, open Source Control to review modified, added, or deleted files. Inspect the diffs, stage only related files, and create a commit with a message that describes the change. Push or sync if your build provides the action; otherwise use the integrated terminal or your preferred Git client. Follow the [Git workflow guide](/docs/guides/git-workflow) and keep secrets and unrelated files out of commits.

## 7. Personalize the workspace

Explore themes, extensions, and the other tools available in your installation. Feature availability and provider setup can vary by release. Check the [project README](https://github.com/Adshkumar/r0#readme) and [latest release notes](https://github.com/Adshkumar/r0/releases/latest) for current product details.
