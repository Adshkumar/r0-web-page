---
title: Search and explore a project
description: Find files and references, understand a workspace, and keep project navigation manageable.
category: guides
order: 5
---

# Search and explore a project

Use the project tree to understand how files are organized, Quick Open to jump to a known filename, and workspace search to locate text or symbols across files. The default Windows and Linux shortcuts are in the [keyboard shortcut reference](/docs/reference/keyboard-shortcuts).

## Explore before editing

1. Open the project's root folder so the explorer and workspace search can include the whole project.
2. Start with the README and the relevant package or build manifest to understand how the project is organized.
3. Follow the file tree to the feature or module you need.
4. Search for a visible label, function, or error message to find related implementation and tests.
5. Open nearby files to understand local conventions before making changes.

Use `Ctrl+P` to search for a file by name and `Ctrl+Shift+F` to search text across the workspace. Search results can include generated files or dependencies; prioritize project source and tests, and avoid making edits under generated or vendor folders unless the project specifically requires it.

## Narrow down broad results

Begin with a distinctive phrase or symbol. If there are too many matches, use a more specific term or include the likely folder in the search scope if the interface supports it. If there are no results:

- Check spelling, capitalization, and whether the symbol has another name.
- Confirm the intended folder is inside the opened workspace.
- Check whether ignored files are excluded from search.
- Search for a related string or call site instead of assuming the feature has one exact name.

## Work across projects

r0 supports workflows across projects, but the way projects are opened or switched can vary by version. Keep each project's root clear in the window or workspace, and check the active project before editing, running terminal commands, or staging Git changes. This helps prevent changing a similarly named file in the wrong repository.
