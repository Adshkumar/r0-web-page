---
title: Run and test a project
description: Use r0's integrated terminal to start, build, and verify your project.
category: guides
order: 4
---

# Run and test a project

The integrated terminal lets you run the commands your project already uses without leaving the workspace. r0 does not choose the correct commands for every repository, so check its README and package or build configuration before running anything.

## Start in the project root

Open the folder that contains the project's main manifest or README. Open the integrated terminal using the workspace control or the default `Ctrl+J` shortcut, then confirm the terminal is in the expected directory:

```bash
pwd
```

On Windows PowerShell, use `Get-Location` instead. If the terminal opened elsewhere, change to the project directory before running commands.

## Find the project's commands

Look for the commands documented by the project. Common examples include:

```bash
npm run dev
npm test
npm run build
```

For a Rust project, the project may document commands such as:

```bash
cargo test
cargo build
```

These are examples, not universal instructions. Use the project's own scripts, toolchain, environment setup, and test instructions. Do not install packages or run elevated commands just because an error message suggests doing so; first understand what the project needs.

## Read command output

1. Run one relevant command at a time.
2. Wait for it to finish and read the complete output, including the exit status.
3. Fix the first actionable error, then rerun the same check.
4. If a development server starts successfully, keep that terminal session open while you work.
5. Stop a running process using its documented shutdown command or the terminal's supported stop control.

If a command fails, copy only the relevant error into an AI prompt and remove tokens, private paths, and other sensitive information.

## Verify your change

Choose a check that exercises what changed: a focused test for a small code change, a type-check or lint for affected code, or a full build for broad changes. Review the output and inspect the final diff in Source Control. See [Review, commit, and push with Git](/docs/guides/git-workflow) when the change is ready to save in version control.
