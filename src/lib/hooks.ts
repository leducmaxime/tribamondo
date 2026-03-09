import { useSyncExternalStore } from "react";

export function usePathname(): string {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("popstate", callback);

      const originalPushState = history.pushState.bind(history);
      const originalReplaceState = history.replaceState.bind(history);

      history.pushState = (...args) => {
        originalPushState(...args);
        callback();
      };
      history.replaceState = (...args) => {
        originalReplaceState(...args);
        callback();
      };

      return () => {
        window.removeEventListener("popstate", callback);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    },
    () => window.location.pathname,
    () => "/",
  );
}
