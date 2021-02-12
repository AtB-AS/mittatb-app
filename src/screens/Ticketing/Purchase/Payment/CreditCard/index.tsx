import {ReserveOffer, TicketReservation} from '@atb/api/fareContracts';
import {ErrorType} from '@atb/api/utils';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import MessageBox from '@atb/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {StyleSheet} from '@atb/theme';
import {useTicketState} from '@atb/TicketContext';
import {PaymentCreditCardTexts, useTranslation} from '@atb/translations';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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

  const {activatePollingForNewTickets} = useTicketState();
  const dismissAndActivatePolling = (
    reservation: TicketReservation,
    reservationOffers: ReserveOffer[],
  ) => {
    activatePollingForNewTickets({
      reservation,
      offers: reservationOffers,
      paymentType: 'creditcard',
    });
    navigation.navigate(ActiveTicketsScreenName);
  };

  const {
    loadingState,
    terminalUrl,
    onWebViewLoadEnd,
    error,
    restartTerminal,
  } = useTerminalState(offers, cancelTerminal, dismissAndActivatePolling);

  return (
    <SafeAreaView style={styles.container}>
      <Header
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
            onLoadEnd={onWebViewLoadEnd}
          />
        )}
      </View>
      {loadingState && (
        <View style={styles.center}>
          <Processing message={t(translateLoadingMessage(loadingState))} />
        </View>
      )}
      {!!error && (
        <View style={styles.center}>
          <MessageBox
            message={t(translateError(error.context, error.type))}
            type="error"
            containerStyle={styles.messageBox}
          />
          {(error.context === 'terminal-loading' ||
            error.context === 'capture') && (
            <Button
              mode="primary"
              onPress={restartTerminal}
              text={t(PaymentCreditCardTexts.buttons.restart)}
              style={styles.button}
            />
          )}
          <Button
            mode="secondary"
            onPress={() => cancelTerminal()}
            text={t(PaymentCreditCardTexts.buttons.goBack)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const translateLoadingMessage = (loadingState: LoadingState) => {
  switch (loadingState) {
    case 'reserving-offer':
      return PaymentCreditCardTexts.stateMessages.reserving;
    case 'loading-terminal':
      return PaymentCreditCardTexts.stateMessages.loading;
    case 'processing-payment':
      return PaymentCreditCardTexts.stateMessages.processing;
  }
};

const translateError = (errorContext: ErrorContext, errorType: ErrorType) => {
  switch (errorContext) {
    case 'terminal-loading':
      return PaymentCreditCardTexts.errorMessages.loading;
    case 'reservation':
      return PaymentCreditCardTexts.errorMessages.reservation;
    case 'capture':
      return PaymentCreditCardTexts.errorMessages.capture;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.background.level2},
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));

export default CreditCard;
