import Bugsnag from '@bugsnag/react-native';
import {MutableRefObject, useEffect, useRef, useState} from 'react';

const RETRY_INTERVAL_CAP_IN_SECONDS = 10;

export type SubscriptionStatus =
  | 'CONNECTING'
  | 'OPEN'
  | 'CLOSING'
  | 'CLOSED'
  | 'NOT_STARTED';

export type SubscriptionEventProps = {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onOpen?: () => void;
  onClose?: (event: WebSocketCloseEvent & {isError: boolean}) => void;
};

export function useSubscription({
  url,
  onMessage,
  onClose,
  onOpen,
}: {url: string | null} & SubscriptionEventProps) {
  const [status, setStatus] = useState<SubscriptionStatus>('NOT_STARTED');
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    if (!url) return;

    let retryTimeout: NodeJS.Timeout | null = null;
    const connect = () => {
      const webSocket = new WebSocket(url);

      webSocket.onmessage = (event) => {
        setStatus(getSubscriptionStatus(webSocket.readyState));
        onMessage && onMessage(event);
      };

      webSocket.onerror = (event) => {
        setStatus(getSubscriptionStatus(webSocket.readyState));
        if (event.message !== null) {
          Bugsnag.notify(`WebSocket error "${event.message}"`);
        }
      };

      webSocket.onclose = (event) => {
        setStatus(getSubscriptionStatus(webSocket.readyState));
        let isError: boolean;

        // Reconnect immediately if close event is expected, otherwise use
        // exponetial backoff to retry.
        if (
          event.code === 1000 ||
          event.code === 1001 ||
          event.code === undefined
        ) {
          Bugsnag.leaveBreadcrumb(`WebSocket closed with code ${event.code}`);
          isError = false;
          connect();
        } else {
          isError = true;
          Bugsnag.notify(
            `WebSocket closed with unexpected event ${event.code} "${event.message}" (${event.reason})`,
          );
          retryTimeout = retryWithCappedBackoff(retryCount, connect);
        }

        onClose && onClose({...event, isError});
      };

      webSocket.onopen = () => {
        setStatus(getSubscriptionStatus(webSocket.readyState));
        Bugsnag.leaveBreadcrumb(`WebSocket opened with url: ${url}`);
        retryCount.current = 0;
        onOpen && onOpen();
      };

      setWebSocket(webSocket);
    };
    connect();

    // Cleanup
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      setWebSocket((ws) => {
        if (ws) {
          ws.onclose = null;
          onClose && onClose({code: 1000, reason: 'Cleanup', isError: false});
          ws.close();
        }
        return null;
      });
    };
  }, [url]);

  return {
    status,
    send: (message: string) => webSocket?.send(message),
    close: webSocket?.close,
  };
}

function getSubscriptionStatus(readyState?: number): SubscriptionStatus {
  if (readyState === 0) return 'CONNECTING';
  if (readyState === 1) return 'OPEN';
  if (readyState === 2) return 'CLOSING';
  if (readyState === 3) return 'CLOSED';
  return 'NOT_STARTED';
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
