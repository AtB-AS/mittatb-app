import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
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

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'PaymentCreditCard'
  >;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const styles = useStyles();
  const {offers} = route.params;
  const [showWebView, setShowWebView] = useState<boolean>(true);

  React.useEffect(
    () => navigation.addListener('blur', () => setShowWebView(false)),
    [navigation],
  );

  const cancelTerminal = (refresh?: boolean) =>
    navigation.navigate('Travellers', {refreshOffer: refresh});

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
    navigation.dismiss();
  };

  const {
    loadingState,
    terminalUrl,
    onWebViewLoadEnd,
    onWebViewLoadStart,
    error,
    restartTerminal,
  } = useTerminalState(offers, cancelTerminal, dismissAndActivatePolling);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Betaling"
        leftButton={{
          icon: <ThemeIcon svg={ArrowLeft} />,
          onPress: () => cancelTerminal(false),
          accessibilityLabel:
            'Avslutt betaling og gå tilbake til valg av reisende',
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
          <Processing message={translateLoadingMessage(loadingState)} />
        </View>
      )}
      {!!error && (
        <View style={styles.center}>
          <MessageBox
            message={translateError(error.context, error.type)}
            type="error"
            containerStyle={styles.messageBox}
          />
          {(error.context === 'terminal-loading' ||
            error.context === 'capture') && (
            <Button
              mode="primary"
              onPress={restartTerminal}
              text="Start på nytt"
              style={styles.button}
            />
          )}
          <Button
            mode="secondary"
            onPress={() => cancelTerminal(true)}
            text="Gå tilbake"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const translateLoadingMessage = (loadingState: LoadingState) => {
  switch (loadingState) {
    case 'reserving-offer':
      return 'Reserverer billett..';
    case 'loading-terminal':
      return 'Laster betalingsterminal..';
    case 'processing-payment':
      return 'Prosesserer betaling..';
  }
};

const translateError = (errorContext: ErrorContext, errorType: ErrorType) => {
  switch (errorContext) {
    case 'terminal-loading':
      return 'Oops - vi feila når vi prøvde å laste inn betalingsterminal. Supert om du prøver igjen 🤞';
    case 'reservation':
      return 'Oops - vi feila når vi prøvde å reservere billett. Supert om du prøver igjen 🤞';
    case 'capture':
      return 'Oops - vi feila når vi prosessere betaling. Supert om du prøver igjen 🤞';
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.background.level2},
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));

export default CreditCard;
