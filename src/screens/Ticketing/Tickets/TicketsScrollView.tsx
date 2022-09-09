import ErrorBoundary from '@atb/error-boundary';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  Reservation,
  FareContract,
  TravelCard,
  useTicketState,
} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import SimpleTicket from '../Ticket';
import TicketReservation from './TicketReservation';
import TravelCardInformation from './TravelCardInformation';
import MessageBox from '@atb/components/message-box';
import TravelTokenBox from '@atb/travel-token-box';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import ErroredTicket from '@atb/screens/Ticketing/Tickets/ErroredTicket';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  noTicketsLabel: string;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  now: number;
  travelCard?: TravelCard;
  didPaymentFail?: boolean;
  showTokenInfo?: boolean;
};

const TicketsScrollView: React.FC<Props> = ({
  fareContracts,
  reservations,
  noTicketsLabel,
  isRefreshingTickets,
  refreshTickets,
  now,
  travelCard,
  didPaymentFail = false,
  showTokenInfo,
}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const {t} = useTranslation();
  const {resetPaymentStatus} = useTicketState();
  const hasEnabledMobileToken = useHasEnabledMobileToken();

  const hasActiveTravelCard = !!travelCard;

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
        {didPaymentFail && (
          <MessageBox
            containerStyle={styles.messageBox}
            type="error"
            message={t(TicketsTexts.scrollView.paymentError)}
            onPress={resetPaymentStatus}
            onPressText={t(TicketsTexts.scrollView.paymentErrorButton)}
          />
        )}
        {!fareContracts?.length && !reservations?.length && (
          <MessageBox
            containerStyle={styles.messageBox}
            type="info"
            message={noTicketsLabel}
          />
        )}
        {reservations?.map((res) =>
          res.paymentStatus !== 'REJECT' ? (
            <TicketReservation key={res.orderId} reservation={res} />
          ) : (
            <ErroredTicket key={res.orderId} reservation={res} />
          ),
        )}
        {fareContracts?.map((fc, index) => (
          <ErrorBoundary
            key={fc.orderId}
            message={t(TicketsTexts.scrollView.errorLoadingTicket(fc.orderId))}
          >
            <SimpleTicket
              hasActiveTravelCard={hasActiveTravelCard}
              fareContract={fc}
              now={now}
              onPressDetails={() =>
                navigation.navigate('TicketModal', {
                  screen: 'TicketDetails',
                  params: {orderId: fc.orderId},
                })
              }
              testID={'ticket' + index}
            />
          </ErrorBoundary>
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
