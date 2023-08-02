import weaviate from "weaviate-ts-client";
import { env } from "~/env.mjs";

export const client = weaviate.client({
  scheme: env.WEAVIATE_SCHEME,
  host: env.WEAVIATE_HOST,
  apiKey: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
});

export const client_diagnosis = weaviate.client({
  scheme: env.WEAVIATE_SCHEME_DIAGNOSIS,
  host: env.WEAVIATE_HOST_DIAGNOSIS,
  apiKey: new weaviate.ApiKey(env.WEAVIATE_API_KEY_DIAGNOSIS),
});
