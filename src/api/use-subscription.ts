import Bugsnag from '@bugsnag/react-native';
import {useEffect, useState} from 'react';

const MAX_NUMBER_OF_RECONNECTS = 10;
const MAX_NUMBER_OF_RETRIES = 5;

export type SubscriptionState =
  | 'CONNECTING'
  | 'OPEN'
  | 'CLOSING'
  | 'CLOSED'
  | 'NOT_STARTED';

export type SubscriptionEventProps = {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onError?: (event: WebSocketErrorEvent) => void;
  onOpen?: () => void;
  onClose?: (event: WebSocketCloseEvent) => void;
};

export function useSubscription({
  url,
  onMessage,
  onError,
  onClose,
  onOpen,
}: {url: string | null} & SubscriptionEventProps) {
  const [state, setState] = useState<SubscriptionState>('NOT_STARTED');
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  const [reconnectCount, setReconnectCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  let retryTimeout: NodeJS.Timeout | null = null;
  const exponentialBackoff = () => {
    const delay = Math.pow(2, retryCount) * 1000;
    return setTimeout(() => setRetryCount(retryCount + 1), delay);
  };

  useEffect(() => {
    if (url) {
      const webSocket = new WebSocket(url);

      webSocket.onmessage = (event) => {
        setState(getSubscriptionStateCode(webSocket.readyState));
        onMessage && onMessage(event);
      };

      webSocket.onerror = (event) => {
        setState(getSubscriptionStateCode(webSocket.readyState));
        Bugsnag.notify(`WebSocket error "${event.message}" with url: ${url}`);
        onError && onError(event);
      };

      webSocket.onclose = (event) => {
        setState(getSubscriptionStateCode(webSocket.readyState));
        Bugsnag.leaveBreadcrumb(`WebSocket closed with url: ${url}`);

        // Reconnect immediately if close event is end of stream, otherwise use
        // exponetial backoff to retry.
        if (event.code === 1001 && reconnectCount < MAX_NUMBER_OF_RECONNECTS) {
          setReconnectCount(reconnectCount + 1);
        } else if (retryCount < MAX_NUMBER_OF_RETRIES) {
          retryTimeout = exponentialBackoff();
        }

        onClose && onClose(event);
      };

      webSocket.onopen = () => {
        setState(getSubscriptionStateCode(webSocket.readyState));
        Bugsnag.leaveBreadcrumb(`WebSocket opened with url: ${url}`);
        setRetryCount(0);
        onOpen && onOpen();
      };

      setWebSocket(webSocket);
    }

    // Cleanup
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (webSocket) {
        webSocket.onclose = null;
        onClose && onClose({code: 1000, reason: 'Cleanup'});
        webSocket.close();
      }
    };
  }, [url, reconnectCount, retryCount]);

  return {
    state,
    send: (message: string) => webSocket?.send(message),
    close: webSocket?.close,
  };
}

function getSubscriptionStateCode(readyState?: number): SubscriptionState {
  if (readyState === 0) return 'CONNECTING';
  if (readyState === 1) return 'OPEN';
  if (readyState === 2) return 'CLOSING';
  if (readyState === 3) return 'CLOSED';
  return 'NOT_STARTED';
}
