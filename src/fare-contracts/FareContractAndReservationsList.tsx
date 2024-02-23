import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {TravelTokenBox} from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {useAnalytics} from '@atb/analytics';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';
import {TicketHistoryMode} from '@atb/ticket-history';
import {getFareContractInfo} from './utils';
import {useAuthState} from '@atb/auth';

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
  const {abtCustomerId: currentUserId} = useAuthState();

  const calculateWeight = useCallback(
    (fcOrReservation: FareContract | Reservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      // Make reservations go first, then fare contracts
      if (!isFareContract) return 1;

      const fc = getFareContractInfo(now, fcOrReservation, currentUserId);
      return fc.validityStatus === 'valid' ? 1 : 0;
    },
    [now, currentUserId],
  );

  const fareContractsAndReservationsSorted = useMemo(() => {
    return [...(fareContracts || []), ...(reservations || [])].sort((a, b) => {
      const validityWeight = calculateWeight(b) - calculateWeight(a);
      return validityWeight === 0
        ? b.created.toMillis() - a.created.toMillis()
        : validityWeight;
    });
  }, [fareContracts, reservations, calculateWeight]);

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
