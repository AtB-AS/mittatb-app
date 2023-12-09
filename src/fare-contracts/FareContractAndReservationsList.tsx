import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {StyleSheet} from '@atb/theme';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {TravelTokenBox} from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useAnalytics} from '@atb/analytics';
import {TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  isRefreshing: boolean;
  refresh: () => void;
  now: number;
  travelCard?: TravelCard;
  showTokenInfo?: boolean;
  emptyStateTitleText: string;
  emptyStateDetailsText: string;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  isRefreshing,
  refresh,
  now,
  showTokenInfo,
  emptyStateTitleText,
  emptyStateDetailsText,
}) => {
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const analytics = useAnalytics();

  const fareContractsAndReservationsSorted = useMemo(() => {
    return [...(fareContracts || []), ...(reservations || [])].sort(
      (a, b) => b.created.toMillis() - a.created.toMillis(),
    );
  }, [reservations, fareContracts]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        {showTokenInfo && (
          <TravelTokenBox showIfThisDevice={false} showHowToChangeHint={true} />
        )}
        {!fareContractsAndReservationsSorted.length && (
          <EmptyState
            title={emptyStateTitleText}
            details={emptyStateDetailsText}
            illustrationComponent={<TicketTilted height={84} />}
            testID="fareContracts"
          />
        )}
        {fareContractsAndReservationsSorted?.map((fcOrReservation, index) => (
          <FareContractOrReservation
            now={now}
            onPressFareContract={() => {
              analytics.logEvent('Ticketing', 'Ticket details clicked');
              navigation.navigate({
                name: 'Root_FareContractDetailsScreen',
                params: {orderId: fcOrReservation.orderId},
              });
            }}
            key={fcOrReservation.orderId}
            fcOrReservation={fcOrReservation}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  scrollView: {flex: 1, padding: theme.spacings.medium},
}));
