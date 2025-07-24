# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better-Hono-React is a modern Hono framework application optimized for Cloudflare Workers with:
- Better Auth for authentication (Google OAuth pre-configured)
- Drizzle ORM with PostgreSQL
- TypeScript with strict typing
- Docker for local development
- Zod for environment validation

## Common Development Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run dev:docker` - Start local PostgreSQL via Docker
- `npm run dev:docker:down` - Stop Docker containers

### Database
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Apply pending migrations
- `npm run db:migrate:prod` - Apply migrations to production
- `npm run db:studio` - Open Drizzle Studio GUI (localhost:3002)
- `npm run db:push` - Push schema changes without migrations (dev only)

### Type Generation
- `npm run generate:types` - Generate TypeScript types for Cloudflare bindings

### Deployment
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare types from wrangler.toml

## Architecture

### Key Design Decisions
1. **Per-request database connections** - Each request creates a new DB connection for serverless efficiency
2. **Environment-specific configs** - `.env` for local dev with Node.js, `.dev.vars` for wrangler dev
3. **Type-safe environment** - All env vars validated through `src/env.ts` using Zod schemas
4. **Middleware stack** - Applied in order: auth session → CORS → error handling → routes

### Directory Structure
```
src/
├── routes/          # API endpoints, each file exports a Hono app
├── middlewares/     # Reusable middleware (auth, session, etc.)
├── db/
│   ├── schema.ts    # Drizzle schema definitions
│   └── index.ts     # Database connection setup
├── lib/             # Shared utilities
├── env.ts           # Environment validation and typing
└── index.ts         # Main app entry point
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

**Environment Variables** (validated in src/env.ts):
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth signing secret
- `BETTER_AUTH_URL` - Base URL for auth callbacks
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials

**Cloudflare Bindings** (in wrangler.toml):
- Automatically typed via `npm run generate:types`
- Available on `c.env` in handlers

### Important Patterns

1. **Database Access**: Always use `c.var.db` from middleware, never import directly
2. **Error Handling**: Throw HTTPException for proper error responses
3. **Type Safety**: Leverage generated types from database and Cloudflare
4. **Migrations**: Always use migrations for schema changes, never direct pushes in production

## Memories and Notes

### Authentication and Authorization
- For auth related tasks we use better-auth and you can check llms.txt for reference before implementing or changing any features/tasks
