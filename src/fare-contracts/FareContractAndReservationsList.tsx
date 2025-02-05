import React from 'react';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {Reservation} from '@atb/ticketing';
import {useAnalyticsContext} from '@atb/analytics';
import {EmptyState} from '@atb/components/empty-state';
import {useSortFcOrReservationByValidityAndCreation} from './utils';
import {getFareContractInfo} from './utils';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import type {EmptyStateProps} from '@atb/components/empty-state';
import {FareContract} from '@atb-as/utils';

type Props = {
  reservations: Reservation[];
  fareContracts: FareContract[];
  now: number;
  onPressFareContract: (orderId: string) => void;
  emptyStateConfig: Pick<
    EmptyStateProps,
    'title' | 'details' | 'illustrationComponent'
  >;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  now,
  onPressFareContract,
  emptyStateConfig,
}) => {
  const styles = useStyles();
  const analytics = useAnalyticsContext();

  const fcOrReservations = [...fareContracts, ...reservations];

  const fareContractsAndReservationsSorted =
    useSortFcOrReservationByValidityAndCreation(
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
            onPressFareContract(fcOrReservation.orderId);
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
