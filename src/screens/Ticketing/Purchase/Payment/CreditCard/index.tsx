import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../..';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeft} from '../../../../../assets/svg/icons/navigation';
import Header from '../../../../../ScreenHeader';
import {DismissableStackNavigationProp} from '../../../../../navigation/createDismissableStackNavigator';
import Processing from './Processing';
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

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'PaymentCreditCard'
  >;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const styles = useStyles();
  const {offer_id, count} = route.params;
  const cancelTerminal = () => navigation.goBack();
  const {activatePollingForNewTickets} = useTicketState();
  const onPurchaseSuccess = () => {
    activatePollingForNewTickets();
    navigation.dismiss();
  };

  const {
    loadingState,
    terminalUrl,
    onWebViewLoadEnd,
    onWebViewLoadStart,
    error,
    restartTerminal,
  } = useTerminalState(offer_id, count, cancelTerminal, onPurchaseSuccess);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Betaling"
        leftButton={{
          icon: <ArrowLeft />,
          onPress: cancelTerminal,
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
        {terminalUrl && (
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
          />
          <Button
            mode="primary"
            onPress={restartTerminal}
            text="Start på nytt"
            style={styles.button}
          />
          <Button mode="secondary" onPress={cancelTerminal} text="Avbryt" />
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
  container: {flex: 1, backgroundColor: theme.background.modal_Level2},
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  button: {marginTop: theme.spacings.small},
}));

export default CreditCard;
