# Reusable prompt: site-wide background palette

Use one of the prompts below with any coding agent. The current palette is the visible slate palette. The old palette is the original near-white light theme and near-black dark theme.

## Restore the old palette

```text
Restore the exact site-wide background palette that was used before the recent slate-background update.

In src/styles/global.css, change only the listed background-related values.

For :root (dark theme), set:
--bg: #06070b
--bg-elev: #0b0c12
--panel: #0d0e16
--surface: rgba(192, 202, 245, 0.028)
--surface-2: rgba(192, 202, 245, 0.055)
--surface-solid: #0d0e16
--grid: rgba(192, 202, 245, 0.035)
--nav-bg: rgba(6, 7, 11, 0.84)

For :root[data-theme='light'], set:
--bg: #f4f5f8
--bg-elev: #ffffff
--panel: #ffffff
--surface: rgba(11, 13, 20, 0.025)
--surface-2: rgba(11, 13, 20, 0.05)
--surface-solid: #ffffff
--grid: rgba(11, 13, 20, 0.045)
--nav-bg: rgba(244, 245, 248, 0.88)

Restore the original atmosphere in src/styles/global.css:
- .atmos-glow uses radial gradients rgba(251, 191, 36, 0.09) at 22% 30% and rgba(122, 162, 247, 0.1) at 80% 20%, with blur(20px).
- :root[data-theme='light'] .atmos-glow has opacity: 0.7.
- .atmos-scan has opacity: 0.5 and repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.14) 0 1px, transparent 1px 3px).
- :root[data-theme='light'] .atmos-scan has opacity: 0.12.

In src/layouts/Layout.astro, set both the msapplication-TileColor and theme-color meta values to #f4f5f8.

Do not change text, layout, component backgrounds, spacing, typography, behavior, or unrelated theme tokens. Inspect the actual files first, make only these exact changes, then verify the global canvas and navigation in both themes on the home, Features, and Architecture pages. Run npm run build.
```

## Keep the current slate palette

```text
Keep or restore the current site-wide slate background palette. This is the palette currently intended for the website; do not revert it to the old near-white/near-black colors.

In src/styles/global.css, ensure these background-related values are set:

For :root (dark theme):
--bg: #111318
--bg-elev: #171a20
--panel: #1c2027
--surface: rgba(192, 202, 245, 0.035)
--surface-2: rgba(192, 202, 245, 0.065)
--surface-solid: #1c2027
--grid: rgba(192, 202, 245, 0.025)
--nav-bg: rgba(17, 19, 24, 0.9)

For :root[data-theme='light']:
--bg: #dde4ec
--bg-elev: #e9edf2
--panel: #d2dce7
--surface: rgba(35, 48, 64, 0.035)
--surface-2: rgba(35, 48, 64, 0.065)
--surface-solid: #e9edf2
--grid: rgba(35, 48, 64, 0.045)
--nav-bg: rgba(221, 228, 236, 0.94)

The current subtle atmosphere in src/styles/global.css is:
- .atmos-glow uses radial gradients rgba(251, 191, 36, 0.045) at 24% 24% and rgba(192, 202, 245, 0.035) at 78% 12%, with blur(30px).
- :root[data-theme='light'] .atmos-glow has opacity: 0.38.
- .atmos-scan has opacity: 0.22 and repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.07) 0 1px, transparent 1px 4px).
- :root[data-theme='light'] .atmos-scan has opacity: 0.035.

In src/layouts/Layout.astro, set both the msapplication-TileColor and theme-color meta values to #dde4ec.

Do not change text, layout, component backgrounds, spacing, typography, behavior, or unrelated theme tokens. Inspect the actual files first, make only these exact changes, then verify the global canvas and navigation in both themes on the home, Features, and Architecture pages. Run npm run build.
```

## How to use

Copy only the prompt for the desired state into your coding agent:

- To go back to the original colors, use **Restore the old palette**.
- To keep the colors currently in use, use **Keep the current slate palette**.
