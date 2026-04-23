import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.POSTHOG_KEY;
  const host = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) {
    console.warn("PostHog: POSTHOG_KEY not set — analytics disabled");
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage",
  });

  initialized = true;
}

export function trackEvent(
  eventType: string,
  properties: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;

  if (initialized) {
    posthog.capture(eventType, properties);
  }
}
