import { PostHog } from "posthog-node";

let client: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  if (client) return client;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) return null;

  client = new PostHog(key, { host });
  return client;
}
