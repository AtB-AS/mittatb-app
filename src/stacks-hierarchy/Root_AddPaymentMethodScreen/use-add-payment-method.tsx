import {useEffect, useState} from 'react';
import {AddPaymentMethodResponse, addPaymentMethod} from '@atb/ticketing';
import {APP_SCHEME} from '@env';
import {
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import Bugsnag from '@bugsnag/react-native';

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

  const onWebViewNavigationChange = (event: WebViewNavigation) => {
    setIsLoading(event.loading);
    console.log('onWebViewNavigationChange:');
    console.log(JSON.stringify(event));
  };

  const onWebViewLoadEnd = () => {
    setIsLoading(false);
  };

  const onWebViewError = (e: any) => {
    console.error(e);
    setError(new Error());
  };

  return {
    terminalUrl: addPaymentMethodResponse?.terminal_url,
    onWebViewLoadStart,
    onWebViewNavigationChange,
    onWebViewLoadEnd,
    onWebViewError,
    isLoading,
    error,
  };
};
