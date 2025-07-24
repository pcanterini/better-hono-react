import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "@/db";
import { openAPI } from "better-auth/plugins"
import { Environment } from "@/env";

export const createAuth = (env: Environment) => {
  const db = createDb(env); // create db per request
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      },
    },
    database: drizzleAdapter(db, {
      provider: "pg"
    }),
    trustedOrigins: [
      "http://localhost:5173", // Local Vite dev server
      "http://localhost:8788", // Local Cloudflare Pages
      env.FRONTEND_URL || "" // Production frontend URL
    ].filter(Boolean),
    plugins: [
      openAPI(),
    ]
  });
};