import React from 'react';
import {FareContractOrReservation} from './FareContractOrReservation';
import {Reservation} from '@atb/ticketing';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {EmptyState} from '@atb/components/empty-state';
import {sortFcOrReservationByValidityAndCreation} from './sort-fc-or-reservation-by-validity-and-creation';
import {getFareContractInfo} from './utils';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import type {EmptyStateProps} from '@atb/components/empty-state';
import {FareContractType} from '@atb-as/utils';
import {useAuthContext} from '@atb/auth';

type Props = {
  reservations: Reservation[];
  fareContracts: FareContractType[];
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
            // Reservations don't have `id`, but also don't show the link to
            // ticket details.
            if ('id' in fcOrReservation) {
              analytics.logEvent('Ticketing', 'Ticket details clicked');
              onPressFareContract(fcOrReservation.id);
            }
          }}
          key={
            'id' in fcOrReservation
              ? fcOrReservation.id
              : fcOrReservation.orderId
          }
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
