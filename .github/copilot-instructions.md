# LabLink Client - AI Coding Agent Instructions

## Project Overview

This is a React TypeScript application built with Vite for laboratory innovation management. It features Google OAuth authentication, form template management, and mind mapping capabilities.

## Architecture & Key Patterns

### Directory Structure

- `src/app/` - Authenticated application features and layouts
- `src/guest/` - Unauthenticated pages (login, signup)
- `src/components/ui/` - shadcn/ui components
- `src/app/components/design/` - Custom design system components
- `src/store/` - Zustand state management
- `src/api/` - React Query hooks and API layer

### Routing Strategy

Uses React Router with three layout boundaries:

- `GuestLayout` - For unauthenticated users (`/login`, `/signup`)
- `AuthenticatedLayout` - Main app with sidebar navigation (`/home`, `/forms`, etc.)
- `MindMappingLayout` - Specialized layout for brainstorming (`/brainstorming`)

Route guards: `ProtectedRoute` and `GuestRoute` components enforce authentication boundaries.

### State Management

- **Auth**: Zustand store (`useAuthStore`) with localStorage persistence for tokens
- **Server State**: React Query with centralized `QueryClient` in `main.tsx`
- **API Layer**: Axios instance with automatic JWT token injection via interceptors

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

### Authentication Flow

1. Google OAuth via `@react-oauth/google` (clientId from `VITE_GOOGLE_CLIENT_ID`)
2. JWT token stored in localStorage via Zustand
3. Axios interceptor automatically adds `Bearer` token to requests
4. Route guards redirect based on auth state

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
- Authentication state changes require both Zustand store updates AND localStorage sync
