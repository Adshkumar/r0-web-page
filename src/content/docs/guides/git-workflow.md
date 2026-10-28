---
title: Review, commit, and push code with Git
description: Check your branch and changes, create a focused commit, and push it to a remote repository from r0.
category: guides
order: 2
---

# Review, commit, and push code with Git

Git saves project history in commits. A **commit** records a reviewed set of changes in your local repository. A **push** sends those commits to a remote repository such as GitHub. Review and commit first; push only after confirming the right branch and files are included.

Use the Source Control view in r0 when its actions are available in your installed version. The integrated terminal steps below work across builds and make each Git operation explicit.

## 1. Check the repository and current branch

Open the integrated terminal in the project directory and inspect the repository state:

```bash
git status --short --branch
git branch --show-current
git remote -v
```

`git status` shows the current branch and changed files. `git branch --show-current` prints the branch name. If it prints nothing, the repository is in **detached HEAD** state: it is checked out at a commit rather than a branch. Create or switch to a branch before committing or pushing:

```bash
git switch -c feature/describe-your-change
```

Choose a short branch name that describes the work. If you already have a branch for this change, switch to it with `git switch your-branch` instead.

`git remote -v` shows where pushes will go. If it prints no remote, add the repository URL supplied by your project host or team:

```bash
git remote add origin https://github.com/OWNER/REPOSITORY.git
```

Replace the example URL with your own repository URL. Check it with `git remote -v` before pushing so you know where your code will be sent.

## 2. Review your changes

Inspect the changed files and the full unstaged diff:

```bash
git status
git diff
```

Read the diff to confirm it contains only the changes you intended. Remove accidental edits and keep unrelated work out of this commit. Never commit passwords, API keys, tokens, private certificates, or local environment files.

## 3. Stage only the files for this change

Staging selects which changes will go into the next commit. Add specific files when possible:

```bash
git add src/path/to/file.ts
git add README.md
```

To stage a new file, use its path in the same way. Avoid `git add .` if the working tree may contain unrelated changes or secrets.

Review exactly what is staged:

```bash
git diff --cached
git status
```

If a file contains both related and unrelated edits, stage only selected lines with `git add -p path/to/file`, then review the staged diff again. To unstage a file without discarding its edits, run `git restore --staged path/to/file`.

## 4. Create a commit

Commit the staged changes with a short message that describes the outcome:

```bash
git commit -m "Fix folder deletion in the file explorer"
```

A commit is saved locally; it has not been uploaded yet. If Git asks you to configure your name or email, set the identity you want recorded in your commits, following your project or organization guidance.

## 5. Push the branch

Find the current branch name:

```bash
git branch --show-current
```

For a branch's first push, set its upstream so Git knows which remote branch to use next time:

```bash
git push --set-upstream origin your-branch
```

Replace `your-branch` with the name printed by `git branch --show-current`. After the upstream is set, later pushes from that branch can usually use:

```bash
git push
```

If your r0 Source Control view offers Push or Sync Changes, you can use that after reviewing the branch and staged commit. If Git reports that the remote has commits you do not have, fetch and review those changes before integrating them. Do not force-push to get around the error; a force push can overwrite commits already on the remote.

For a personal branch that tracks the same remote branch, one common way to integrate remote commits is to first make sure your working tree is clean, then run:

```bash
git pull --rebase
```

This downloads the remote commits and replays your local commits on top of them. If Git reports conflicts, resolve each file carefully, stage the resolved files with `git add`, and continue with `git rebase --continue`. If your team uses merge commits or has a different branch policy, follow that policy instead. Once the branch is up to date, push again.

## 6. Confirm the push

Check the final state:

```bash
git status --short --branch
git log -1 --oneline
```

The status should show that your branch is up to date with its upstream. It may also show other local edits that you did not include in this commit. You can open the remote repository and confirm the branch and commit appear there. A push uploads a branch; it does not automatically merge the work into the default branch. Use your team's pull request or review process when one is required.

## Quick reference

```bash
git status --short --branch
git switch -c feature/describe-your-change
git remote -v
git diff
git add path/to/related-file
git diff --cached
git commit -m "Describe the change"
git push --set-upstream origin your-branch
git status --short --branch
```

Skip the branch-creation command if you are already on the correct branch. For current r0 capabilities and setup details, see the [project README](https://github.com/Adshkumar/r0#readme).
