import {View} from 'react-native';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {ScrollView} from 'react-native-gesture-handler';
import ThemeText from '@atb/components/text';
import * as TicketIcons from '@atb/assets/svg/color/illustrations/ticket-type/dark';
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
}: {
  onBuySingleTicket: () => void;
  onBuyPeriodTicket: () => void;
}) => {
  const styles = useStyles();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {preassignedFareproducts} = useFirestoreConfiguration();
  const {t} = useTranslation();
  const {theme} = useTheme();

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

  const shouldShowSummerPass = false;

  return (
    <>
      <ThemeText
        type="body__secondary"
        style={{
          marginLeft: theme.spacings.xLarge,
          marginBottom: theme.spacings.medium,
        }}
      >
        {t(TicketsTexts.availableTickets.allTickets)}
      </ThemeText>
      <View style={styles.container}>
        <ScrollView>
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
                icon={TicketIcons.Single}
                onPress={onBuySingleTicket}
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
                icon={TicketIcons.Period}
                onPress={onBuyPeriodTicket}
              />
            )}
          </View>
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
                icon={TicketIcons.Summer}
                accented={true}
                onPress={onBuyPeriodTicket}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_1.backgroundColor,
  },

  ticketsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    alignItems: 'stretch',
  },
}));
