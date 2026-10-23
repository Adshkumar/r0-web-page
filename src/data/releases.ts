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
    version: '0.18.0',
    tag: 'v0.18.0',
    date: '2026-10-20',
    title: 'Installer, editor workflow, and reliability fixes',
    summary: 'This release focuses on a more dependable Windows install and upgrade path, clearer updater guidance, and fixes across the command palette, extensions, terminal, and release pipeline.',
    commitRange: 'v0.17.5...v0.18.0',
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
