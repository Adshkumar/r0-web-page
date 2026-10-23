---
title: Working with AI in r0
description: Give coding agents useful context, review their edits, and verify the result.
category: guides
order: 1
---

# Working with AI in r0

r0 can bring supported AI coding agents into the same workspace as your project. Which providers and actions are available depends on your version and provider setup. Check the current [r0 README](https://github.com/Adshkumar/r0#readme) and the provider's instructions before connecting an account.

## Prepare the workspace

1. Open the project root in r0 so the agent has the right project context.
2. Check that the project opens normally and note the relevant files or behavior.
3. Open the agent interface provided by your installed version and complete its setup.
4. If the task is large or unclear, first ask the agent to explain the relevant code or propose a plan without editing files.

Do not paste API keys, passwords, private keys, access tokens, customer data, or other secrets into prompts. Follow your organization's data-handling rules.

## Write a useful request

Describe the goal, where the change belongs, what must stay unchanged, and how you will verify it. A useful structure is:

> In `[file or area]`, [desired behavior]. Keep [existing behavior or boundaries]. Do not change [out-of-scope area]. Run [relevant test or check] and summarize the files changed.

For example:

> In `src/settings/`, add validation so the display name cannot be empty. Keep the current settings format and styling. Do not modify unrelated settings. Add or update focused tests and summarize the changed files.

For multi-file work, ask for a plan first. Correct misunderstandings before asking the agent to implement the plan.

## Ask an agent to create or edit files

Be explicit about file paths and whether the agent should create a new file, update an existing one, or leave a file untouched. For example:

> Create `src/utils/format-date.ts` using the project's existing TypeScript style. Add a focused test in the existing test location. Do not add dependencies. Explain how to run the test.

For a new folder, state its purpose and the files expected inside it:

> Create a `src/components/empty-state/` folder for the project list's empty state. Add the component and keep styles consistent with neighboring components. Do not move existing files.

The agent may propose edits, create files, or show reviewable changes depending on the integration. Inspect each path and diff in r0 before accepting the result. Confirm that new files are in the intended folder and that no unrelated files changed.

## Review agent changes

Before keeping a generated change:

1. Read the complete diff, including new files.
2. Check that it matches the request and does not remove existing behavior.
3. Look for hard-coded secrets, unsafe defaults, unnecessary dependencies, and unrelated formatting changes.
4. Ask the agent to explain non-obvious decisions or revise a specific part if needed.
5. Run the project's relevant tests, lint, type-check, or build in the integrated terminal.
6. Review the resulting Git status and diff again.

Do not assume generated code is correct because an agent says it is complete. If the change is wrong, use the review controls available in your version to reject or revert it, or ask the agent for a targeted correction.

## Example prompts

**Explain code without editing**

> Trace how this project loads its configuration. Explain the relevant files and possible failure cases. Do not change files.

**Implement a focused feature**

> Add an empty-state message to the project list when there are no projects. Reuse existing components and styles. Limit changes to the project-list UI and its tests.

**Debug an error**

> Investigate this error: `[paste the relevant error without secrets]`. Identify the likely cause and the smallest safe fix. Explain your findings before editing.

**Review a diff**

> Review the current changes for bugs, regressions, and missing edge cases. Do not edit files. List findings by severity with file paths and line references.

## Keep your workflow in control

Use small, reviewable requests. Keep unrelated changes in separate tasks and commits. Use Source Control to inspect what changed, then run the project's checks yourself. Provider behavior, approval controls, and agent editing features are release-specific; consult the current [project README](https://github.com/Adshkumar/r0#readme) for supported integrations.
