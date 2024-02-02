import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  filterExpiredFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import React from 'react';
import {View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {useAnalytics} from '@atb/analytics';
import {useTimeContextState} from '@atb/time';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {TicketTabNavScreenProps} from './navigation-types';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';

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
  const analytics = useAnalytics();

  const activeFareContracts = filterAndSortActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );

  const styles = useStyles();
  const {t} = useTranslation();

  const hasExpiredFareContracts =
    filterExpiredFareContracts(fareContracts, serverNow).length > 0;

  const hasSentFareContracts = false; // TODO replace with proper checking

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
              text={t(TicketHistoryModeTexts.expired.title)}
              accessibility={{
                accessibilityHint: t(TicketHistoryModeTexts.expired.titleA11y),
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
              text={t(TicketHistoryModeTexts.sent.title)}
              accessibility={{
                accessibilityHint: t(TicketHistoryModeTexts.sent.titleA11y),
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
