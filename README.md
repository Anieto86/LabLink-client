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
- **Zustand**: A small, fast, and scalable bearbones state-management solution using simplified flux principles.

## Installation

This project uses `pnpm` as the package manager. To install the dependencies, run:

```sh
pnpm install
```

## Code Quality

Run the following before opening a PR:

```sh
pnpm tsc
pnpm lint
pnpm format
```
