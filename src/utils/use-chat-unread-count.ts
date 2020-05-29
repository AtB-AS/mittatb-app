import Intercom from 'react-native-intercom';
import {useEffect, useState, useCallback} from 'react';

export default function useChatUnreadCount() {
  const [count, setCount] = useState(0);

  const callback = useCallback(({count}: {count: number}) => {
    setCount(count);
  }, []);

  useEffect(() => {
    Intercom.addEventListener(Intercom.Notifications.UNREAD_COUNT, callback);
    return () =>
      Intercom.removeEventListener(
        Intercom.Notifications.UNREAD_COUNT,
        callback,
      );
  });

  return count;
}
