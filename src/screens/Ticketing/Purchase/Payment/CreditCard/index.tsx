import {ErrorType} from '@atb/api/utils';
import Button from '@atb/components/button';
import MessageBox from '@atb/components/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {StyleSheet} from '@atb/theme';
import {ReserveOffer, TicketReservation, useTicketState} from '@atb/tickets';
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
import {
  ActiveTicketsScreenName,
  TicketTabsNavigatorParams,
} from '../../../Tickets';
import Processing from '../Processing';
import useTerminalState, {
  ErrorContext,
  LoadingState,
} from './use-terminal-state';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {usePreferences} from '@atb/preferences';
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

  const cancelTerminal = () => navigation.pop();

  const {paymentMethod} = route.params;
  const {paymentType} = paymentMethod;

  const recurringPaymentId =
    'recurringPaymentId' in paymentMethod
      ? paymentMethod.recurringPaymentId
      : undefined;

  const saveRecurringCard =
    'save' in paymentMethod ? paymentMethod.save : false;

  const {
    preferences: {scaExemption},
  } = usePreferences();

  function onWebViewLoadStart(
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) {
    Bugsnag.leaveBreadcrumb('terminal_navigation', {
      url: event?.nativeEvent?.url,
    });
  }

  const {
    loadingState,
    terminalUrl,
    onWebViewLoadEnd,
    error,
    restartTerminal,
  } = useTerminalState(
    offers,
    paymentType,
    recurringPaymentId,
    saveRecurringCard,
    cancelTerminal,
    scaExemption ?? false,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(PaymentCreditCardTexts.header.title)}
        leftButton={{
          type: 'cancel',
          onPress: () => cancelTerminal(),
        }}
      />
      <View
        style={{
          flex: 1,
          position: !loadingState && !error ? 'relative' : 'absolute',
        }}
      >
        {terminalUrl && showWebView && (
          <WebView
            source={{
              uri: terminalUrl,
            }}
            onLoadStart={onWebViewLoadStart}
            onLoadEnd={onWebViewLoadEnd}
          />
        )}
      </View>
      {loadingState && (
        <View style={styles.center}>
          <Processing message={translateLoadingMessage(loadingState, t)} />
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
            color="secondary_1"
            onPress={() => cancelTerminal()}
            text={t(PaymentCreditCardTexts.buttons.goBack)}
          />
        </View>
      )}
    </View>
  );
};

const translateLoadingMessage = (
  loadingState: LoadingState,
  t: TranslateFunction,
) => {
  switch (loadingState) {
    case 'reserving-offer':
      return t(PaymentCreditCardTexts.stateMessages.reserving);
    case 'loading-terminal':
      return t(PaymentCreditCardTexts.stateMessages.loading);
    case 'processing-payment':
      return t(PaymentCreditCardTexts.stateMessages.processing);
  }
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
    backgroundColor: theme.colors.background_2.backgroundColor,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));

export default CreditCard;
