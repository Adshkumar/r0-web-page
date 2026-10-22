export interface IdeTheme {
  id: string;
  name: string;
  light: boolean;
  vars: Record<string, string>;
}

const r0Light: Record<string, string> = {
  bg: '#ffffff',
  bg2: '#f7f7f8',
  bg3: '#e9ebee',
  bg4: '#dee1e5',
  fg: '#1a1c1e',
  dim: '#50555b',
  faint: '#5e6369',
  line: '#dfe2e6',
  accent: '#075985',
  'accent-fg': '#14777d',
  sel: 'rgba(7, 89, 133, 0.22)',
  mark: 'rgba(7, 89, 133, 0.12)',
  'mark-active': '#075985',
  cur: '#f7f7f8',
  k: '#b83280',
  kt: '#4169a8',
  nf: '#14777d',
  nc: '#a15c00',
  nb: '#075e9e',
  nv: '#7656a8',
  no: '#a15c00',
  s: '#287d3c',
  m: '#a15c00',
  o: '#b83280',
  p: '#59636f',
  c: '#68717d',
  err: '#b92333',
  gi: '#187040',
  gd: '#b92333',
};

const r0Dark: Record<string, string> = {
  bg: '#18191b',
  bg2: '#101112',
  bg3: '#242629',
  bg4: '#2f3237',
  fg: '#e8e9ec',
  dim: '#abafb5',
  faint: '#959ba4',
  line: '#2c2e32',
  accent: '#38bdf8',
  'accent-fg': '#61c0bf',
  sel: 'rgba(56, 189, 248, 0.32)',
  mark: 'rgba(56, 189, 248, 0.16)',
  'mark-active': '#38bdf8',
  cur: '#101112',
  k: '#e879c6',
  kt: '#8fb8ff',
  nf: '#61c0bf',
  nc: '#e2a96b',
  nb: '#6cb6f1',
  nv: '#c8a2f4',
  no: '#e2a96b',
  s: '#8ccf9f',
  m: '#e2a96b',
  o: '#e879c6',
  p: '#a2a9b4',
  c: '#7f8793',
  err: '#f1737d',
  gi: '#52c68e',
  gd: '#f1737d',
};

export const THEMES: IdeTheme[] = [
  { id: 'r0-light', name: 'r0 Light', light: true, vars: r0Light },
  { id: 'r0-dark', name: 'r0 Dark', light: false, vars: r0Dark },
];
