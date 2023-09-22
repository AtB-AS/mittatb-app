import {ErrorType} from '@atb/api/utils';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {
  PaymentCreditCardTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import WebView from 'react-native-webview';
import {
  WebViewErrorEvent,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {Processing} from './Processing';
import {useTerminalState, ErrorContext} from './use-terminal-state';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useAnalytics} from '@atb/analytics';

type Props = RootStackScreenProps<'Root_PurchasePaymentWithCreditCardScreen'>;

export const Root_PurchasePaymentWithCreditCardScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {offers} = route.params;
  const [showWebView, setShowWebView] = useState<boolean>(true);
  const analytics = useAnalytics();

  React.useEffect(
    () => navigation.addListener('blur', () => setShowWebView(false)),
    [navigation],
  );

  const navigateBackFromTerminal = () => {
    analytics.logEvent('Ticketing', 'Payment cancelled', {
      paymentMethod: route.params.paymentMethod,
    });
    navigation.pop();
  };

  const {paymentMethod} = route.params;
  const {paymentType} = paymentMethod;

  const recurringPaymentId =
    'recurringPaymentId' in paymentMethod
      ? paymentMethod.recurringPaymentId
      : undefined;

  const saveRecurringCard =
    'save' in paymentMethod ? paymentMethod.save : false;

  function onWebViewLoadStart(
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) {
    Bugsnag.leaveBreadcrumb('terminal_navigation', {
      url: event?.nativeEvent?.url,
    });
  }

  const {
    isLoading,
    terminalUrl,
    onWebViewLoadEnd,
    onWebViewNavigationChange,
    error,
    restartTerminal,
    cancelPayment,
    onWebViewError,
  } = useTerminalState(
    offers,
    paymentType,
    recurringPaymentId,
    saveRecurringCard,
    navigateBackFromTerminal,
  );

  // Using the header height to adjust the keyboard offset on android
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  return (
    <View style={styles.container}>
      <View onLayout={onLayout}>
        <FullScreenHeader
          title={t(PaymentCreditCardTexts.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: async () => {
              await cancelPayment();
              analytics.logEvent('Ticketing', 'Payment cancelled');
              navigateBackFromTerminal();
            },
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          position: !isLoading && !error ? 'relative' : 'absolute',
        }}
      >
        {terminalUrl && showWebView && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'padding' : undefined}
            style={{flex: 1}}
            keyboardVerticalOffset={
              Platform.OS === 'android' ? headerHeight : 0
            }
          >
            <WebView
              source={{
                uri: terminalUrl,
              }}
              onError={onWebViewError}
              onLoadStart={onWebViewLoadStart}
              onLoadEnd={onWebViewLoadEnd}
              onNavigationStateChange={onWebViewNavigationChange}
            />
          </KeyboardAvoidingView>
        )}
      </View>
      {isLoading && (
        <View style={styles.center}>
          <Processing message={t(PaymentCreditCardTexts.loading)} />
        </View>
      )}
      {!!error && (
        <View style={styles.center}>
          <MessageBox
            message={translateError(error.context, error.type, t)}
            type="error"
            style={styles.messageBox}
          />
          {(error.context === 'terminal-loading' ||
            error.context === 'capture') && (
            <Button
              onPress={restartTerminal}
              text={t(PaymentCreditCardTexts.buttons.restart)}
              style={styles.button}
            />
          )}
          <Button
            interactiveColor="interactive_1"
            onPress={() => navigateBackFromTerminal()}
            text={t(PaymentCreditCardTexts.buttons.goBack)}
          />
        </View>
      )}
    </View>
  );
};

const translateError = (
  errorContext: ErrorContext,
  errorType: ErrorType,
  t: TranslateFunction,
) => {
  switch (errorContext) {
    case 'terminal-loading':
      return t(PaymentCreditCardTexts.errorMessages.loading);
    case 'reservation':
      return t(PaymentCreditCardTexts.errorMessages.reservation);
    case 'capture':
      return t(PaymentCreditCardTexts.errorMessages.capture);
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));
