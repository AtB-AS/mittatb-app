import {FullScreenHeader} from '@atb/components/screen-header';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useAddPaymentMethod} from '@atb/stacks-hierarchy/Root_AddPaymentMethodScreen/use-add-payment-method';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import AddPaymentMethodTexts from '@atb/translations/screens/subscreens/AddPaymentMethodTexts';
import WebView from 'react-native-webview';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {Processing} from '@atb/components/loading';
import {WebViewNavigationEvent} from 'react-native-webview/lib/RNCWebViewNativeComponent';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

type Props = RootStackScreenProps<'Root_AddPaymentMethodScreen'>;

export const Root_AddPaymentMethodScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [showWebView, setShowWebView] = useState<boolean>(true);
  const [callbackUrl, setCallbackUrl] = useState<string>('');
  const webViewRef = useRef<WebView>(null);
  const appState = useAppStateStatus();

  const {
    terminalUrl,
    onWebViewLoadStart,
    onWebViewLoadEnd,
    onWebViewError,
    isLoading,
    error,
  } = useAddPaymentMethod();

  useEffect(
    () => navigation.addListener('blur', () => setShowWebView(false)),
    [navigation],
  );

  useEffect(() => {
    /**
     * Listens to app state change, if app comes back from backgrounded/inactive
     * state, it will then trigger the webview to load the {@link callbackUrl}, 
     * which will redirect the user to the main payment card screen, and triggers
     * a reload, so the user can see their added card(s). 
     */
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        webViewRef.current?.injectJavaScript(callbackUrl);
      }
    });

    if (appState === 'active') {
      webViewRef.current?.injectJavaScript(callbackUrl);
    }

    return () => {
      subscription.remove();
    };
  }, [callbackUrl, appState]);

  /**
   * This function will intercept the webview navigation, when it receives the 
   * redirection URL, it will intercept the URL, prepends it with `window.location =`
   * and saves it into the {@link callbackUrl},
   * 
   * The resulting {@link callbackUrl} will then trigger the redirection, when
   * the {@link appState} is 'active'.
   * 
   * This is done to prevent the app from loading the URL prematurely after any
   * possible authentication flow when user adds a payment card. 
   */
  const handleNavigationStateChange = (newNavState: WebViewNavigationEvent) => {
    const {url} = newNavState;
    if (
      url.includes('callback') &&
      url.includes('redirectUrl') &&
      url.includes('transactionId') &&
      callbackUrl == ''
    ) {
      // 
      const redirectTo = 'window.location = "' + url + '"';
      setCallbackUrl(redirectTo);
      return false;
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(AddPaymentMethodTexts.header)}
        leftButton={{
          type: 'cancel',
        }}
      />
      {isLoading && !error && (
        <View style={styles.center}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}
      {!!error && (
        <View style={styles.center}>
          <MessageInfoBox
            message={t(AddPaymentMethodTexts.genericError)}
            type="error"
            style={styles.messageBox}
          />
          <Button
            interactiveColor="interactive_1"
            onPress={() => navigation.goBack()}
            text={t(AddPaymentMethodTexts.buttons.goBack)}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          position: !isLoading && !error ? 'relative' : 'absolute',
        }}
      >
        {terminalUrl && showWebView && (
          <WebView
            ref={webViewRef}
            source={{
              uri: terminalUrl,
            }}
            onError={onWebViewError}
            onLoadStart={onWebViewLoadStart}
            onLoadEnd={onWebViewLoadEnd}
            onShouldStartLoadWithRequest={handleNavigationStateChange}
            onNavigationStateChange={handleNavigationStateChange}
          />
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
}));
