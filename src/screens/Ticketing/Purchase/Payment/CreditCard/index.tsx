import {ErrorType} from '@atb/api/utils';
import Button from '@atb/components/button';
import MessageBox from '@atb/components/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {StyleSheet} from '@atb/theme';
import {
  PaymentCreditCardTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {TicketingStackParams} from '../..';
import {TicketTabsNavigatorParams} from '../../../Tickets';
import Processing from '../Processing';
import useTerminalState, {ErrorContext} from './use-terminal-state';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import Bugsnag from '@bugsnag/react-native';
import {
  WebViewErrorEvent,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';

type NavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TicketTabsNavigatorParams>,
  DismissableStackNavigationProp<TicketingStackParams, 'PaymentCreditCard'>
>;

type Props = {
  navigation: NavigationProp;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {offers} = route.params;
  const [showWebView, setShowWebView] = useState<boolean>(true);

  React.useEffect(
    () => navigation.addListener('blur', () => setShowWebView(false)),
    [navigation],
  );

  const navigateBackFromTerminal = () => {
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

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(PaymentCreditCardTexts.header.title)}
        leftButton={{
          type: 'cancel',
          onPress: async () => {
            await cancelPayment();
            navigateBackFromTerminal();
          },
        }}
      />
      <View
        style={{
          flex: 1,
          position: !isLoading && !error ? 'relative' : 'absolute',
        }}
      >
        {terminalUrl && showWebView && (
          <WebView
            source={{
              uri: terminalUrl,
            }}
            onError={onWebViewError}
            onLoadStart={onWebViewLoadStart}
            onLoadEnd={onWebViewLoadEnd}
            onNavigationStateChange={onWebViewNavigationChange}
          />
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
            containerStyle={styles.messageBox}
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
    backgroundColor: theme.static.background.background_2.background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));

export default CreditCard;
