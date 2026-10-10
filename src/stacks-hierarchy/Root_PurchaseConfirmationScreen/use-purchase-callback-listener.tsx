import {useEffect} from 'react';
import {Linking} from 'react-native';

export const usePurchaseCallbackListener = (
  onCallback: (url: string) => void,
) => {
  useEffect(() => {
    const {remove: unsub} = Linking.addEventListener('url', async (event) => {
      if (event.url.includes('purchase-callback')) {
        onCallback(event.url);
      }
    });
    return () => unsub();
  }, [onCallback]);
};
