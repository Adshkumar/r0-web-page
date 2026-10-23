---
title: Customize themes and editor tools
description: Personalize the r0 editor with themes, extensions, and keyboard shortcuts.
category: guides
order: 6
---

# Customize themes and editor tools

r0 supports editor themes, extensions, and keymap presets. Names and setup steps can change between releases, so use the options available in your installed version and check the extension's own requirements.

## Choose a comfortable theme

1. Open the theme selector from the editor or use the default `Ctrl+K`, then `Ctrl+T` shortcut.
2. Preview a theme with both code and the surrounding interface visible.
3. Check contrast for comments, selection, and diagnostic colors—not only the background.
4. Keep the theme that makes long editing sessions comfortable.

The [features page](/features#themes) shows examples of r0's default themes and supported theme families. The preview on that page is illustrative; it does not change your installed editor.

## Add extensions carefully

Before installing an extension, confirm that it supports your r0 version, operating system, and language tools. Read its description, permissions, and setup instructions. Install only extensions you trust, then restart or reload the relevant editor component if the extension requires it.

If an extension does not work, check that it is enabled, that its dependencies are installed, and that the project is configured for the language or tool it provides. Disable a recently added extension to help identify whether it caused a conflict.

## Adjust keyboard shortcuts

Open the keyboard shortcut editor using `Ctrl+K`, then `Ctrl+S`, or consult the [complete shortcut reference](/docs/reference/keyboard-shortcuts). Search for the action before changing its binding, and check for conflicts with existing commands or your operating system.

If you use a keymap preset or Vim mode, test the new binding in a safe file before relying on it. The shortcut reference documents r0's defaults; customized keymaps may behave differently.
