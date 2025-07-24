import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import withSession from "@/middlewares/with-session";
import notFound from "@/middlewares/not-found";
import onError from "@/middlewares/on-error";
import authCors from "@/middlewares/auth-cors";
import { parseEnv } from "@/env";
import { AppBindings } from "@/lib/types";

export function createRouter() {
  return new Hono<AppBindings>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  
  // Parse environment first
  app.use((c, next) => {
    c.env = parseEnv(Object.assign(c.env || {}, process.env));
    return next();
  });

  // Configure CORS
  app.use("*", async (c, next) => {
    const env = c.env;
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:8788",
      "http://localhost:3000",
      ...(env.CORS_ORIGINS || []),
      env.FRONTEND_URL,
    ].filter((origin): origin is string => Boolean(origin));
    
    const corsMiddleware = cors({
      origin: (origin) => {
        if (!origin) return null;
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
          return origin;
        }
        
        // Allow any Cloudflare Pages or Workers deployment
        if (origin.endsWith('.pages.dev') || origin.endsWith('.workers.dev')) {
          return origin;
        }
        
        return null;
      },
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    });
    
    return corsMiddleware(c, next);
  });

  app.use("/api/auth/*", authCors);
  app.use("*", withSession);

  app.use(requestId());
  app.onError(onError);
  app.notFound(notFound);
  return app;
}
