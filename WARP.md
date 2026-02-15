# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

**Package Manager**: Use `pnpm` (not npm/yarn)

```bash
pnpm install           # Install dependencies
pnpm dev              # Start development server (Vite)
pnpm build            # TypeScript compilation + Vite build
pnpm tsc              # Type checking only (with increased memory allocation)
pnpm biome            # Linting with Biome (diagnostic level: error)
pnpm format           # Code formatting with Biome
pnpm lint             # Alias of Biome lint
pnpm preview          # Preview production build
pnpm knip             # Detect unused dependencies
```

**Quality Assurance**: Always run `pnpm tsc` and `pnpm biome` before committing changes.

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v7 with lazy loading
- **State Management**: React Query (server state)
- **UI**: shadcn/ui components + Tailwind CSS (new-york style)
- **HTTP Client**: Axios
- **Code Quality**: Biome (linter + formatter), TypeScript strict mode

### Project Structure

```
src/
├── app/routing/           # Router and routing helpers
├── features/              # Domain features (forms, navigation, innovation, etc.)
├── assets/                # Static assets (css, svg)
└── shared/                # Shared UI and utilities
```

### Routing Architecture

Single application layout:
1. **AuthenticatedLayout** - Main app shell with sidebar navigation (`/home`, `/forms`, `/innovation`, `/profile`, `/settings`)

### State Management Patterns

- **Server State**: React Query with centralized `QueryClient` in `main.tsx`
- **API Pattern**: All API functions return React Query hooks
  ```typescript
  // Standard API pattern
  const getFormTemplates = async () => {
    const { data } = await api.get('/endpoint')
    return data
  }
  
  export const useFormTemplates = () => {
    return useQuery({
      queryKey: ['formTemplates'],
      queryFn: getFormTemplates
    })
  }
  ```

### Component Patterns

- **Feature Organization**: Related components, types, and ViewModels grouped in feature directories
- **UI Components**: Shared UI lives in `src/shared/ui/` split into `design` and `primitives`
- **Import Strategy**: Always use `@/` path aliases instead of relative paths
- **Forwarding**: Consistent use of `React.forwardRef` for reusable components

## Code Quality Standards

### Biome Configuration
- **Formatter**: 2-space indentation, 150 character line width, LF line endings
- **Linter**: Strict rules for unused imports/variables, no console logs (except errors)
- **TypeScript**: Strict mode with separate configs for app and build tools

### Import Conventions
- Use `@/` path aliases exclusively
- Common mappings: `@/features/*`, `@/shared/*`, `@/app/routing/*`

### API Integration
- Base URL from `VITE_API_URL` environment variable
- All API calls should use the configured axios instance in `src/shared/lib/apiClient.ts`
- Follow the established pattern: async function + useQuery hook export

## Environment Configuration

**Required Environment Variables:**
- `VITE_API_URL` - Backend API base URL

**Development Tools:**
- Vite dev server with HMR
- TypeScript with increased memory allocation for large codebases
- shadcn/ui with CSS variables for theming

## Common Patterns and Gotchas

- **New API Endpoints**: Must provide both the async function and the useQuery hook export
- **Form Components**: Follow existing patterns in `FormTemplates/` feature directory
- **Environment Access**: Use `import.meta.env` for Vite environment variables
- **Component Styling**: Use `cn()` utility from `@/shared/lib/utils` for class merging with Tailwind
