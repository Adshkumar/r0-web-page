---
title: Review, commit, and push with Git
description: Follow a clear in-editor workflow to review changes, make a commit, and push your branch.
category: guides
order: 2
---

# Review, commit, and push with Git

r0 brings Git into your project workflow. The website's source-control panel is an illustration, not a live view of your repository or a guarantee that every release exposes the same Git actions. Use the controls shown in your installed version; the integrated terminal is available for Git commands.

## The safe sequence

1. **Review the working tree.** Open the Source Control view in r0. Check the file list and open each diff you want to include.
2. **Stage only related files.** Stage the files for this change, rather than staging unrelated work.
3. **Commit with a useful message.** Enter a concise message that says what the change does, then use the Commit action if it is available in your build.
4. **Push the commit.** Use Push or Sync Changes if your build offers that action. Otherwise, use the integrated terminal.

## Terminal workflow

Run these commands from the project directory:

```bash
git status
git diff
git add path/to/related-file
git diff --cached
git commit -m "Describe the change"
git push
```

Replace `path/to/related-file` with each file you intend to include. Review the staged diff before committing. If this is the first push for a branch, set its upstream:

```bash
git push -u origin your-branch
```

After pushing, check the repository's remote page or run `git status` to confirm the branch is up to date. Do not stage secrets, credentials, or unrelated files.

For current product details, see the [r0 project README](https://github.com/Adshkumar/r0#readme).
