import Bugsnag from '@bugsnag/react-native';
import {useEffect, useState} from 'react';

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
        onClose && onClose(event);
      };
      webSocket.onopen = () => {
        setState(getSubscriptionStateCode(webSocket.readyState));
        Bugsnag.leaveBreadcrumb(`WebSocket opened with url: ${url}`);
        onOpen && onOpen();
      };
      setWebSocket(webSocket);
    }

    // Cleanup
    return () => {
      if (webSocket) {
        webSocket.onclose = null;
        onClose && onClose({code: 1000, reason: 'Cleanup'});
        webSocket.close();
      }
    };
  }, [url]);

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
