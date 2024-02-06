import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {TravelTokenBox} from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {useAnalytics} from '@atb/analytics';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';
import {TicketHistoryMode} from '@atb/ticket-history';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  now: number;
  travelCard?: TravelCard;
  showTokenInfo?: boolean;
  mode?: TicketHistoryMode;
  emptyStateTitleText: string;
  emptyStateDetailsText: string;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  now,
  showTokenInfo,
  mode = 'expired',
  emptyStateTitleText,
  emptyStateDetailsText,
}) => {
  const navigation = useNavigation<RootNavigationProp>();
  const analytics = useAnalytics();

  const fareContractsAndReservationsSorted = useMemo(() => {
    return [...(fareContracts || []), ...(reservations || [])].sort(
      (a, b) => b.created.toMillis() - a.created.toMillis(),
    );
  }, [reservations, fareContracts]);

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
          illustrationComponent={emptyStateImage(mode)}
          testID="fareContracts"
        />
      )}
      {fareContractsAndReservationsSorted?.map((fcOrReservation, index) => (
        <FareContractOrReservation
          now={now}
          mode={mode}
          onPressFareContract={() => {
            analytics.logEvent('Ticketing', 'Ticket details clicked');
            navigation.navigate({
              name: 'Root_FareContractDetailsScreen',
              params: {
                orderId: fcOrReservation.orderId,
                isSentFareContract: mode == 'sent',
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

const emptyStateImage = (emptyStateMode: TicketHistoryMode) => {
  switch (emptyStateMode) {
    case 'expired':
      return <TicketTilted height={84} />;
    case 'sent':
      return <HoldingHands height={84} />;
  }
};
