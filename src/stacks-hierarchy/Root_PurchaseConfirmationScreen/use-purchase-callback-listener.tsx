import {useEffect} from 'react';
import {Linking} from 'react-native';

export const usePurchaseCallbackListener = (onCallback: () => void) => {
  useEffect(() => {
    const {remove: unsub} = Linking.addEventListener('url', async (event) => {
      if (event.url.includes('purchase-callback')) {
        onCallback();
      }
    });
    return () => unsub();
  }, [onCallback]);
};
