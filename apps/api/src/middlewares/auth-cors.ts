import type { MiddlewareHandler } from 'hono';
import { cors } from "hono/cors";
import { AppBindings } from '@/lib/types';

const authCors: MiddlewareHandler<AppBindings> = async (c, next) => {
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
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
    });

    return corsMiddleware(c, next);
};

export default authCors;