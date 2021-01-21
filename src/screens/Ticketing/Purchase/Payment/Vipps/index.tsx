import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../..';
import ThemeIcon from '../../../../../components/theme-icon';
import {DismissableStackNavigationProp} from '../../../../../navigation/createDismissableStackNavigator';
import Header from '../../../../../ScreenHeader';
import {StyleSheet} from '../../../../../theme';
import {useTicketState} from '../../../../../TicketContext';
import {ArrowLeft} from '../../../../../assets/svg/icons/navigation';
import Button from '../../../../../components/button';
import useVippsState, {ErrorContext, State} from './use-vipps-state';
import Processing from '../Processing';
import MessageBox from '../../../../../message-box';
import {ErrorType} from '../../../../../api/utils';
import {
  ReserveOffer,
  TicketReservation,
} from '../../../../../api/fareContracts';
import {PaymentVippsTexts, useTranslation} from '../../../../../translations';
import {ActiveTicketsScreenName} from '../../../Tickets';

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
    params: {offers, preassignedFareProduct},
  },
}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();

  const cancelVipps = () => navigation.pop();

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
    navigation.dismiss({screen: ActiveTicketsScreenName});
  };

  const {state, error, openVipps} = useVippsState(
    offers,
    dismissAndActivatePolling,
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t(PaymentVippsTexts.header.title)}
        leftButton={{
          icon: <ThemeIcon svg={ArrowLeft} />,
          onPress: () => cancelVipps(),
          accessibilityLabel: t(PaymentVippsTexts.header.leftButton.a11yLabel),
        }}
      />
      <View style={styles.content}>
        {!error &&
          (state === 'reserving-offer' || state === 'offer-reserved' ? (
            <Processing message={t(translateStateMessage(state))} />
          ) : (
            <Button
              mode="primary"
              text={t(PaymentVippsTexts.buttons.goToVipps)}
              onPress={() => openVipps()}
              style={styles.button}
            />
          ))}
        {!!error && (
          <>
            <MessageBox
              message={t(translateError(error.context, error.type))}
              type="error"
              containerStyle={styles.messageBox}
            />
            {error.context === 'open-vipps-url' && (
              <Button
                mode="primary"
                onPress={openVipps}
                text={t(PaymentVippsTexts.buttons.tryAgain)}
                style={styles.button}
              />
            )}
            <Button
              mode="secondary"
              onPress={() => cancelVipps()}
              text={t(PaymentVippsTexts.buttons.goBack)}
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
      return PaymentVippsTexts.errorMessages.openVipps;
    case 'reserve-offer':
      return PaymentVippsTexts.errorMessages.reserveOffer;
  }
};

const translateStateMessage = (loadingState: State) => {
  switch (loadingState) {
    case 'reserving-offer':
      return PaymentVippsTexts.stateMessages.reserving;
    case 'offer-reserved':
    default:
      return PaymentVippsTexts.stateMessages.reserved;
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
