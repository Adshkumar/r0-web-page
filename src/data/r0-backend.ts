export const BACKEND_FILES = [
  'Cargo.toml',
  'Cargo.lock',
  'crates/ai/src/intelligence.rs',
  'crates/ai/src/workspace_changes.rs',
  'crates/ai/src/workspace_command.rs',
  'crates/ai/src/workspace_tools.rs',
  'crates/ai/src/lib.rs',
  'src-tauri/src/commands/ai/intelligence.rs',
  'src-tauri/src/commands/ai/mod.rs',
  'src-tauri/src/commands/mod.rs',
  'src-tauri/src/lib.rs',
  'src-tauri/src/main.rs',
  'src-tauri/src/terminal.rs',
];

export const BACKEND_ROOT_DIRS = ['crates', 'src-tauri'];
export const BACKEND_ROOT_FILES = ['Cargo.toml', 'Cargo.lock', 'README.md'];
export const BACKEND_FILE_WINDOW = [
  'acp/',
  'chat_history.rs',
  'intelligence.rs',
  'lib.rs',
  'workspace_changes.rs',
  'workspace_command.rs',
  'workspace_tools.rs',
];

export const BACKEND_SYMBOLS = [
  { name: 'bounded_paths_stay_in_workspace', kind: 'fn', line: 17 },
  { name: 'run_tracked_workspace_command', kind: 'fn', line: 34 },
  { name: 'record', kind: 'fn', line: 71 },
  { name: 'file_changed_event', kind: 'fn', line: 81 },
  { name: 'file_deleted_event', kind: 'fn', line: 91 },
];

export const BACKEND_REFERENCES = [
  {
    line: 17,
    file: 'crates/ai/src/intelligence.rs',
    text: 'pub fn bounded_paths_stay_in_workspace(root: &str, paths: &[String]) -> bool',
  },
  {
    line: 24,
    file: 'src-tauri/src/commands/ai/intelligence.rs',
    text: 'r0_ai::intelligence::bounded_paths_stay_in_workspace(&root, &paths)',
  },
];

export const BACKEND_EXCERPT = {
  file: 'crates/ai/src/intelligence.rs',
  total: 179,
  start: 13,
  lines: [
    '/// More paths than this in one containment check are refused outright.',
    'const MAX_CONTAINMENT_PATHS: usize = 256;',
    '',
    '/// Whether every path resolves inside the workspace; oversized batches are refused.',
    'pub fn bounded_paths_stay_in_workspace(root: &str, paths: &[String]) -> bool {',
    '    paths.len() <= MAX_CONTAINMENT_PATHS && paths_stay_in_workspace(root, paths)',
    '}',
    '',
    "/// A command's output together with the workspace files it changed, which the chat records for",
    "/// review like an ACP agent's.",
    '#[derive(Serialize, specta::Type)]',
    '#[serde(rename_all = "camelCase")]',
    'pub struct IntelligenceCommandRun {',
    '    #[serde(flatten)]',
    '    pub output: WorkspaceCommandOutput,',
    '    /// `None` when the workspace could not be compared, so changes went untracked.',
    '    pub file_changes: Option<WorkspaceChanges>,',
    '}',
    '',
    "/// Runs `command` in the workspace and reports the files it changed. A workspace that cannot be",
    '/// snapshotted or compared only loses the change list, never the command result.',
    'pub async fn run_tracked_workspace_command(',
  ],
};
