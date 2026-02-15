# React + TypeScript + Vite

This project is built with React + TypeScript + Vite and uses Biome for linting and formatting.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Stack

This project uses the following stack:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Biome**: Linter and formatter for JavaScript/TypeScript.
- **React Query**: A library for fetching, caching, and updating asynchronous data in React applications.

## Project Architecture

The project is organized by feature domains instead of technical layers.

```text
src/
├── app/
│   └── routing/            # Global router and routing helpers
├── assets/                 # Static files (css, svg, etc.)
├── features/               # Domain features
│   ├── forms/
│   │   ├── api/            # React Query hooks and feature API calls
│   │   ├── components/     # Feature-specific UI components
│   │   ├── model/          # Types and view-model hooks
│   │   └── pages/          # Route pages
│   ├── home/
│   ├── innovation/
│   ├── navigation/
│   ├── profile/
│   └── settings/
└── shared/
    ├── lib/                # Shared utilities (api client, cn, etc.)
    └── ui/
        ├── design/         # Project design system components
        └── primitives/     # Low-level reusable UI primitives
```

### Folder Rules

- Keep domain logic inside `src/features/<feature-name>/`.
- Put reusable code in `src/shared/` only when it is truly cross-feature.
- Keep route composition in `src/app/routing/`.
- Add API hooks near the feature that consumes them (`features/*/api`).
- Prefer `@/` imports for consistency.

## Installation

This project uses `pnpm` as the package manager. To install the dependencies, run:

```sh
pnpm install
```

## Environment Variables

Required:

```env
VITE_API_URL=http://localhost:8000
```

## Code Quality

Run the following before opening a PR:

```sh
pnpm tsc
pnpm lint
pnpm format
```
