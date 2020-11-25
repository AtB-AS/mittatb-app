import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Linking, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../..';
import {Close} from '../../../../../assets/svg/icons/actions';
import ThemeText from '../../../../../components/text';
import ThemeIcon from '../../../../../components/theme-icon';
import {DismissableStackNavigationProp} from '../../../../../navigation/createDismissableStackNavigator';
import Header from '../../../../../ScreenHeader';
import {StyleSheet} from '../../../../../theme';
import {useTicketState} from '../../../../../TicketContext';
import {ArrowLeft} from '../../../../../assets/svg/icons/navigation';
import {reserveOffers} from '../../../../../api';
import Button from '../../../../../components/button';
import useVippsState, {ErrorContext, State} from './use-vipps-state';
import Processing from '../Processing';
import MessageBox from '../../../../../message-box';
import {ErrorType} from '../../../../../api/utils';
import {
  ReserveOffer,
  TicketReservation,
} from '../../../../../api/fareContracts';

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'PaymentVipps'
  >;
  route: RouteProp<TicketingStackParams, 'PaymentVipps'>;
};

export default function VippsPayment({
  navigation,
  route: {
    params: {offers},
  },
}: Props) {
  const styles = useStyles();

  const cancelVipps = (refresh?: boolean) =>
    navigation.navigate('Travellers', {refreshOffer: refresh});

  const {activatePollingForNewTickets} = useTicketState();
  const dismissAndActivatePolling = (
    reservation: TicketReservation,
    reservationOffers: ReserveOffer[],
  ) => {
    activatePollingForNewTickets({
      reservation,
      offers: reservationOffers,
      paymentType: 'vipps',
    });
    navigation.dismiss();
  };

  const {state, error, openVipps} = useVippsState(
    offers,
    dismissAndActivatePolling,
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Videresendes til vipps"
        leftButton={{
          icon: <ThemeIcon svg={ArrowLeft} />,
          onPress: cancelVipps,
          accessibilityLabel:
            'Avslutt vipps og gå tilbake til valg av reisende',
        }}
      />
      <View style={styles.content}>
        {!error &&
          (state === 'reserving-offer' || state === 'offer-reserved' ? (
            <Processing message={translateStateMessage(state)} />
          ) : (
            <Button
              mode="primary"
              text="Gå til vipps for betaling"
              onPress={() => openVipps()}
              style={styles.button}
            />
          ))}
        {!!error && (
          <>
            <MessageBox
              message={translateError(error.context, error.type)}
              type="error"
              containerStyle={styles.messageBox}
            />
            {error.context === 'open-vipps-url' && (
              <Button
                mode="primary"
                onPress={openVipps}
                text="Prøv igjen"
                style={styles.button}
              />
            )}
            <Button
              mode="secondary"
              onPress={() => cancelVipps(true)}
              text="Gå tilbake"
              style={styles.button}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const translateError = (errorContext: ErrorContext, errorType: ErrorType) => {
  switch (errorContext) {
    case 'open-vipps-url':
      return 'Oops - vi feila når vi prøvde å laste åpne vipps. Har du installert vipps-appen?';
    case 'reserve-offer':
      return 'Oops - vi feila når vi prøvde å reservere billett. Supert om du prøver igjen 🤞';
  }
};

const translateStateMessage = (loadingState: State) => {
  switch (loadingState) {
    case 'reserving-offer':
      return 'Reserverer billett..';
    case 'offer-reserved':
    default:
      return 'Åpner vipps..';
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));
