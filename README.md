# Better Hono React

A modern monorepo authentication example featuring Hono API with Better Auth, React frontend, and deployment to Cloudflare Workers/Pages.

> This project was cloned from [alwaysnomads/better-hono](https://github.com/alwaysnomads/better-hono) and extended to add a React client and convert it to a Turborepo monorepo structure.

## Architecture

- **API** (`apps/api`): Hono + Better Auth on Cloudflare Workers
- **Web** (`apps/web`): React SPA on Cloudflare Pages
- **Shared Packages**: Types and auth client configuration

## Features

### Authentication
- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ Session-based auth with http-only cookies
- ✅ Rate limiting on auth endpoints
- ✅ Secure CORS configuration

### Frontend (React)
- ✅ Vite + React + TypeScript
- ✅ React Router for navigation
- ✅ Protected routes with auth guards
- ✅ Login/Register pages
- ✅ User dashboard
- ✅ Responsive design

### Backend (Hono)
- ✅ Cloudflare Workers deployment
- ✅ PostgreSQL with Drizzle ORM
- ✅ Type-safe environment variables with Zod
- ✅ Better Auth for authentication
- ✅ Middleware for sessions and CORS

### Developer Experience
- ✅ Turborepo for monorepo management
- ✅ Shared TypeScript types
- ✅ Hot reload in development
- ✅ Type checking across all packages
- ✅ Automatic Cloudflare preview deployments

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
# API environment variables
cp apps/api/.env.example apps/api/.env
cp apps/api/.env.example apps/api/.dev.vars

# Web environment variables
cp apps/web/.env.example apps/web/.env
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
- `BETTER_AUTH_SECRET`: Secret for auth tokens (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: API base URL (e.g., `http://localhost:3000` for dev)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FRONTEND_URL`: Frontend URL for CORS (optional)
- `CORS_ORIGINS`: Comma-separated additional CORS origins (optional)

### Web (`apps/web/.env`)
- `VITE_API_URL`: API base URL (e.g., `http://localhost:3000` for dev)

## Deployment

### Prerequisites
1. Create a Cloudflare account
2. Install Wrangler CLI (included in dependencies)
3. Set up a PostgreSQL database (e.g., Neon, Supabase)

### Deploy API (Cloudflare Workers)
```bash
cd apps/api

# Set production secrets
wrangler secret put DATABASE_URL
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET

# Deploy
pnpm deploy
```

### Deploy Web (Cloudflare Pages)
```bash
cd apps/web

# Build and deploy
pnpm deploy
```

### Production Environment Variables

For the web app, set these in your `.env.production`:
```
VITE_API_URL=https://your-api.workers.dev
```

### CORS Configuration

The API automatically allows all `*.pages.dev` and `*.workers.dev` origins. For custom domains, set:
- `FRONTEND_URL`: Your main frontend domain
- `CORS_ORIGINS`: Additional domains (comma-separated)

## Project Structure

```
better-hono-react/
├── apps/
│   ├── api/              # Hono API with Better Auth
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── middlewares/
│   │   │   ├── db/       # Database schema and migrations
│   │   │   └── lib/      # Utilities and auth config
│   │   └── wrangler.jsonc
│   └── web/              # React frontend
│       ├── src/
│       │   ├── pages/    # Route components
│       │   └── components/
│       └── vite.config.ts
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── auth-client/      # Better Auth client configuration
├── turbo.json            # Turborepo configuration
└── pnpm-workspace.yaml
```

## Key Commands

From the root directory:
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages
- `pnpm type-check` - Run TypeScript checks
- `pnpm dev:docker` - Start PostgreSQL container
- `pnpm dev:docker:down` - Stop PostgreSQL container

## Technologies Used

- **Frontend**: React, Vite, TypeScript, React Router
- **Backend**: Hono, Better Auth, Drizzle ORM
- **Database**: PostgreSQL
- **Deployment**: Cloudflare Workers/Pages
- **Monorepo**: Turborepo, pnpm workspaces
- **Styling**: CSS (easily extensible to Tailwind/etc)

## Contributing

Feel free to open issues or submit PRs. This is meant to be a reference implementation for modern full-stack TypeScript apps on Cloudflare.

## License

MIT
