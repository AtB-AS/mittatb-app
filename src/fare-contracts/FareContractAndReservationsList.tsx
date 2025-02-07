import React from 'react';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {FareContract, Reservation} from '@atb/ticketing';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAnalyticsContext} from '@atb/analytics';
import {EmptyState} from '@atb/components/empty-state';
import {sortFcOrReservationByValidityAndCreation} from './sort-fc-or-reservation-by-validity-and-creation';
import {getFareContractInfo} from './utils';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import type {EmptyStateProps} from '@atb/components/empty-state';
import {useAuthContext} from '@atb/auth';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations: Reservation[];
  fareContracts: FareContract[];
  now: number;
  emptyStateConfig: Pick<
    EmptyStateProps,
    'title' | 'details' | 'illustrationComponent'
  >;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  now,
  emptyStateConfig,
}) => {
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const analytics = useAnalyticsContext();
  const {abtCustomerId} = useAuthContext();

  const fcOrReservations = [...fareContracts, ...reservations];

  const fareContractsAndReservationsSorted =
    sortFcOrReservationByValidityAndCreation(
      abtCustomerId,
      now,
      fcOrReservations,
      (currentTime, fareContract, currentUserId) =>
        getFareContractInfo(currentTime, fareContract, currentUserId)
          .validityStatus,
    );

  return (
    <View style={styles.container}>
      {!fareContractsAndReservationsSorted.length && (
        <EmptyState {...emptyStateConfig} testID="fareContracts" />
      )}
      {fareContractsAndReservationsSorted?.map((fcOrReservation, index) => (
        <FareContractOrReservation
          now={now}
          onPressFareContract={() => {
            analytics.logEvent('Ticketing', 'Ticket details clicked');
            navigation.navigate({
              name: 'Root_FareContractDetailsScreen',
              params: {
                orderId: fcOrReservation.orderId,
              },
            });
          }}
          key={fcOrReservation.orderId}
          fcOrReservation={fcOrReservation}
          index={index}
        />
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.large,
  },
}));
