import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  useFareContracts,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {useTimeContext} from '@atb/modules/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {useAuthContext} from '@atb/modules/auth';
import React from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FlatList} from 'react-native-gesture-handler';
import {FareContractOrReservation} from '@atb/modules/fare-contracts';
import {EmptyState} from '@atb/components/empty-state';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {sortFcOrReservationByCreation} from '@atb/modules/fare-contracts';

type Props = {
  onPressFareContract: (fareContractId: string) => void;
  navigateToBonusScreen: () => void;
};

export const PurchaseHistoryScreenComponent = ({
  onPressFareContract,
  navigateToBonusScreen,
}: Props) => {
  const {sentFareContracts, reservations, rejectedReservations} =
    useTicketingContext();
  const {serverNow} = useTimeContext();
  const analytics = useAnalyticsContext();
  const {fareContracts: historicalFareContracts} = useFareContracts(
    {availability: 'historical'},
    serverNow,
  );
  const {abtCustomerId: customerAccountId} = useAuthContext();

  const {t} = useTranslation();
  const styles = useStyles();

  const fareContractsToShow = sentFareContracts.concat(historicalFareContracts);
  const reservationsToShow = getReservationsToShow(
    reservations,
    rejectedReservations,
    customerAccountId,
  );

  const sortedItems = sortFcOrReservationByCreation([
    ...fareContractsToShow,
    ...reservationsToShow,
  ]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketingTexts.purchaseHistory.title)}
        leftButton={{type: 'back'}}
      />
      <FlatList
        data={sortedItems}
        renderItem={({item, index}) => (
          <FareContractOrReservation
            navigateToBonusScreen={navigateToBonusScreen}
            now={serverNow}
            onPressFareContract={() => {
              // Reservations don't have `id`, but also don't show the link to
              // ticket details.
              if ('id' in item) {
                analytics.logEvent('Ticketing', 'Ticket details clicked');
                onPressFareContract(item.id);
              }
            }}
            fcOrReservation={item}
            index={index}
          />
        )}
        keyExtractor={(item) => item.created + item.orderId}
        ListEmptyComponent={
          <EmptyState
            title={t(TicketingTexts.purchaseHistory.emptyState.title)}
            details={t(TicketingTexts.purchaseHistory.emptyState.description)}
            illustrationComponent={<ThemedTicketTilted height={84} />}
            testID="fareContracts"
          />
        }
        contentContainerStyle={styles.flatListContent}
        testID="ticketHistoryScrollView"
      />
    </View>
  );
};

const getReservationsToShow = (
  reservations: Reservation[],
  rejectedReservations: Reservation[],
  customerAccountId?: string,
) => {
  const reservationsToShow: Reservation[] = [];

  //TODO Jorunn: check if necessary

  // only show reservations for tickets sent to others
  reservationsToShow.push(
    ...reservations.filter(
      (reservation) => reservation.customerAccountId !== customerAccountId,
    ),
  );

  // only show rejected reservations for tickets purchesed for own account
  reservationsToShow.push(
    ...rejectedReservations.filter(
      (reservation) => reservation.customerAccountId === customerAccountId,
    ),
  );

  return reservationsToShow;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  flatListContent: {gap: theme.spacing.large, padding: theme.spacing.medium},
}));
