import { createRouter } from "@/lib/create-app";
import { getCachedAuth } from "@/lib/auth-cache";
import { authRateLimit } from "@/middlewares/rate-limit";

const router = createRouter()
  .use('/sign-in', authRateLimit)
  .use('/sign-up', authRateLimit)
  .all('/*', (c) => {
    const auth = getCachedAuth(c.env);
    return auth.handler(c.req.raw);
  })

export default router
