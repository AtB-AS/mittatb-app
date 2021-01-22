import React, {useState} from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../..';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeft} from '../../../../../assets/svg/icons/navigation';
import Header from '../../../../../ScreenHeader';
import {DismissableStackNavigationProp} from '../../../../../navigation/createDismissableStackNavigator';
import Processing from '../Processing';
import {View} from 'react-native';
import useTerminalState, {
  ErrorContext,
  LoadingState,
} from './use-terminal-state';
import WebView from 'react-native-webview';
import MessageBox from '../../../../../message-box';
import {useTicketState} from '../../../../../TicketContext';
import {StyleSheet} from '../../../../../theme';
import {ErrorType} from '../../../../../api/utils';
import Button from '../../../../../components/button';
import ThemeIcon from '../../../../../components/theme-icon';
import {
  ReserveOffer,
  TicketReservation,
} from '../../../../../api/fareContracts';
import {
  PaymentCreditCardTexts,
  useTranslation,
} from '../../../../../translations';
import {
  ActiveTicketsScreenName,
  TicketTabsNavigatorParams,
} from '../../../Tickets';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';

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
          icon: <ThemeIcon svg={ArrowLeft} />,
          onPress: () => cancelTerminal(),
          accessibilityLabel: t(
            PaymentCreditCardTexts.header.leftButton.a11yLabel,
          ),
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
