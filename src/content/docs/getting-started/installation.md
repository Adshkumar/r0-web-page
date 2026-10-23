---
title: Installing r0
description: Install r0 on Windows or Linux using a release download or Windows command.
category: getting-started
order: 1
---

# Installing r0

r0 currently publishes desktop downloads for **Windows and Linux**. Visit the [latest GitHub release](https://github.com/Adshkumar/r0/releases/latest) and choose the installer or package for your operating system and processor. The [full release archive](https://github.com/Adshkumar/r0/releases) contains previous versions and checksums.

## Windows

### Direct installer

1. Open the [latest GitHub release](https://github.com/Adshkumar/r0/releases/latest).
2. Download `R0_<version>_x64-setup.exe` for most PCs or `R0_<version>_arm64-setup.exe` for Windows on ARM.
3. Open the downloaded installer and follow its prompts.

### PowerShell

Open PowerShell and run:

```powershell
irm https://r0-ide.vercel.app/install.ps1 | iex
```

The installer selects the matching Windows architecture, verifies the downloaded installer against the release SHA-256 checksum, and starts setup. Because this command runs a remote script, review the [installer source](https://github.com/Adshkumar/r0/blob/main/scripts/install/install-windows.ps1) before running it if you want to inspect its behavior.

### Command Prompt

In `cmd.exe`, run:

```cmd
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Invoke-WebRequest -UseBasicParsing 'https://r0-ide.vercel.app/install.ps1').Content"
```

This invokes the same Windows installer through PowerShell from Command Prompt.

## Linux

Open the [latest GitHub release](https://github.com/Adshkumar/r0/releases/latest) and select a package for your distribution and processor:

- **Debian or Ubuntu:** download the `.deb` package, then install it with `sudo apt install ./<downloaded-file>.deb`. Choose the `amd64` package for x64 or the `arm64` package for ARM64.
- **Fedora or another RPM-based distribution:** download the `.rpm` package and install with `sudo dnf install ./<downloaded-file>.rpm`. Choose the x86_64 or aarch64 package matching your system.
- **AppImage:** download the matching AppImage, make it executable with `chmod +x <downloaded-file>.AppImage`, then launch it with `./<downloaded-file>.AppImage`.
- **Portable archive:** extract the archive for `linux-x86_64` or `linux-aarch64`, then run `r0` from the extracted directory.

The portable Linux archive uses the system WebKitGTK 4.1 libraries. Check the release notes for package prerequisites and architecture details.

## After installation

Launch r0 and open a project folder. Start with [First steps with r0](/docs/getting-started/quickstart) to learn the workspace, file editing, terminal, Git, and AI-agent workflow.
