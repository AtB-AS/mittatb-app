import Intercom from 'react-native-intercom';
import {useEffect, useState, useCallback} from 'react';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export function useChatUnreadCount() {
  const [count, setCount] = useState(0);
  const {enable_intercom} = useRemoteConfig();

  const callback = useCallback(({count}: {count: number}) => {
    setCount(count);
  }, []);

  useEffect(() => {
    if (!enable_intercom) {
      setCount(0);
      return;
    }

    let mounted = true;
    async function getInitialUnreadCount() {
      const initialCount = await Intercom.getUnreadConversationCount();
      if (mounted) setCount(initialCount);
    }

    getInitialUnreadCount();

    Intercom.addEventListener(Intercom.Notifications.UNREAD_COUNT, callback);

    return () => {
      mounted = false;
      Intercom.removeEventListener(
        Intercom.Notifications.UNREAD_COUNT,
        callback,
      );
    };
  }, [enable_intercom]);

  return count;
}
