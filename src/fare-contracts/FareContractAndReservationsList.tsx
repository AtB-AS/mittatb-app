import React from 'react';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {TravelTokenBox} from '@atb/travel-token-box';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@atb/analytics';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';
import {TicketHistoryMode} from '@atb/ticket-history';
import {useSortFcOrReservationByValidityAndCreation} from './utils';
import {getFareContractInfo} from './utils';
import {useTheme} from '@atb/theme';

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
  const {theme} = useTheme();
  const interactiveColor = theme.color.interactive[2];

  const fcOrReservations = [...(fareContracts || []), ...(reservations || [])];

  const fareContractsAndReservationsSorted =
    useSortFcOrReservationByValidityAndCreation(
      now,
      fcOrReservations,
      (currentTime, fareContract, currentUserId) =>
        getFareContractInfo(currentTime, fareContract, currentUserId)
          .validityStatus,
    );

  return (
    <>
      {showTokenInfo && (
        <TravelTokenBox
          showIfThisDevice={false}
          interactiveColor={interactiveColor}
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
