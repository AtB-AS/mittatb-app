import Intercom, {IntercomEvents} from '@intercom/intercom-react-native';
import {useEffect, useState} from 'react';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {NativeEventEmitter, NativeModules} from 'react-native';

export function useChatUnreadCount() {
  const [count, setCount] = useState(0);
  const {enable_intercom} = useRemoteConfigContext();

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

    const cleanupIntercomEventListeners = Intercom.bootstrapEventListeners();

    const eventEmitter = new NativeEventEmitter(
      NativeModules.IntercomEventEmitter,
    );

    const countListener = eventEmitter.addListener(
      IntercomEvents.IntercomUnreadCountDidChange,
      (response: any) => {
        setCount(response.count as number);
      },
    );

    return () => {
      mounted = false;
      countListener.remove();
      cleanupIntercomEventListeners();
    };
  }, [enable_intercom]);

  return count;
}
