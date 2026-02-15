# LabLink Client - AI Coding Agent Instructions

## Project Overview

This is a React TypeScript application built with Vite for laboratory innovation management, focused on structural UI components and feature domains.

## Architecture & Key Patterns

### Directory Structure

- `src/app/routing/` - Router and routing helpers
- `src/features/` - Domain features (forms, navigation, innovation, etc.)
- `src/shared/ui/` - Shared UI primitives and design components
- `src/shared/lib/` - Shared utilities (API client, class helpers)

### Routing Strategy

Uses React Router with a single app shell layout:
- `AuthenticatedLayout` - Main app with sidebar navigation (`/home`, `/forms`, etc.)

### State Management

- **Server State**: React Query with centralized `QueryClient` in `main.tsx`
- **API Layer**: Axios instance configured in `src/shared/lib/apiClient.ts`

### Component Patterns

- Mix of shadcn/ui components (`src/components/ui/`) and custom design components (`src/app/components/design/`)
- Feature-based organization: `src/app/features/FormTemplates/` contains related components, types, and ViewModels
- Consistent use of React.forwardRef for reusable components

## Development Workflow

### Commands

```bash
pnpm dev          # Start development server
pnpm build        # TypeScript compilation + Vite build
pnpm tsc          # Type checking only (with increased memory)
pnpm biome        # Linting with Biome
pnpm format       # Code formatting with Biome
```

### Code Quality Tools

- **Biome**: Primary linter and formatter (replaces ESLint + Prettier)
- **TypeScript**: Strict type checking with separate configs for app and build tools
- **Knip**: Unused dependency detection

## Key Integration Points

### API Communication

- Base URL from `VITE_API_URL` environment variable
- All API functions in `src/api/` return React Query hooks
- Standard pattern: `const { data } = await api.get('/endpoint')` then wrap in useQuery

### Styling System

- Tailwind CSS with shadcn/ui design system
- CSS variables for theming (`cssVariables: true` in components.json)
- Custom components extend shadcn patterns with `cn()` utility for class merging

## Environment & Build

- **Package Manager**: pnpm (not npm/yarn)
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `src/` directory
- **Environment**: Uses `import.meta.env` for Vite environment variables

## Common Gotchas

- Always use `@/` imports instead of relative paths
- New API endpoints need both the async function and useQuery hook export
- Form components should follow the existing pattern in `FormTemplates/` feature
