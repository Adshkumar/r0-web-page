export interface ProductFeature {
  label: string;
  title: string;
  description: string;
  details: string[];
}

export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    label: 'EDITOR',
    title: 'Write code your way',
    description: 'Edit project files with syntax highlighting, language-server support, and Vim keybindings.',
    details: ['Syntax highlighting', 'Language servers', 'Vim keybindings'],
  },
  {
    label: 'AI WORKFLOW',
    title: 'Build with AI',
    description: 'Work with supported AI providers and agent integrations from the same project workspace.',
    details: ['Agent integrations', 'Project context', 'Review changes'],
  },
  {
    label: 'SOURCE CONTROL',
    title: 'Keep Git close to the code',
    description: 'Review and manage source-control changes alongside the files you are working on.',
    details: ['Changed files', 'Git workflow', 'In your workspace'],
  },
  {
    label: 'TERMINAL',
    title: 'Run project commands',
    description: 'Use the integrated terminal for the commands and development tools your project needs.',
    details: ['Integrated terminal', 'Project commands', 'Editor workflow'],
  },
  {
    label: 'DATABASE',
    title: 'Inspect supported databases',
    description: 'Connect to supported databases and work with project data from the editor.',
    details: ['Database tools', 'Project data', 'In the editor'],
  },
  {
    label: 'PROJECTS',
    title: 'Find your way around',
    description: 'Browse project files, search your workspace, and move between projects.',
    details: ['File explorer', 'Workspace search', 'Multiple projects'],
  },
  {
    label: 'PERSONALIZE',
    title: 'Make the editor yours',
    description: 'Customize the editor experience with themes and extensions.',
    details: ['Theme families', 'Extensions', 'Keymap presets'],
  },
  {
    label: 'COLLABORATION',
    title: 'Work together with controls',
    description: 'Use collaboration features and managed mode for supported team workflows.',
    details: ['Collaboration', 'Managed mode', 'Team workflows'],
  },
];

export const THEME_FAMILIES = [
  'Ayu',
  'Catppuccin',
  'Christmas',
  'Contrast',
  'Dracula',
  'GitHub',
  'Nord',
  'One',
  'r0',
  'Solarized',
  'Tokyo Night',
  'Vitesse',
];

export interface ProductShortcut {
  keys: string[][];
  action: string;
  group: 'Navigate' | 'Edit' | 'Workspace';
}

export const PRODUCT_SHORTCUTS: ProductShortcut[] = [
  { keys: [['⌘/Ctrl', 'P']], action: 'Quick open a file', group: 'Navigate' },
  { keys: [['⌘/Ctrl', 'Shift', 'O']], action: 'Open the editor outline', group: 'Navigate' },
  { keys: [['F12']], action: 'Go to definition', group: 'Navigate' },
  { keys: [['Shift', 'F12']], action: 'Find references', group: 'Navigate' },
  { keys: [['⌘/Ctrl', 'S']], action: 'Save the current file', group: 'Edit' },
  { keys: [['⌘/Ctrl', '/']], action: 'Toggle line comment', group: 'Edit' },
  { keys: [['Alt/Option', '↑/↓']], action: 'Move the current line', group: 'Edit' },
  { keys: [['⌘/Ctrl', 'Shift', 'F']], action: 'Search across the workspace', group: 'Workspace' },
  { keys: [['⌘/Ctrl', 'Shift', 'G']], action: 'Open source control', group: 'Workspace' },
  { keys: [['⌘/Ctrl', 'J']], action: 'Toggle the integrated terminal', group: 'Workspace' },
  { keys: [['⌘/Ctrl', 'K'], ['⌘/Ctrl', 'T']], action: 'Choose a color theme', group: 'Workspace' },
  { keys: [['⌘/Ctrl', 'K'], ['⌘/Ctrl', 'S']], action: 'Open keyboard shortcuts', group: 'Workspace' },
];
