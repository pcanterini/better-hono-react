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
  app.use((c, next) => {
    c.env = parseEnv(Object.assign(c.env || {}, process.env));
    return next();
  });

  // Configure CORS
  app.use(
    "*",
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:8788",
        "http://localhost:3000",
        "https://better-hono-react-web.pages.dev",
        "https://*.better-hono-react-web.pages.dev",
      ],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use("/api/auth/*", authCors);
  app.use("*", withSession);

  app.use(requestId());
  app.onError(onError);
  app.notFound(notFound);
  return app;
}
