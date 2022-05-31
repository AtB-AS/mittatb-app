import {View} from 'react-native';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import ThemeText from '@atb/components/text';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
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

  const shouldShowOneDayTicket = preassignedFareproducts
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
            title={t(TicketsTexts.availableTickets.singleTicket.title)}
            transportationModeTexts={t(
              TicketsTexts.availableTickets.singleTicket.transportModes,
            )}
            transportationModeIcons={[
              {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
            ]}
            description={t(
              TicketsTexts.availableTickets.singleTicket.description,
            )}
            ticketIllustration="Single"
            onPress={onBuySingleTicket}
            testID="singleTicket"
          />
        )}
        {shouldShowPeriodTicket && (
          <Ticket
            title={t(TicketsTexts.availableTickets.periodTicket.title)}
            transportationModeTexts={t(
              TicketsTexts.availableTickets.periodTicket.transportModes,
            )}
            transportationModeIcons={[
              {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
            ]}
            description={t(
              TicketsTexts.availableTickets.periodTicket.description,
            )}
            ticketIllustration="Period"
            onPress={onBuyPeriodTicket}
            testID="periodicTicket"
          />
        )}
      </View>
      {shouldShowOneDayTicket && (
        <View style={styles.ticketsContainer}>
          <Ticket
            title={t(TicketsTexts.availableTickets.hour24.title)}
            transportationModeTexts={t(
              TicketsTexts.availableTickets.hour24.transportModes,
            )}
            transportationModeIcons={[
              {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
            ]}
            description={t(
              TicketsTexts.availableTickets.hour24.description,
            )}
            ticketIllustration="H24"
            onPress={onBuyHour24Ticket}
            testID="24HourTicket"
          />
        </View>
      )}
      {shouldShowSummerPass && (
        <View style={styles.ticketsContainer}>
          <Ticket
            title={t(TicketsTexts.availableTickets.summerPass.title)}
            transportationModeTexts={t(
              TicketsTexts.availableTickets.summerPass.transportModes,
            )}
            transportationModeIcons={[
              {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
              {mode: Mode.Rail},
              {mode: Mode.Water},
            ]}
            description={t(
              TicketsTexts.availableTickets.summerPass.description,
            )}
            ticketIllustration="Summer"
            accented={true}
            onPress={onBuyPeriodTicket}
            testID="summerTicket"
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
  singleTicket: {
    marginRight: theme.spacings.medium,
  },
}));
