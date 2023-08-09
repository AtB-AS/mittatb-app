import {useEffect, useState} from 'react';
import {
  AddPaymentMethodResponse,
  addPaymentMethod,
  getResponseCode,
} from '@atb/ticketing';
import {APP_SCHEME} from '@env';
import {
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import Bugsnag from '@bugsnag/react-native';

export const useAddPaymentMethod = (
  onSuccess: () => void,
  onCancel: () => void,
) => {
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
    if (event.url.includes('/ticket/v3/recurring-payments')) {
      const responseCode = getResponseCode(event);
      if (responseCode === 'Cancel') {
        onCancel();
      } else if (responseCode === 'OK') {
        //TODO: Call authorize endpoint
        onSuccess();
      }
    }
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
    onWebViewNavigationChange,
    onWebViewLoadEnd,
    onWebViewError,
    isLoading,
    error,
  };
};
