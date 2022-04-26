import {View} from 'react-native';
import Button from '@atb/components/button';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {TicketAdd} from '@atb/assets/svg/mono-icons/ticketing';
import React from 'react';
import {useAuthState} from '@atb/auth';
import {StyleSheet, useTheme} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';

export const AvailableTickets = ({
  onBuySingleTicket,
  onBuyPeriodTicket,
}: {
  onBuySingleTicket: () => void;
  onBuyPeriodTicket: () => void;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {abtCustomerId, authenticationType} = useAuthState();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {t} = useTranslation();

  const isSignedInAsAbtCustomer = !!abtCustomerId;

  return (
    <View style={styles.container}>
      {isSignedInAsAbtCustomer && (
        <View style={{padding: theme.spacings.medium}}>
          <Button
            mode="primary"
            interactiveColor="interactive_0"
            text={t(TicketsTexts.buyTicketsTab.button.single.text)}
            accessibilityHint={t(
              TicketsTexts.buyTicketsTab.button.single.a11yHint,
            )}
            onPress={onBuySingleTicket}
            icon={TicketAdd}
            iconPosition={'right'}
            testID="singleTicketBuyButton"
          />
          {hasEnabledMobileToken && (
            <Button
              mode="primary"
              interactiveColor="interactive_0"
              text={t(TicketsTexts.buyTicketsTab.button.period.text)}
              accessibilityHint={t(
                TicketsTexts.buyTicketsTab.button.period.a11yHint,
              )}
              onPress={onBuyPeriodTicket}
              viewContainerStyle={styles.buyPeriodTicketButton}
              icon={TicketAdd}
              iconPosition={'right'}
              testID="periodTicketBuyButton"
            />
          )}
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  buyPeriodTicketButton: {
    marginTop: theme.spacings.medium,
  },
}));
