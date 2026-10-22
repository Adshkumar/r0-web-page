# r0 Website

This repository contains the Astro website for [r0](https://github.com/Adshkumar/r0), a desktop code editor built with Rust, Tauri, and React.

## Development

Install dependencies with Node.js and run the local server:

```sh
npm install
npm run dev
```

Build and preview the static site:

```sh
npm run build
npm run preview
```

## Project structure

- `src/components/` - shared website and product-preview components
- `src/content/` - documentation and blog content
- `src/data/` - release links, changelog, and editor-preview data
- `src/pages/` - Astro routes
- `public/` - static site assets and metadata
- `scripts/` - website-specific validation and screenshot tools

The product repository and its release notes are the source of truth for r0 features, supported platforms, and installation steps.
