import {ErrorType} from '@atb/api/utils';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {
  PaymentVippsTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Processing} from '@atb/components/loading';
import {useVippsState, ErrorContext, State} from './use-vipps-state';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';

type Props = RootStackScreenProps<'Root_PurchasePaymentWithVippsScreen'>;

export const Root_PurchasePaymentWithVippsScreen = ({
  navigation,
  route: {
    params: {offers, destinationAccountId},
  },
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const cancelVipps = () => navigation.pop();

  const dismiss = () => {
    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_TicketingStack',
      params: {
        screen: 'Ticketing_RootScreen',
        params: {
          screen: 'TicketTabNav_ActiveFareProductsTabScreen',
        },
      },
    });
  };

  const {state, error, openVipps} = useVippsState(
    offers,
    destinationAccountId,
    dismiss,
  );

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
            <MessageInfoBox
              message={translateError(error.context, error.type, t)}
              type="error"
              style={styles.messageBox}
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
};

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
    backgroundColor: theme.static.background.background_1.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    margin: theme.spacings.medium,
  },
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));
