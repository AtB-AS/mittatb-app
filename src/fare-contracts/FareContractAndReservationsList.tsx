import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {StyleSheet} from '@atb/theme';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {TravelTokenBox} from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useAnalytics} from '@atb/analytics';
import {TravelCardInformation} from '@atb/fare-contracts/components/TravelCardInformation';
import {TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';

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
  emptyStateDetailsA11yLabel?: string;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  isRefreshing,
  refresh,
  now,
  travelCard,
  showTokenInfo,
  emptyStateTitleText,
  emptyStateDetailsText,
  emptyStateDetailsA11yLabel,
}) => {
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const analytics = useAnalytics();
  const hasActiveTravelCard = !!travelCard;

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
        {showTokenInfo &&
          (hasEnabledMobileToken ? (
            <TravelTokenBox
              showIfThisDevice={false}
              showHowToChangeHint={true}
            />
          ) : hasActiveTravelCard ? (
            <TravelCardInformation travelCard={travelCard} />
          ) : null)}
        {!fareContractsAndReservationsSorted.length && (
          <EmptyState
            title={emptyStateTitleText}
            details={emptyStateDetailsText}
            detailsA11yLabel={emptyStateDetailsA11yLabel}
            illustrationComponent={<TicketTilted height={84} />}
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
