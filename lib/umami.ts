type UmamiTracker = {
  track: (
    eventName: string,
    eventData?: Record<string, string | number | boolean>,
  ) => void | Promise<void>;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export function trackUmamiEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") {
    return;
  }

  const tracker = window.umami;
  if (!tracker?.track) {
    console.log(`[Umami] ${eventName} skipped — window.umami.track is not available`, eventData ?? {});
    return;
  }

  try {
    console.log(`[Umami] ${eventName}`, eventData ?? {});
    void tracker.track(eventName, eventData);
  } catch (error) {
    console.log(`[Umami] ${eventName} failed`, error);
  }
}
