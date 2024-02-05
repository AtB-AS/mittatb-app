import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {TravelTokenBox} from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {useAnalytics} from '@atb/analytics';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';

type RootNavigationProp = NavigationProp<RootStackParamList>;

export type EmptyStateMode = 'expired' | 'sent';

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  now: number;
  travelCard?: TravelCard;
  showTokenInfo?: boolean;
  emptyStateMode?: EmptyStateMode;
  emptyStateTitleText: string;
  emptyStateDetailsText: string;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  now,
  showTokenInfo,
  emptyStateMode = 'expired',
  emptyStateTitleText,
  emptyStateDetailsText,
}) => {
  const navigation = useNavigation<RootNavigationProp>();
  const analytics = useAnalytics();

  /**
   * This const will filter out completed reservation to not be shown,
   * so when a user only have sent tickets to someone else,
   * the completed reservations are not included in the calculation,
   * showing a proper empty page.
   */
  const filterFinishedReservation = reservations?.filter((reservation) => {
    reservation.paymentStatus !== 'CAPTURE';
  });

  const fareContractsAndReservationsSorted = useMemo(() => {
    return [
      ...(fareContracts || []),
      ...(filterFinishedReservation || []),
    ].sort((a, b) => b.created.toMillis() - a.created.toMillis());
  }, [filterFinishedReservation, fareContracts]);

  return (
    <>
      {showTokenInfo && (
        <TravelTokenBox
          showIfThisDevice={false}
          interactiveColor="interactive_2"
        />
      )}
      {!fareContractsAndReservationsSorted.length && (
        <EmptyState
          title={emptyStateTitleText}
          details={emptyStateDetailsText}
          illustrationComponent={emptyStateImage(emptyStateMode)}
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
    </>
  );
};

const emptyStateImage = (emptyStateMode: EmptyStateMode) => {
  switch (emptyStateMode) {
    case 'expired':
      return <TicketTilted height={84} />;
    case 'sent':
      return <HoldingHands height={84} />;
  }
};
