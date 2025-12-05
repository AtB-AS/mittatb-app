import {StyleSheet} from '@atb/theme';
import {
  useFareContracts,
  useGetFareProductsQuery,
  useTicketingContext,
} from '@atb/modules/ticketing';
import React, {useRef} from 'react';
import {View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/modules/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useTimeContext} from '@atb/modules/time';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {TicketTabNavScreenProps} from './navigation-types';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {TravelTokenBox} from '@atb/travel-token-box';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {useQueryClient} from '@tanstack/react-query';
import {SCHOOL_CARNET_QUERY_KEY} from '@atb/modules/ticketing';

type Props =
  TicketTabNavScreenProps<'TicketTabNav_AvailableFareContractsTabScreen'>;

export const TicketTabNav_AvailableFareContractsTabScreen = ({
  navigation,
}: Props) => {
  const {reservations, sentFareContracts} = useTicketingContext();
  const {serverNow} = useTimeContext();
  const analytics = useAnalyticsContext();
  const queryClient = useQueryClient();

  const {
    fareContracts: availableFareContracts,
    refetch: refetchAvailableFareContracts,
    isRefetching: isRefetchingAvailableFareContracts,
  } = useFareContracts({availability: 'available'}, serverNow);
  const {fareContracts: historicalFareContracts} = useFareContracts(
    {availability: 'historical'},
    serverNow,
  );
  const {refetch: refetchPreassignedFareProducts} = useGetFareProductsQuery();

  const styles = useStyles();
  const {t} = useTranslation();

  const hasHistoricalFareContracts = historicalFareContracts.length > 0;

  const hasSentFareContracts = sentFareContracts.length > 0;

  const sentFareContractRef = useRef<View>(null);

  const onPressChangeButton = () =>
    navigation.navigate('Root_SelectTravelTokenScreen');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingAvailableFareContracts}
            onRefresh={() => {
              refetchAvailableFareContracts();
              refetchPreassignedFareProducts();
              queryClient.invalidateQueries({
                queryKey: [SCHOOL_CARNET_QUERY_KEY],
              });
              analytics.logEvent('Ticketing', 'Pull to refresh tickets', {
                reservationsCount: reservations.length,
                availableFareContractsCount: availableFareContracts.length,
              });
            }}
          />
        }
        testID="availableFCScrollView"
      >
        <TravelTokenBox
          showIfThisDevice={false}
          alwaysShowErrors={false}
          onPressChangeButton={onPressChangeButton}
        />
        <FareContractAndReservationsList
          reservations={reservations}
          fareContracts={availableFareContracts}
          now={serverNow}
          onPressFareContract={(fareContractId) =>
            navigation.navigate('Root_FareContractDetailsScreen', {
              fareContractId,
              transitionOverride: 'slide-from-right',
            })
          }
          emptyStateConfig={{
            title: t(
              TicketingTexts.availableFareProductsAndReservationsTab
                .noActiveTicketsTitle,
            ),
            details: t(
              TicketingTexts.availableFareProductsAndReservationsTab
                .noActiveTicketsDetails,
            ),
            illustrationComponent: <ThemedTicketTilted height={84} />,
          }}
        />
        <Section>
          {hasHistoricalFareContracts && (
            <LinkSectionItem
              text={t(TicketHistoryModeTexts.historical.title)}
              accessibility={{
                accessibilityHint: t(
                  TicketHistoryModeTexts.historical.titleA11y,
                ),
              }}
              testID="historicTicketsButton"
              onPress={() =>
                navigation.navigate('Ticketing_TicketHistoryScreen', {
                  mode: 'historical',
                })
              }
            />
          )}

          {hasSentFareContracts && (
            <LinkSectionItem
              ref={sentFareContractRef}
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
    backgroundColor: theme.color.background.neutral[1].background,
  },
  content: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.large,
  },
}));
