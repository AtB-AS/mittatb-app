import {ErrorType} from '@atb/api/utils';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import MessageBox from '@atb/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {StyleSheet} from '@atb/theme';
import {ReserveOffer, TicketReservation, useTicketState} from '@atb/tickets';
import {
  PaymentVippsTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../..';
import {
  ActiveTicketsScreenName,
  TicketTabsNavigatorParams,
} from '../../../Tickets';
import Processing from '../Processing';
import useVippsState, {ErrorContext, State} from './use-vipps-state';

type NavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TicketTabsNavigatorParams>,
  DismissableStackNavigationProp<TicketingStackParams, 'PaymentVipps'>
>;

type Props = {
  navigation: NavigationProp;
  route: RouteProp<TicketingStackParams, 'PaymentVipps'>;
};

export default function VippsPayment({
  navigation,
  route: {
    params: {offers},
  },
}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();

  const cancelVipps = () => navigation.pop();

  const {addReservation} = useTicketState();
  const dismissAndActivatePolling = (
    reservation: TicketReservation,
    reservationOffers: ReserveOffer[],
  ) => {
    addReservation({
      reservation,
      offers: reservationOffers,
      paymentType: 'vipps',
    });
    navigation.navigate(ActiveTicketsScreenName);
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
          type: 'cancel',
          onPress: () => cancelVipps(),
        }}
      />
      <View style={styles.content}>
        {!error &&
          (state === 'reserving-offer' || state === 'offer-reserved' ? (
            <Processing message={translateStateMessage(state, t)} />
          ) : (
            <Button
              text={t(PaymentVippsTexts.buttons.goToVipps)}
              onPress={() => openVipps()}
              style={styles.button}
            />
          ))}
        {!!error && (
          <>
            <MessageBox
              message={translateError(error.context, error.type, t)}
              type="error"
              containerStyle={styles.messageBox}
            />
            {error.context === 'open-vipps-url' && (
              <Button
                onPress={openVipps}
                text={t(PaymentVippsTexts.buttons.tryAgain)}
                style={styles.button}
              />
            )}
            <Button
              color="secondary_1"
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

const translateError = (
  errorContext: ErrorContext,
  errorType: ErrorType,
  t: TranslateFunction,
) => {
  switch (errorContext) {
    case 'open-vipps-url':
      return t(PaymentVippsTexts.errorMessages.openVipps);
    case 'reserve-offer':
      return t(PaymentVippsTexts.errorMessages.reserveOffer);
  }
};

const translateStateMessage = (loadingState: State, t: TranslateFunction) => {
  switch (loadingState) {
    case 'reserving-offer':
      return t(PaymentVippsTexts.stateMessages.reserving);
    case 'offer-reserved':
    default:
      return t(PaymentVippsTexts.stateMessages.reserved);
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
