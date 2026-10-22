export interface ChangelogCategory {
  name: string;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  tag: string;
  date: string;
  title: string;
  summary: string;
  commitCount: number;
  commitRange: string;
  categories: ChangelogCategory[];
}

export const changelogs: ChangelogEntry[] = [
  {
    version: '0.18.0',
    tag: 'v0.18.0',
    date: '2026-10-20',
    title: 'Installer and workflow fixes',
    summary: 'This release improves Windows installation and upgrades, command palette navigation, terminal retries, and extension handling.',
    commitCount: 12,
    commitRange: 'v0.17.6...v0.18.0',
    categories: [
      {
        name: 'Improvements',
        items: [
          'Fix Windows installer branding and upgrade behavior.',
          'Improve command palette submenu navigation.',
        ],
      },
      {
        name: 'Fixes',
        items: [
          'Fix command palette navigation and extension icon paths.',
          'Prevent terminal double initialization when retrying.',
          'Correct Windows installer publisher verification and release smoke testing.',
        ],
      },
    ],
  },
];

export function getLatestChangelog(): ChangelogEntry {
  return changelogs[0];
}

export function getAllChangelogs(): ChangelogEntry[] {
  return changelogs;
}
