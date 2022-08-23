import {View} from 'react-native';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import ThemeText from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import Ticket from '@atb/screens/Ticketing/Tickets/AvailableTickets/Ticket';

export const AvailableTickets = ({
  onBuySingleTicket,
  onBuyPeriodTicket,
  onBuyHour24Ticket,
}: {
  onBuySingleTicket: () => void;
  onBuyPeriodTicket: () => void;
  onBuyHour24Ticket: () => void;
}) => {
  const styles = useStyles();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {preassignedFareproducts} = useFirestoreConfiguration();
  const {t} = useTranslation();

  const shouldShowSingleTicket = preassignedFareproducts
    .filter(productIsSellableInApp)
    .some((product) => {
      return product.type === 'single';
    });

  const shouldShowPeriodTicket =
    hasEnabledMobileToken &&
    preassignedFareproducts.filter(productIsSellableInApp).some((product) => {
      return product.type === 'period';
    });

  const shouldShowHour24Ticket = preassignedFareproducts
    .filter(productIsSellableInApp)
    .some((product) => product.type === 'hour24');

  const shouldShowSummerPass = false;

  return (
    <View>
      <ThemeText type="body__secondary" style={styles.heading}>
        {t(TicketsTexts.availableTickets.allTickets)}
      </ThemeText>

      <View style={styles.ticketsContainer}>
        {shouldShowSingleTicket && (
          <Ticket
            transportationModeTexts={t(
              TicketsTexts.availableTickets.single.transportModes,
            )}
            ticketIllustration="Single"
            onPress={onBuySingleTicket}
            testID="singleTicket"
            ticketType={'single'}
          />
        )}
        {shouldShowPeriodTicket && (
          <Ticket
            transportationModeTexts={t(
              TicketsTexts.availableTickets.period.transportModes,
            )}
            ticketIllustration="Period"
            onPress={onBuyPeriodTicket}
            testID="periodicTicket"
            ticketType={'period'}
          />
        )}
      </View>
      {shouldShowHour24Ticket && (
        <View style={styles.ticketsContainer}>
          <Ticket
            transportationModeTexts={t(
              TicketsTexts.availableTickets.hour24.transportModes,
            )}
            ticketIllustration="H24"
            onPress={onBuyHour24Ticket}
            testID="24HourTicket"
            ticketType={'hour24'}
          />
        </View>
      )}
      {shouldShowSummerPass && (
        <View style={styles.ticketsContainer}>
          <Ticket
            transportationModeTexts={t(
              TicketsTexts.availableTickets.summerPass.transportModes,
            )}
            ticketIllustration="Summer"
            accented={true}
            onPress={onBuyPeriodTicket}
            testID="summerTicket"
            ticketType={'summerPass'}
          />
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  heading: {
    margin: theme.spacings.medium,
    marginLeft: theme.spacings.xLarge,
    marginTop: theme.spacings.xLarge,
  },
  ticketsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    alignItems: 'stretch',
  },
}));
