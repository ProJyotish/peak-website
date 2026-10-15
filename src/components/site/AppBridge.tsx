import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type BridgeWindow = Window & { PeakBridge?: { postMessage: (message: string) => void } };

/** Message to the app: the native WebView's JS channel, or the parent window around an iframe. */
function postToApp(message: object) {
  const json = JSON.stringify(message);
  const w = window as BridgeWindow;
  if (w.PeakBridge) w.PeakBridge.postMessage(json);
  else if (window.parent !== window) window.parent.postMessage(json, "*");
}

/** Names the current page in the app's header (e.g. the pooja on a product page); cleared on leaving it. */
export function useAppTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title || document.documentElement.dataset.embed !== "app") return;
    postToApp({ type: "title", title });
    return () => postToApp({ type: "title", title: null });
  }, [title]);
}

/**
 * In the app's WebView, the app draws the back arrow: it is told after every route change whether
 * the site has a page to go back to, and sends `{"type":"back"}` when it is tapped. An iframe's
 * history is out of the app's reach otherwise.
 */
export function AppBridge() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (document.documentElement.dataset.embed !== "app") return;
    // react-router numbers its history entries; 0 is where the WebView started.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    postToApp({ type: "nav", canGoBack: idx > 0 });
  }, [location]);

  useEffect(() => {
    if (document.documentElement.dataset.embed !== "app") return;
    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      try {
        if ((JSON.parse(event.data) as { type?: string }).type === "back") navigate(-1);
      } catch {
        // Not ours.
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  return null;
}
