export interface ReleaseCategory {
  name: string;
  items: string[];
}

export interface ReleaseEntry {
  version: string;
  tag: string;
  date: string;
  title: string;
  summary: string;
  commitRange: string;
  availability?: 'draft' | 'tag-only';
  categories: ReleaseCategory[];
}

export const releases: ReleaseEntry[] = [
  {
    version: '0.18.8',
    tag: 'v0.18.8',
    date: '2026-11-01',
    title: 'Reliable Linux builds with pinned Rust toolchains',
    summary: 'This maintenance release stabilizes Linux builds by pinning compatible Rust toolchains, aligning the versions used across build and release workflows, and synchronizing app and installer metadata for upgrades.',
    commitRange: 'v0.18.4...v0.18.8',
    categories: [
      {
        name: 'Build reliability',
        items: [
          'Pinned the Rust nightly toolchain to the last version that passed CI. This avoids a moving nightly unexpectedly introducing compiler changes that break release builds.',
          'Pinned the stable Rust toolchain to a known-compatible version because a newer compiler failed while compiling the Unix zvariant dependency. Keeping this toolchain explicit prevents Linux builds from being blocked by upstream compiler changes.',
          'Aligned the workspace toolchain and every Rust-enabled workflow on the known-good nightly: CI, end-to-end, extensions, Linux build, release cache, release preflight, release, and test-build.',
          'Changed Rust setup automation to a supported action revision and passed the dated nightly through its toolchain input. This makes GitHub Actions resolve the intended compiler instead of relying on an unsupported action ref or an ambiguous default.',
        ],
      },
      {
        name: 'Release and upgrade readiness',
        items: [
          'Updated the app and installer version to v0.18.8, and synchronized the version-bearing project configuration and lockfile. Matching version metadata lets existing installations recognize the update and keeps generated release assets consistent.',
          'No new editor feature is introduced by this release. Its changes focus on ensuring Rust compilation, Linux CI, and tagged release builds use the compatible toolchain.',
        ],
      },
    ],
  },
  {
    version: '0.18.6',
    tag: 'v0.18.6',
    date: '2026-10-31',
    title: 'Codex CLI workflow in Customize',
    summary: 'This draft release routes Codex actions through the detected Codex CLI, removes the older account-menu flow, and improves how the catalog reports globally installed tools.',
    commitRange: 'v0.18.5...v0.18.6',
    availability: 'draft',
    categories: [
      {
        name: 'Codex CLI integration',
        items: [
          'Removed the previous Codex account-menu flow from Customize and routed Codex actions through the Codex CLI detected on the machine. This makes the CLI the integration entry point rather than relying on the retired account flow.',
          'Updated catalog installation-state handling to recognize globally installed tools, not only project-local installs, so the catalog can represent tools already available on the system.',
        ],
      },
      {
        name: 'Release metadata',
        items: [
          'The draft includes the v0.18.6 release-version update in the application version files.',
        ],
      },
    ],
  },
  {
    version: '0.18.5',
    tag: 'v0.18.5',
    date: '2026-10-31',
    title: 'Codex discovery, authenticated Git, and a more responsive desktop',
    summary: 'This draft release improves Codex CLI startup, secures authenticated Git operations, defers terminal work until needed, and updates hosted sign-in and release checks.',
    commitRange: 'v0.18.4...v0.18.5',
    availability: 'draft',
    categories: [
      {
        name: 'Codex and Git workflows',
        items: [
          'Fixed Codex CLI startup discovery by joining PATH entries with the current operating system’s path separator. A separator from the wrong platform could produce an invalid search path and prevent the installed CLI from being found.',
          'The app now drains the Codex app-server stderr stream without copying its contents into application logs. This prevents potentially sensitive process output from being retained in logs while still avoiding a blocked subprocess pipe.',
          'GitHub credentials resolved by the app are supplied to clone, fetch, pull, push, and tag operations through temporary Git configuration. This enables authenticated repository operations without embedding credentials in remote URLs.',
        ],
      },
      {
        name: 'Performance and desktop behavior',
        items: [
          'Changed the bottom-pane terminal to load only when the user requests it, and load its UI code on demand instead of paying the initialization cost on every startup.',
          'Paused terminal cursor blinking while its terminal is inactive and delayed emulator initialization until its container is visible. This avoids unnecessary background work and prevents initialization against a hidden or unmeasured container.',
          'Bounded the editor pane-shell cache so long-running sessions do not retain every file shell ever opened. Added regression coverage for the cache limit and bottom-pane behavior.',
          'Disabled Windows transparency by default and turned off the performance monitor by default, reducing default desktop overhead and avoiding transparency-related platform issues.',
          'Granted the app the filesystem-removal capability needed by its workflows.',
        ],
      },
      {
        name: 'Authentication and release checks',
        items: [
          'Routed website sign-in through the hosted authentication page. Updated API and repository sign-in expectations to match the hosted URL while retaining assertions that encoded return paths bring users back to their original app location.',
          'Fixed browser toast layout checks by mounting the toaster host before rendering its contents, allowing mutation tracking to observe newly added toasts reliably.',
          'Added a release-workflow recovery path for creating a tag when the version has already been bumped and CI has passed.',
          'Synchronized application version metadata for the v0.18.5 draft.',
        ],
      },
    ],
  },
  {
    version: '0.18.4',
    tag: 'v0.18.4',
    date: '2026-10-27',
    title: 'Safer Git actions and reliable folder deletion',
    summary: 'This release fixes folder deletion in the file explorer, protects Git operations when the repository is not on a branch, and makes the release process and CI checks clearer for maintainers.',
    commitRange: 'v0.18.3...v0.18.4',
    categories: [
      {
        name: 'Fixes',
        items: [
          'Fixed the file explorer folder-delete bug by preserving the target type through the delete action and file-system store, then passing the directory flag to the workspace delete provider. The provider can now select its folder-deletion path instead of treating a directory as a regular file.',
          'Added regression coverage for folder-delete propagation and made file-tree cache invalidation target-aware: folder deletion clears the directory-level ignore cache, while file deletion clears the relevant file path.',
        ],
      },
      {
        name: 'Git workflow improvements',
        items: [
          'Source Control now labels a detached repository state as Detached HEAD instead of presenting it like an ordinary branch. A detached HEAD points directly to a commit, so new work would not automatically belong to a named branch.',
          'Commit and push operations are blocked while HEAD is detached, and r0 explains that you need to create or switch to a branch first. This avoids making commits that are difficult to find later or attempting a push without a current branch.',
        ],
      },
      {
        name: 'Release process and documentation',
        items: [
          'Added the release guide and updated the README with the release workflow: synchronize app and Rust versions, update the lockfile, create and push the matching tag, monitor CI, publish the GitHub draft, and verify the resulting assets.',
          'Updated the release guide again to match the current workflow and clarify the order of its steps, so maintainers can follow the actual release process rather than outdated instructions.',
          'Made Cargo Audit non-blocking for vulnerabilities reported only in transitive dependencies that the project cannot directly update. Audit findings remain visible, while unrelated CI and release validation can continue.',
        ],
      },
    ],
  },
  {
    version: '0.18.3',
    tag: 'v0.18.3',
    date: '2026-10-25',
    title: 'In-app release notes preview',
    summary: 'Review what is changing before installing an update, revisit notes for the installed version, and find the online changelog from the project README.',
    commitRange: 'v0.18.2...v0.18.3',
    categories: [
      {
        name: 'New features',
        items: [
          "Added a View release notes action in Settings so you can preview an available update before installing it, plus a What's New entry in the account menu for notes on the installed version.",
          'Added a link to the website changelog in the project README.',
        ],
      },
    ],
  },
  {
    version: '0.18.2',
    tag: 'v0.18.2',
    date: '2026-10-24',
    title: 'Release workflow, architecture guide, and asset cleanup',
    summary: 'This draft release documents how r0 is built and released, adds a sequential protocol for automated release work, and reorganizes application artwork.',
    commitRange: 'v0.18.1...v0.18.2',
    availability: 'draft',
    categories: [
      {
        name: 'Release documentation',
        items: [
          'Added a release workflow and architecture guide covering the terminal subsystem, versioning, commit rules, CI gates, and in-app update steps.',
          'Added an automated-agent release protocol with a sequential checklist and explicit constraints for agent-driven release workflows.',
          'Refined the release guide’s commit instructions, including the checklist restriction on header dots.',
        ],
      },
      {
        name: 'Repository and artwork cleanup',
        items: [
          'Removed unused generated-icon backups and temporary scratch scripts from the repository root.',
          'Moved the application’s square logos, StoreLogo, and icon asset into the public directory and removed redundant copies from the root.',
          'Updated package, Tauri, Rust, and lockfile version metadata for v0.18.2.',
        ],
      },
    ],
  },
  {
    version: '0.18.1',
    tag: 'v0.18.1',
    date: '2026-10-24',
    title: 'Performance, installation, and editor workflow improvements',
    summary: 'This release makes r0 lighter on CPU and memory, improves the Windows installation path, and refines terminal, Git, theme, and command-palette workflows.',
    commitRange: 'v0.18.0...v0.18.1',
    categories: [
      {
        name: 'New features',
        items: [
          'Added the public Windows PowerShell installer endpoint at r0-ide.vercel.app/install.ps1 and wired the installer into the website build and route.',
        ],
      },
      {
        name: 'Improvements',
        items: [
          'Reduced CPU and RAM overhead by optimizing memory-allocation cycles and reducing main-thread CPU bottlenecks.',
          'Improved terminal defaults and linked Git-publishing guidance from the app menus to the r0 website documentation and changelog.',
          'Replaced the Nucleo icon implementation with Lucide, added the required lucide-react dependency, and preserved the existing icon export API. Updated the icon contract test and cleaned up the Vercel JSON configuration.',
          'Reordered Windows shell choices so PowerShell is presented before Command Prompt.',
          'Allowed advisory warnings from the Bun dependency audit to remain visible without failing the overall CI job.',
        ],
      },
      {
        name: 'Fixes',
        items: [
          'Corrected the Windows installer endpoint and build-output handling so the public install script is served from the expected URL.',
          'Fixed command-palette submenu navigation, including keyboard navigation with the right arrow, and improved menu interactions and sidebar visibility.',
          'Fixed theme-picker option handling and stabilized end-to-end tests for themes, menus, and the command palette.',
          'Updated Rust dependencies to address security-audit findings and corrected end-to-end test failures.',
        ],
      },
    ],
  },
  {
    version: '0.18.0',
    tag: 'v0.18.0',
    date: '2026-10-20',
    title: 'Installer, editor workflow, and reliability fixes',
    summary: 'This release focuses on a more dependable Windows install and upgrade path, clearer updater guidance, and fixes across the command palette, extensions, terminal, and release pipeline.',
    commitRange: 'v0.17.6...v0.18.0',
    categories: [
      {
        name: 'Fixes',
        items: [
          'Standardized r0 branding in the Windows installer and stabilized Windows installation and upgrades, including the intermediate v0.17.7 release-preparation work.',
          'Corrected installer publisher verification to use the publisher configured in tauri.conf.json, so the release smoke test checks the actual app identity.',
          'Authenticated the installer smoke test’s GitHub API request with the workflow token when it checks the upgrade path.',
          'Fixed command-palette end-to-end navigation, made submenus open on hover, and aligned menu labels exactly with the actions they represent.',
          'Updated extension icons to fall back to bundled SVG artwork when catalog CDN routes are unavailable, and removed generated diagnostic reports and obsolete backups.',
          'Made extension matching handle compound file extensions and Windows paths consistently, and fixed command-palette navigation when opening a requested view.',
          'Prevented terminal double initialization on retry by guarding initialization when the terminal is already initialized.',
          'Formatted files and corrected TypeScript errors in the React compiler test, including awaiting the asynchronous Babel plugin and extracting the build config into a typed InlineConfig. These release-gate errors had prevented tagged commits from reaching binary builds.',
        ],
      },
      {
        name: 'Improvements',
        items: [
          'Improved updater status feedback and installation documentation so users receive clearer guidance while checking for or installing updates.',
        ],
      },
      {
        name: 'New features',
        items: [
          'The published release notes list no new user-facing editor feature. The release centers on Windows install and upgrade reliability, editor workflow fixes, and release readiness.',
        ],
      },
    ],
  },
  {
    version: '0.17.6',
    tag: 'v0.17.6',
    date: '2026-10-19',
    title: 'Updater feedback, installation guidance, and macOS release assets',
    summary: 'This draft release improves update and installation guidance and corrects macOS updater asset naming for release packaging.',
    commitRange: 'v0.17.5...v0.17.6',
    availability: 'draft',
    categories: [
      {
        name: 'Updater and installation',
        items: [
          'Improved updater feedback so users get clearer status information.',
          'Updated installation documentation with clearer setup guidance.',
        ],
      },
      {
        name: 'Release packaging',
        items: [
          'Recognized Tauri’s lowercase macOS updater bundle names before assigning architecture-specific release asset names, preventing valid updater assets from being missed because of filename casing.',
          'Updated application version metadata for v0.17.6.',
        ],
      },
    ],
  },
  {
    version: '0.17.5',
    tag: 'v0.17.5',
    date: '2026-10-19',
    title: 'Release asset naming fix',
    summary: 'A focused release fix to make generated installer and package names match the names expected by release verification.',
    commitRange: 'v0.17.4...v0.17.5',
    categories: [
      {
        name: 'Fixes',
        items: [
          'Normalized release asset filename casing before verification. This prevents correctly generated assets from being rejected when the build system and release checks use different capitalization.',
        ],
      },
      {
        name: 'New features',
        items: [
          'No new user-facing feature is listed in the published release notes; this version contains a release packaging and verification fix.',
        ],
      },
    ],
  },
  {
    version: '0.17.4',
    tag: 'v0.17.4',
    date: '2026-10-19',
    title: 'Reliable Linux tarball release packaging',
    summary: 'This tag contains a Linux release-packaging fix so the tarball packaging script runs correctly in CI.',
    commitRange: 'v0.17.3...v0.17.4',
    availability: 'tag-only',
    categories: [
      {
        name: 'Linux release packaging',
        items: [
          'The Linux release workflow now invokes the tarball packaging script through Bash, so packaging succeeds even when the script does not have its executable bit set.',
          'Updated release version metadata for v0.17.4.',
        ],
      },
    ],
  },
  {
    version: '0.17.3',
    tag: 'v0.17.3',
    date: '2026-10-19',
    title: 'macOS updater asset name normalization',
    summary: 'This tag fixes release asset matching for macOS updater bundles whose generated filenames use lowercase names.',
    commitRange: 'v0.17.2...v0.17.3',
    availability: 'tag-only',
    categories: [
      {
        name: 'Release packaging',
        items: [
          'Recognized Tauri’s lowercase macOS updater bundle filenames before assigning architecture-specific release asset names.',
          'Updated release version metadata for v0.17.3.',
        ],
      },
    ],
  },
  {
    version: '0.17.2',
    tag: 'v0.17.2',
    date: '2026-10-19',
    title: 'Stable release builds and aligned application checks',
    summary: 'This tag addresses release blockers by tracking the lockfile, aligning CI and workbench checks, and refreshing frontend assertions to match the current product configuration.',
    commitRange: 'v0.17.1...v0.17.2',
    availability: 'tag-only',
    categories: [
      {
        name: 'Release build reliability',
        items: [
          'Tracked the lockfile so clean checkouts resolve stable dependency versions, and fixed frontend type errors that blocked release builds.',
          'Aligned configuration and workbench checks by correcting expected origin casing in CI and matching the end-to-end title assertion to the application name.',
          'Updated stale frontend test expectations to match current branding, release URLs, and repository configuration.',
          'Prepared the release and synchronized application version metadata for v0.17.2.',
        ],
      },
    ],
  },
  {
    version: '0.17.1',
    tag: 'v0.17.1',
    date: '2026-10-18',
    title: 'Windows-compatible release preflight',
    summary: 'This draft release makes the release preflight script work on Windows as well as the other supported development environments.',
    commitRange: 'v0.17.1',
    availability: 'draft',
    categories: [
      {
        name: 'Release tooling',
        items: [
          'Fixed the release preflight script to be Windows-compatible.',
          'The original draft release notes contain only a link to the v0.17.1 commit history; the preflight fix is the change recorded at this tag.',
        ],
      },
    ],
  },
];

export function getAllReleases(): ReleaseEntry[] {
  return releases;
}
