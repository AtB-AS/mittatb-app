import React from 'react';
import {View, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StyleSheet, useTheme} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import SimpleTicket from '../Ticket';
import hexToRgba from 'hex-to-rgba';
import ThemeText from '../../../components/text';
import {ActiveReservation, FareContract} from '../../../tickets';
import TicketReservation from './TicketReservation';
import {RootStackParamList} from '../../../navigation';
import ErrorBoundary from '../../../error-boundary';
import {TicketsTexts, useTranslation} from '../../../translations';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: ActiveReservation[];
  fareContracts?: FareContract[];
  noTicketsLabel: string;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  now: number;
};

const TicketsScrollView: React.FC<Props> = ({
  fareContracts,
  reservations,
  noTicketsLabel,
  isRefreshingTickets,
  refreshTickets,
  now,
}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const {t} = useTranslation();

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
        {!fareContracts?.length && !reservations?.length && (
          <ThemeText style={styles.noTicketsText}>{noTicketsLabel}</ThemeText>
        )}
        {reservations?.map((res) => (
          <TicketReservation key={res.reservation.order_id} reservation={res} />
        ))}
        {fareContracts?.map((fc) => (
          <ErrorBoundary
            key={fc.orderId}
            message={t(TicketsTexts.scrollView.errorLoadingTicket(fc.orderId))}
          >
            <SimpleTicket
              fareContract={fc}
              now={now}
              onPressDetails={() =>
                navigation.navigate('TicketModal', {
                  screen: 'TicketDetails',
                  params: {orderId: fc.orderId},
                })
              }
            />
          </ErrorBoundary>
        ))}
      </ScrollView>
      <LinearGradient
        style={{position: 'absolute', bottom: 0, width: '100%', height: 30}}
        colors={[
          hexToRgba(theme.background.level1, 0.1),
          hexToRgba(theme.background.level1, 1),
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
  },
  gradient: {
    backgroundColor: theme.background.level1,
  },
}));

export default TicketsScrollView;
