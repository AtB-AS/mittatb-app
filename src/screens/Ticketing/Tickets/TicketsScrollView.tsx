import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  FareContract,
  Reservation,
  Timestamp,
  TravelCard,
  useTicketState,
} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback} from 'react';
import {RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import TravelCardInformation from './TravelCardInformation';
import MessageBox from '@atb/components/message-box';
import TravelTokenBox from '@atb/travel-token-box';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import TicketsToDisplay from '@atb/screens/Ticketing/Tickets/TicketsToDisplay';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  noTicketsLabel: string;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  now: number;
  travelCard?: TravelCard;
  showTokenInfo?: boolean;
};

type TicketToDisplay = {
  type: 'fareContract' | 'reservation';
  createdAt: Timestamp;
  ticket: FareContract | Reservation;
};

const TicketsScrollView: React.FC<Props> = ({
  fareContracts,
  reservations,
  noTicketsLabel,
  isRefreshingTickets,
  refreshTickets,
  now,
  travelCard,
  showTokenInfo,
}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const hasEnabledMobileToken = useHasEnabledMobileToken();

  const hasActiveTravelCard = !!travelCard;

  const getFareContractsToDisplay = useCallback(() => {
    return fareContracts
      ? fareContracts.map((fc) => {
          return {
            type: 'fareContract',
            createdAt: fc.created,
            ticket: fc,
          } as TicketToDisplay;
        })
      : [];
  }, [fareContracts]);

  const getReservationsToDisplay = useCallback(() => {
    return reservations
      ? reservations.map((res) => {
          return {
            type: 'reservation',
            createdAt: res.created,
            ticket: res,
          } as TicketToDisplay;
        })
      : [];
  }, [reservations]);

  const getTicketsToDisplay = useCallback((): TicketToDisplay[] => {
    return [...getFareContractsToDisplay(), ...getReservationsToDisplay()].sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
    );
  }, [reservations, fareContracts]);

  const ticketsToDisplay = getTicketsToDisplay();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingTickets}
            onRefresh={refreshTickets}
          />
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
        {!ticketsToDisplay.length && (
          <MessageBox
            containerStyle={styles.messageBox}
            type="info"
            message={noTicketsLabel}
          />
        )}
        {ticketsToDisplay?.map((ttd, index) => (
          <TicketsToDisplay
            now={now}
            navigation={navigation}
            key={ttd.ticket.orderId}
            ticket={ttd.ticket}
            type={ttd.type}
            index={index}
          />
        ))}
      </ScrollView>
      <LinearGradient
        style={{position: 'absolute', bottom: 0, width: '100%', height: 30}}
        colors={[
          hexToRgba(theme.static.background.background_1.background, 0.1),
          hexToRgba(theme.static.background.background_1.background, 1),
        ]}
        pointerEvents={'none'}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, marginBottom: theme.spacings.small},
  scrollView: {flex: 1, padding: theme.spacings.medium},
  noTicketsText: {
    textAlign: 'center',
    marginBottom: theme.spacings.medium,
  },
  gradient: {
    backgroundColor: theme.static.background.background_1.background,
  },
  messageBox: {
    marginBottom: theme.spacings.large,
  },
}));

export default TicketsScrollView;
