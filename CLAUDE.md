# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better-Hono-React is a modern monorepo application optimized for Cloudflare Workers with:
- **Monorepo Structure** using Turbo and pnpm workspaces
- **Better Auth** for authentication (Google OAuth pre-configured)
- **Drizzle ORM** with PostgreSQL
- **TypeScript** with strict typing
- **Docker** for local development
- **Zod** for environment validation

## Monorepo Structure

```
.
├── apps/
│   ├── api/          # Hono API server (Cloudflare Workers)
│   └── web/          # React frontend (Vite + Cloudflare Pages)
├── packages/
│   ├── auth-client/  # Shared auth client for frontend
│   └── types/        # Shared TypeScript types
└── turbo.json        # Turbo configuration
```

## Common Development Commands

### Development
- `pnpm run dev` - Start all apps in development mode
- `pnpm run dev:docker` - Start local PostgreSQL via Docker
- `pnpm run dev:docker:down` - Stop Docker containers
- `pnpm run type-check` - Run TypeScript type checking across all packages
- `pnpm run build` - Build all packages

### Database (run from root or apps/api)
- `pnpm run db:generate` - Generate Drizzle migrations from schema changes
- `pnpm run db:migrate` - Apply pending migrations
- `pnpm run db:migrate:prod` - Apply migrations to production
- `pnpm run db:studio` - Open Drizzle Studio GUI (localhost:3002)
- `pnpm run db:push` - Push schema changes without migrations (dev only)

### Type Generation
- `pnpm run generate:types` - Generate TypeScript types for Cloudflare bindings

### Deployment
- `pnpm run deploy` - Deploy all apps to Cloudflare

## Architecture

### Key Design Decisions
1. **Monorepo with Turbo** - Efficient builds and type-safe package sharing
2. **Per-request database connections** - Each request creates a new DB connection for serverless efficiency
3. **Environment-specific configs** - `.env` for local dev with Node.js, `.dev.vars` for wrangler dev
4. **Type-safe environment** - All env vars validated through `src/env.ts` using Zod schemas
5. **Middleware stack** - Applied in order: CORS → auth session → error handling → routes
6. **Rate limiting** - Auth endpoints protected with rate limiting middleware
7. **Auth caching** - Better Auth instance cached to improve performance

### API Directory Structure (apps/api/src/)
```
src/
├── routes/          # API endpoints, each file exports a Hono app
│   └── auth/        # Auth-related routes with rate limiting
├── middlewares/     # Reusable middleware
│   ├── auth-cors.ts # Auth-specific CORS
│   ├── rate-limit.ts # Rate limiting middleware
│   └── with-session.ts # Session middleware
├── db/
│   ├── schema.ts    # Drizzle schema definitions
│   └── index.ts     # Database connection setup
├── lib/             # Shared utilities
│   ├── auth.ts      # Better Auth configuration
│   ├── auth-cache.ts # Auth instance caching
│   └── create-app.ts # App factory with middleware
├── env.ts           # Environment validation and typing
└── app.ts           # Main app entry point
```

### Adding New Features

**New API Route**:
1. Create file in `src/routes/` exporting a Hono app
2. Import and mount in `src/index.ts` using `app.route()`
3. Routes automatically inherit middleware stack

**New Database Table**:
1. Add schema to `src/db/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply locally
4. Access via `c.var.db` in route handlers

**Authentication Requirements**:
- Use `requireAuth` middleware for protected routes
- Access user via `c.var.user` in authenticated handlers
- Session available at `c.var.session`

### Configuration

**Environment Variables** (validated in apps/api/src/env.ts):
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth signing secret
- `BETTER_AUTH_URL` - Base URL for auth callbacks
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `FRONTEND_URL` - Frontend URL for CORS (optional)
- `CORS_ORIGINS` - Comma-separated list of additional CORS origins (optional)

**Cloudflare Bindings** (in wrangler.jsonc):
- Automatically typed via `pnpm run generate:types`
- Available on `c.env` in handlers

### Important Patterns

1. **Database Access**: Create DB connection per request using `createDb(env)`
2. **Error Handling**: Throw HTTPException for proper error responses
3. **Type Safety**: Leverage generated types from database and Cloudflare
4. **Migrations**: Always use migrations for schema changes, never direct pushes in production
5. **Auth Instance**: Use `getCachedAuth(env)` instead of `createAuth(env)` for better performance
6. **Package Management**: Always use `pnpm` (not npm) for consistency

## Security Improvements Implemented

1. **Rate Limiting**: Auth endpoints (sign-in/sign-up) are rate-limited to prevent brute force attacks
2. **Dynamic CORS**: CORS origins can be configured via environment variables
3. **Environment Validation**: All environment variables are validated with Zod schemas
4. **Type-safe Auth Client**: Auth client exports are properly typed to avoid type inference issues

## Performance Optimizations

1. **Auth Caching**: Better Auth instance is cached and reused across requests
2. **Efficient Middleware Stack**: Middleware order optimized for performance
3. **Type Checking**: Monorepo-wide type checking ensures type safety without runtime overhead

## Memories and Notes

### Authentication and Authorization
- For auth related tasks we use better-auth and you can check llms.txt for reference before implementing or changing any features/tasks
- Rate limiting is applied to `/api/auth/sign-in` and `/api/auth/sign-up` endpoints
- Auth client is available as a shared package at `@better-hono-react/auth-client`
