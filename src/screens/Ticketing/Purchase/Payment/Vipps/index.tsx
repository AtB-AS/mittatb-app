import {ErrorType} from '@atb/api/utils';
import Button from '@atb/components/button';
import MessageBox from '@atb/components/message-box';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {ActiveTicketsScreenName} from '@atb/screens/Ticketing/Tickets/types';
import {StyleSheet} from '@atb/theme';
import {
  PaymentVippsTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {TicketPurchaseScreenProps} from '../../types';
import Processing from '../Processing';
import useVippsState, {ErrorContext, State} from './use-vipps-state';

type Props = TicketPurchaseScreenProps<'PaymentVipps'>;

export default function VippsPayment({
  navigation,
  route: {
    params: {offers},
  },
}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();

  const cancelVipps = () => navigation.pop();

  const dismiss = () => {
    // @TODO Fix this
    navigation.navigate(ActiveTicketsScreenName);
  };

  const {state, error, openVipps} = useVippsState(offers, dismiss);

  return (
    <View style={styles.container}>
      <FullScreenHeader
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
              interactiveColor="interactive_0"
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
                interactiveColor="interactive_0"
                onPress={openVipps}
                text={t(PaymentVippsTexts.buttons.tryAgain)}
                style={styles.button}
              />
            )}
            <Button
              interactiveColor="interactive_1"
              onPress={() => cancelVipps()}
              text={t(PaymentVippsTexts.buttons.goBack)}
              style={styles.button}
            />
          </>
        )}
      </View>
    </View>
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
    backgroundColor: theme.static.background.background_2.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));
