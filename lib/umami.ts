type UmamiTracker = {
  track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
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

  try {
    window.umami?.track(eventName, eventData);
  } catch {
    // Analytics must never interrupt checkout or browsing.
  }
}
