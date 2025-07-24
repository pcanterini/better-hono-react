import { createAuth } from "@/lib/auth";
import { Environment } from "@/env";

let authInstance: ReturnType<typeof createAuth> | null = null;
let lastEnvHash: string | null = null;

function hashEnv(env: Environment): string {
  return JSON.stringify({
    BETTER_AUTH_URL: env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: env.DATABASE_URL,
  });
}

export function getCachedAuth(env: Environment) {
  const currentEnvHash = hashEnv(env);
  
  if (authInstance && lastEnvHash === currentEnvHash) {
    return authInstance;
  }
  
  authInstance = createAuth(env);
  lastEnvHash = currentEnvHash;
  
  return authInstance;
}