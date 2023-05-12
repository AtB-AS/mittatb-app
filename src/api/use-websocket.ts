// import Bugsnag from '@bugsnag/react-native';
import {useEffect, useState} from 'react';

export type WebSocketConnectionState =
  | 'CONNECTING'
  | 'OPEN'
  | 'CLOSING'
  | 'CLOSED'
  | 'NOT_STARTED';

export type WebSocketEventProps = {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onError?: (event: WebSocketErrorEvent) => void;
  onOpen?: () => void;
  onClose?: (event: WebSocketCloseEvent) => void;
};

export function useWebSocket({
  url,
  onMessage,
  onError,
  onClose,
  onOpen,
}: {url: string | null} & WebSocketEventProps) {
  const [state, setState] = useState<WebSocketConnectionState>('NOT_STARTED');
  const [subscription, setSubscription] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (url) {
      const ws = new WebSocket(url);

      ws.onmessage = (event) => {
        setState(getWebSocketStateCode(ws.readyState));
        onMessage && onMessage(event);
      };

      ws.onerror = (event) => {
        setState(getWebSocketStateCode(ws.readyState));
        onError && onError(event);
      };

      ws.onclose = (event) => {
        setState(getWebSocketStateCode(ws.readyState));
        onClose && onClose(event);
      };

      ws.onopen = () => {
        setState(getWebSocketStateCode(ws.readyState));
        onOpen && onOpen();
      };

      setSubscription(ws);
    }

    // Cleanup function
    return () => {
      if (subscription) {
        subscription.onclose = null;
        onClose && onClose({code: 1000, reason: 'Cleanup'});
        subscription.close();
      }
    };
  }, [url]);

  return {
    state,
    send: (message: string) => subscription?.send(message),
    close: () => subscription && subscription.close(),
  };
}

function getWebSocketStateCode(readyState?: number): WebSocketConnectionState {
  if (readyState === 0) return 'CONNECTING';
  if (readyState === 1) return 'OPEN';
  if (readyState === 2) return 'CLOSING';
  if (readyState === 3) return 'CLOSED';
  return 'NOT_STARTED';
}
