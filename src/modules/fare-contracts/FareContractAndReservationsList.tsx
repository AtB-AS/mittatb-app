import React from 'react';
import {FareContractOrReservation} from './FareContractOrReservation';
import {Reservation} from '@atb/modules/ticketing';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {EmptyState} from '@atb/components/empty-state';
import {getSortedFareContractsAndReservations} from './sort-fc-or-reservation';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import type {EmptyStateProps} from '@atb/components/empty-state';
import {FareContractType} from '@atb-as/utils';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

type Props = {
  reservations: Reservation[];
  fareContracts: FareContractType[];
  now: number;
  onPressFareContract: (orderId: string) => void;
  onNavigateToBonusScreen: () => void;
  onNavigateToPurchaseFlow: (newSelection: PurchaseSelectionType) => void;
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
  onNavigateToBonusScreen,
  onNavigateToPurchaseFlow,
  emptyStateConfig,
}) => {
  const styles = useStyles();
  const analytics = useAnalyticsContext();

  const fcAndReservations = getSortedFareContractsAndReservations(
    fareContracts,
    reservations,
    now,
  );

  return (
    <View style={styles.container}>
      {!fcAndReservations.length && (
        <EmptyState {...emptyStateConfig} testID="fareContracts" />
      )}
      {fcAndReservations?.map((fcOrReservation, index) => (
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
          onNavigateToBonusScreen={onNavigateToBonusScreen}
          onNavigateToPurchaseFlow={onNavigateToPurchaseFlow}
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
