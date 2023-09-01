import Bugsnag from '@bugsnag/react-native';
import {MutableRefObject, useEffect, useRef} from 'react';

const RETRY_INTERVAL_CAP_IN_SECONDS = 10;

export type SubscriptionProps = {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onError?: (event: WebSocketCloseEvent) => void;
  url: string | null;
  enabled: boolean;
};

export function useSubscription({
  url,
  onMessage,
  onError,
  enabled,
}: SubscriptionProps) {
  const webSocket = useRef<WebSocket | null>(null);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    if (!url || !enabled) return;

    let retryTimeout: NodeJS.Timeout | null = null;
    const connect = () => {
      const ws = new WebSocket(url);

      ws.onmessage = (event) => {
        onMessage?.(event);
      };

      ws.onclose = (event) => {
        // Reconnect immediately if close event is expected, otherwise use
        // exponetial backoff to retry.
        if (
          event.code === 1000 ||
          event.code === 1001 ||
          event.code === undefined
        ) {
          Bugsnag.leaveBreadcrumb(`WebSocket closed with code ${event.code}`);
          connect();
        } else {
          if (event.code === 1006 && retryCount.current <= 3) {
            // Might be caused by Android WS implementation closing connection.
            // Should retry immediately, but this might also be an real issue
            // where auto-reconnect can cause infinite loop. So instead try to leave
            // breadcrumb if it happens under 3 times, but treat as normal retry flow.
            Bugsnag.leaveBreadcrumb(
              `WebSocket closed with code ${event.code} (retry: ${retryCount})`,
            );
          } else {
            Bugsnag.notify(
              `WebSocket closed with unexpected code ${event.code} "${event.message}" (${event.reason})`,
            );
          }
          retryTimeout = retryWithCappedBackoff(retryCount, connect);
          onError?.(event);
        }
      };

      ws.onopen = () => {
        Bugsnag.leaveBreadcrumb(`WebSocket opened with url: ${url}`);
        retryCount.current = 0;
      };

      webSocket.current = ws;
    };
    connect();

    // Cleanup
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (webSocket.current) {
        webSocket.current.onclose = null;
        webSocket.current.close();
      }
      webSocket.current = null;
    };
  }, [url, enabled, onMessage, onError]);
}

/**
 * Exponential backoff, capped at RETRY_INTERVAL_CAP_IN_SECONDS between retries.
 *
 * @param retryCount Mutable ref, number of times there has been a retry
 * @param retry Retry function.
 * @returns NodeJS Timeout, to use in cleanup or refresh.
 */
const retryWithCappedBackoff = (
  retryCount: MutableRefObject<number>,
  retry: () => void,
) => {
  const delay = Math.min(
    Math.pow(2, retryCount.current) * 1000,
    RETRY_INTERVAL_CAP_IN_SECONDS * 1000,
  );
  return setTimeout(() => {
    retryCount.current = retryCount.current + 1;
    retry();
  }, delay);
};
