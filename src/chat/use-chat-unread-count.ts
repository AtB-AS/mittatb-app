import Intercom from 'react-native-intercom';
import {useEffect, useState, useCallback} from 'react';

export default function useChatUnreadCount() {
  const [count, setCount] = useState(0);

  const callback = useCallback(({count}: {count: number}) => {
    setCount(count);
  }, []);

  useEffect(() => {
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
  }, [callback]);

  return count;
}
