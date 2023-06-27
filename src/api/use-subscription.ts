import Bugsnag from '@bugsnag/react-native';
import {MutableRefObject, useEffect, useRef} from 'react';

const RETRY_INTERVAL_CAP_IN_SECONDS = 10;

export type SubscriptionEventProps = {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onError?: (event: WebSocketCloseEvent) => void;
};

export function useSubscription({
  url,
  onMessage,
  onError,
}: {url: string | null} & SubscriptionEventProps) {
  const ws = useRef<WebSocket | null>(null);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    if (!url) return;

    let retryTimeout: NodeJS.Timeout | null = null;
    const connect = () => {
      const webSocket = new WebSocket(url);

      webSocket.onmessage = (event) => {
        onMessage && onMessage(event);
      };

      webSocket.onclose = (event) => {
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
          Bugsnag.notify(
            `WebSocket closed with unexpected code ${event.code} "${event.message}" (${event.reason})`,
          );
          retryTimeout = retryWithCappedBackoff(retryCount, connect);
          onError && onError(event);
        }
      };

      webSocket.onopen = () => {
        Bugsnag.leaveBreadcrumb(`WebSocket opened with url: ${url}`);
        retryCount.current = 0;
      };

      ws.current = webSocket;
    };
    connect();

    // Cleanup
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
      ws.current = null;
    };
  }, [url]);
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
