import Bugsnag from '@bugsnag/react-native';
import {MutableRefObject, useEffect, useRef} from 'react';

const RETRY_INTERVAL_CAP_IN_SECONDS = 10;

export type SubscriptionProps = {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onClose?: (event: WebSocketCloseEvent) => void;
  onOpen?: (ws: WebSocket) => void;
  url: string | null;
  enabled: boolean;
};

export function useSubscription({
  url,
  onMessage,
  onClose,
  onOpen,
  enabled,
}: SubscriptionProps) {
  const webSocket = useRef<WebSocket | null>(null);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    if (!url || !enabled) return;

    let retryTimeout: NodeJS.Timeout | null = null;
    let resetRetryCountTimeout: NodeJS.Timeout | null = null;
    const connect = () => {
      const ws = new WebSocket(url);

      ws.onmessage = (event) => {
        onMessage?.(event);
      };

      ws.onclose = (event) => {
        if (resetRetryCountTimeout) clearTimeout(resetRetryCountTimeout);

        // 1000: normal closure. The purpose for the connection has been
        //       fulfilled.
        // 1001: "going away", such as a server going down or a browser having
        //       navigated away from a page.
        // 1006: The connection was closed abnormally, but not by the server.
        //       Can be returned by the Android or iOS websocket implementations
        //       on issues like network errors.
        const expectedCodes = [1000, 1001, 1006];

        if (event.code && !expectedCodes.includes(event.code)) {
          Bugsnag.notify(
            `WebSocket closed with code ${event.code} "${event.message}" (${event.reason})`,
          );
        } else {
          Bugsnag.leaveBreadcrumb(
            `WebSocket closed with code ${event.code} (retry: ${retryCount.current})`,
          );
        }
        retryTimeout = retryWithCappedBackoff(retryCount, connect);
        onClose?.(event);
      };

      ws.onopen = () => {
        Bugsnag.leaveBreadcrumb(`WebSocket opened with url: ${url}`);
        if (onOpen) onOpen(ws);

        // If setup or authentication fails, the connection might be closed
        // after a slight delay, so we reset the retry count only when we can
        // assume the connection is stable.
        resetRetryCountTimeout = setTimeout(() => {
          retryCount.current = 0;
        }, 1000);
      };

      webSocket.current = ws;
    };
    connect();

    // Cleanup
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (resetRetryCountTimeout) clearTimeout(resetRetryCountTimeout);
      if (webSocket.current) {
        webSocket.current.onclose = null;
        webSocket.current.close();
      }
      webSocket.current = null;
    };
  }, [url, enabled, onMessage, onClose, onOpen]);
}

/**
 * Exponential backoff, capped at RETRY_INTERVAL_CAP_IN_SECONDS between retries.
 *
 * @param retryCount Mutable ref, number of times there has been a retry
 * @param retry Retry function.
 * @returns Timeout ID, to use in cleanup or refresh.
 */
const retryWithCappedBackoff = (
  retryCount: MutableRefObject<number>,
  retry: () => void,
): NodeJS.Timeout => {
  const delay = Math.min(
    Math.pow(2, retryCount.current) * 1000,
    RETRY_INTERVAL_CAP_IN_SECONDS * 1000,
  );
  return setTimeout(() => {
    retryCount.current = retryCount.current + 1;
    retry();
  }, delay);
};
