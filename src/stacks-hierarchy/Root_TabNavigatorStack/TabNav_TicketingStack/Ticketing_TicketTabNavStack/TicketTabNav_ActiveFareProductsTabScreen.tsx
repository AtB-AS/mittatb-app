import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  filterMyExpiredFareContracts,
  filterSentFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import React from 'react';
import {View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {useAnalytics} from '@atb/analytics';
import {useTimeContextState} from '@atb/time';
import {LinkSectionItem, Section} from '@atb/components/sections';
import Ticketing from '@atb/translations/screens/Ticketing';
import {TicketTabNavScreenProps} from './navigation-types';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useAuthState} from '@atb/auth';

type Props =
  TicketTabNavScreenProps<'TicketTabNav_ActiveFareProductsTabScreen'>;

export const TicketTabNav_ActiveFareProductsTabScreen = ({
  navigation,
}: Props) => {
  const {
    reservations,
    fareContracts,
    isRefreshingFareContracts,
    resubscribeFirestoreListeners,
  } = useTicketingState();
  const {serverNow} = useTimeContextState();
  const {abtCustomerId} = useAuthState();
  const analytics = useAnalytics();

  const activeFareContracts = abtCustomerId
    ? filterAndSortActiveOrCanBeUsedFareContracts(
        fareContracts,
        serverNow,
        abtCustomerId,
      )
    : [];

  const styles = useStyles();
  const {t} = useTranslation();

  const hasExpiredFareContracts =
    abtCustomerId &&
    filterMyExpiredFareContracts(fareContracts, serverNow, abtCustomerId)
      .length > 0;

  const hasSentFareContracts =
    abtCustomerId &&
    filterSentFareContracts(fareContracts, abtCustomerId).length > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingFareContracts}
            onRefresh={() => {
              resubscribeFirestoreListeners();
              analytics.logEvent('Ticketing', 'Pull to refresh tickets', {
                reservationsCount: reservations.length,
                activeFareContractsCount: activeFareContracts.length,
              });
            }}
          />
        }
      >
        <FareContractAndReservationsList
          reservations={reservations}
          fareContracts={activeFareContracts}
          now={serverNow}
          showTokenInfo={true}
          emptyStateTitleText={t(
            TicketingTexts.activeFareProductsAndReservationsTab
              .noActiveTicketsTitle,
          )}
          emptyStateDetailsText={t(
            TicketingTexts.activeFareProductsAndReservationsTab
              .noActiveTicketsDetails,
          )}
        />
        <Section style={styles.content}>
          {hasExpiredFareContracts && (
            <LinkSectionItem
              text={t(Ticketing.expiredTickets.title)}
              accessibility={{
                accessibilityHint: t(Ticketing.expiredTickets.a11yHint),
              }}
              testID="expiredTicketsButton"
              onPress={() =>
                navigation.navigate('Ticketing_TicketHistoryScreen', {
                  mode: 'expired',
                })
              }
            />
          )}

          {hasSentFareContracts && (
            <LinkSectionItem
              text={t(Ticketing.sentToOthers.title)}
              accessibility={{
                accessibilityHint: t(Ticketing.sentToOthers.a11yHint),
              }}
              testID="sentToOthersButton"
              onPress={() =>
                navigation.navigate('Ticketing_TicketHistoryScreen', {
                  mode: 'sent',
                })
              }
            />
          )}
        </Section>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
    padding: theme.spacings.medium,
  },
  content: {
    flex: 1,
    marginBottom: theme.spacings.medium,
  },
}));
