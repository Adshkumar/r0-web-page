---
title: Edit and navigate code
description: Use the r0 editor, language support, and keyboard navigation to work through a project.
category: guides
order: 3
---

# Edit and navigate code

r0 brings the project tree, code editor, and language tools into one workspace. The exact commands and language features depend on the installed r0 version and the tools configured for your project.

## Open the right file

1. Open the project folder, rather than an individual source file, so r0 can use the full workspace context.
2. Browse folders in the file explorer, or use Quick Open to find a file by name.
3. Use workspace search when you know a word or symbol but not its file.
4. Check the language shown for the file and install or configure the language tools the project requires if completion, diagnostics, or navigation are missing.

The default Windows and Linux bindings are listed in the [keyboard shortcut reference](/docs/reference/keyboard-shortcuts). For example, `Ctrl+P` opens Quick Open, `Ctrl+Shift+F` searches across the workspace, and `F12` goes to a definition when the language server supports it.

## Make a focused edit

1. Read the surrounding code and nearby files before changing behavior.
2. Keep the change limited to the relevant function, component, or module.
3. Save the file, then review any diagnostics or formatting changes.
4. Search for callers or related tests before changing a shared interface.

If you use Vim keybindings, confirm the active keymap and mode before entering text. If a key behaves unexpectedly, check the active shortcuts and keymap settings rather than repeating the edit.

## Understand navigation results

Go to Definition and Find References rely on the language server and project configuration. If a result is missing:

- Confirm the file is part of the opened project.
- Check that the language server for that language is available and has finished loading.
- Make sure dependencies are installed using the project's documented setup.
- Check the Problems or output view for language-tool errors, if available.
- Use workspace search as a fallback, then verify references manually.

## Review before moving on

After editing, save the file, inspect the diff in Source Control, and run the project's relevant check in the integrated terminal. A clean-looking editor is not a substitute for compiling or testing the change.
