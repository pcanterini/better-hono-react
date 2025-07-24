# Better Hono - Monorepo Authentication Example

A modern monorepo example featuring Hono API with Better Auth, React frontend, and deployment to Cloudflare Workers/Pages.

## Architecture

- **API** (`apps/api`): Hono + Better Auth on Cloudflare Workers
- **Web** (`apps/web`): React SPA on Cloudflare Pages
- **Shared Packages**: Types and auth client configuration

## Features

- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Session-based auth with http-only cookies
- ✅ Protected routes
- ✅ User dashboard
- ✅ Type-safe API with shared types
- ✅ Monorepo with Turborepo
- ✅ PostgreSQL with Drizzle ORM

## Local Development

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- pnpm

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start PostgreSQL:
```bash
pnpm dev:docker
```

3. Set up environment variables:
```bash
# Copy .env.example to .env in apps/api
cp apps/api/.env.example apps/api/.env
cp apps/api/.env apps/api/.dev.vars
```

4. Run database migrations:
```bash
cd apps/api && pnpm db:migrate
```

5. Start development servers:
```bash
# In the root directory
pnpm dev
```

This starts:
- API server at http://localhost:3000
- Web app at http://localhost:5173

## Environment Variables

### API (`apps/api/.env` and `.dev.vars`)
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret for auth tokens
- `BETTER_AUTH_URL`: API base URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FRONTEND_URL`: Frontend URL for CORS

### Web (`apps/web/.env`)
- `VITE_API_URL`: API base URL

## Deployment

### API (Cloudflare Workers)
```bash
cd apps/api && pnpm deploy
```

### Web (Cloudflare Pages)
```bash
cd apps/web && pnpm deploy
```

## Project Structure

```
better-hono-react/
├── apps/
│   ├── api/          # Hono API with Better Auth
│   └── web/          # React frontend
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── auth-client/  # Better Auth client configuration
├── turbo.json        # Turborepo configuration
└── pnpm-workspace.yaml
```
