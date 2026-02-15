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
- **State Management**: Zustand (auth) + React Query (server state)
- **UI**: shadcn/ui components + Tailwind CSS (new-york style)
- **Authentication**: Google OAuth via `@react-oauth/google`
- **HTTP Client**: Axios with automatic JWT token injection
- **Code Quality**: Biome (linter + formatter), TypeScript strict mode

### Project Structure

```
src/
├── app/                    # Authenticated application
│   ├── layout/            # Layout components (AuthenticatedLayout, MindMappingLayout)
│   ├── features/          # Feature-based modules (FormTemplates/, navbar/)
│   ├── pages/             # Page components (forms/, profile/, etc.)
│   └── components/        # Custom design system components
├── guest/                 # Unauthenticated pages and layouts
├── api/                   # React Query hooks and API functions
├── store/                 # Zustand stores (auth.ts)
├── hooks/                 # Custom hooks (useGoogleAuth.ts)
├── routes/                # Router configuration and route guards
├── lib/                   # Utilities (axios.ts, utils.ts)
└── components/ui/         # shadcn/ui components
```

### Routing Architecture

Three distinct layout boundaries:
1. **GuestLayout** - Unauthenticated routes (`/login`, `/signup`, `/reset-password`)
2. **AuthenticatedLayout** - Main app with sidebar navigation (`/home`, `/forms`, `/innovation`, `/profile`, `/settings`)
3. **MindMappingLayout** - Specialized full-screen layout (`/brainstorming`)

Route guards: `ProtectedRoute` and `GuestRoute` enforce authentication boundaries.

### Authentication Flow

1. Google OAuth integration with client ID from `VITE_GOOGLE_CLIENT_ID`
2. JWT token stored in localStorage via Zustand store
3. Axios interceptor automatically adds `Bearer` token to requests
4. Route guards redirect based on authentication state

### State Management Patterns

- **Authentication**: Zustand store (`useAuthStore`) with localStorage persistence
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
- **UI Components**: Mix of shadcn/ui (`src/components/ui/`) and custom design components (`src/app/components/design/`)
- **Import Strategy**: Always use `@/` path aliases instead of relative paths
- **Forwarding**: Consistent use of `React.forwardRef` for reusable components

## Code Quality Standards

### Biome Configuration
- **Formatter**: 2-space indentation, 150 character line width, LF line endings
- **Linter**: Strict rules for unused imports/variables, no console logs (except errors)
- **TypeScript**: Strict mode with separate configs for app and build tools

### Import Conventions
- Use `@/` path aliases exclusively
- Path mappings: `@/components`, `@/lib/utils`, `@/hooks`, etc.

### API Integration
- Base URL from `VITE_API_URL` environment variable
- All API calls should use the configured axios instance with automatic token injection
- Follow the established pattern: async function + useQuery hook export

## Environment Configuration

**Required Environment Variables:**
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_API_URL` - Backend API base URL

**Development Tools:**
- Vite dev server with HMR
- TypeScript with increased memory allocation for large codebases
- shadcn/ui with CSS variables for theming

## Common Patterns and Gotchas

- **Authentication Updates**: Changes to auth state require both Zustand store updates AND localStorage synchronization
- **New API Endpoints**: Must provide both the async function and the useQuery hook export
- **Form Components**: Follow existing patterns in `FormTemplates/` feature directory
- **Environment Access**: Use `import.meta.env` for Vite environment variables
- **Component Styling**: Use `cn()` utility from `@/lib/utils` for class merging with Tailwind
