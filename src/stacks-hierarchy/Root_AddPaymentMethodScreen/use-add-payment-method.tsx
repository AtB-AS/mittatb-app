import {AddPaymentMethodResponse, addPaymentMethod} from '@atb/ticketing';
import Bugsnag from '@bugsnag/react-native';
import {APP_SCHEME} from '@env';
import {useEffect, useState} from 'react';
import {
  WebViewErrorEvent,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';

export const useAddPaymentMethod = () => {
  const [addPaymentMethodResponse, setAddPaymentMethodResponse] =
    useState<AddPaymentMethodResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const redirectUrl = `${APP_SCHEME}://profile`;
    addPaymentMethod(redirectUrl)
      .then(setAddPaymentMethodResponse)
      .catch(setError);
  }, []);

  const onWebViewLoadStart = (
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) => {
    Bugsnag.leaveBreadcrumb('terminal_navigation', {
      url: event?.nativeEvent?.url,
    });
  };

  const onWebViewLoadEnd = () => {
    setIsLoading(false);
  };

  const onWebViewError = (e: any) => {
    setError(new Error(e));
  };

  return {
    terminalUrl: addPaymentMethodResponse?.terminal_url,
    onWebViewLoadStart,
    onWebViewLoadEnd,
    onWebViewError,
    isLoading,
    error,
  };
};
