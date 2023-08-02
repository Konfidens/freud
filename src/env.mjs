import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    OPENAI_API_KEY: z.string(),
    WEAVIATE_API_KEY: z.string(),
    WEAVIATE_SCHEME: z.string(),
    WEAVIATE_HOST: z.string(),
    DATABASE_URL: z.string(),
    WEAVIATE_API_KEY_DIAGNOSIS: z.string(),
    WEAVIATE_SCHEME_DIAGNOSIS: z.string(),
    WEAVIATE_HOST_DIAGNOSIS: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_NODE_ENV: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    WEAVIATE_API_KEY: process.env.WEAVIATE_API_KEY,
    WEAVIATE_SCHEME: process.env.WEAVIATE_SCHEME,
    WEAVIATE_HOST: process.env.WEAVIATE_HOST,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    WEAVIATE_API_KEY_DIAGNOSIS: process.env.WEAVIATE_API_KEY_DIAGNOSIS,
    WEAVIATE_SCHEME_DIAGNOSIS: process.env.WEAVIATE_SCHEME_DIAGNOSIS,
    WEAVIATE_HOST_DIAGNOSIS: process.env.WEAVIATE_HOST_DIAGNOSIS,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
