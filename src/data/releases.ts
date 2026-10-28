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
  categories: ReleaseCategory[];
}

export const releases: ReleaseEntry[] = [
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
          'Fixed a folder deletion failure caused by the delete action losing the information that its target was a directory. The file explorer now passes the directory flag through each layer of the file-system store to the workspace delete provider, so the provider selects its folder-delete path instead of treating the target as a regular file.',
          'The file-tree cache is invalidated according to the target type: deleting a folder clears the directory-level ignore cache, while deleting a file clears that file path. Added a regression test to confirm folder deletions pass the directory flag to the provider.',
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
          'Updated the release guide and README with the current release steps: synchronize the version across the app and Rust project files, update the lockfile, create and push the matching version tag, monitor CI, publish the draft release, and verify its assets.',
          'Cargo Audit still runs in CI, but advisory findings in transitive crates that the project cannot directly update no longer fail the whole check. This keeps the findings visible while allowing the rest of the CI and release validation to proceed.',
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
          'Added a public Windows PowerShell install endpoint at r0-ide.vercel.app/install.ps1, with the installer copied into the web build and routed through the site.',
        ],
      },
      {
        name: 'Improvements',
        items: [
          'Reduced CPU and memory overhead to make the editor more efficient during everyday use.',
          'Improved terminal defaults and connected Git publishing guidance to the r0 website documentation and changelog.',
          'Replaced the Nucleo icon dependency with Lucide while keeping the existing icon export API.',
          'Windows installation now prioritizes PowerShell, and release checks can complete when the dependency audit reports advisory warnings.',
        ],
      },
      {
        name: 'Fixes',
        items: [
          'Corrected Windows installer endpoint and build-output handling so the public install script is served from the expected URL.',
          'Improved command-palette submenu keyboard navigation, menu interactions, and sidebar visibility; refined theme-picker option handling.',
          'Updated Rust dependencies to address security-audit findings and stabilized end-to-end checks for editor menus, themes, and the command palette.',
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
          'Windows setup now uses consistent r0 branding and handles upgrades more reliably. Release checks verify the publisher configured by the app, and the installer smoke test now authenticates its GitHub API request when checking the upgrade path.',
          'Command-palette navigation is more predictable: submenus open on hover, labels match the available actions, and requested views can open even when the palette starts closed. End-to-end coverage was added for navigation.',
          'Extension icons now fall back to bundled artwork if catalog CDN icons are unavailable. Extension matching also handles compound file extensions and Windows paths consistently.',
          'Retrying terminal startup no longer initializes the terminal twice, preventing duplicate initialization after a retry.',
          'Formatting and TypeScript issues that blocked the CI release gate were corrected so tagged builds can proceed through binary generation.',
        ],
      },
      {
        name: 'Improvements',
        items: [
          'Updater status feedback and installation documentation were improved so users have clearer guidance when checking or installing updates.',
        ],
      },
      {
        name: 'New features',
        items: [
          'No new user-facing feature is listed for this release; the published changes are focused on reliability, fixes, and release readiness.',
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
];

export function getAllReleases(): ReleaseEntry[] {
  return releases;
}
