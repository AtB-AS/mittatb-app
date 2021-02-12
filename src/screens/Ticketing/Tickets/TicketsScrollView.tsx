import {FareContract} from '@atb/api/fareContracts';
import ThemeText from '@atb/components/text';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, useTheme} from '@atb/theme';
import {ActiveReservation} from '@atb/TicketContext';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import SimpleTicket from '../Ticket';
import TicketReservation from './TicketReservation';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: ActiveReservation[];
  tickets?: FareContract[];
  noTicketsLabel: string;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  now: number;
};

const TicketsScrollView: React.FC<Props> = ({
  tickets,
  reservations,
  noTicketsLabel,
  isRefreshingTickets,
  refreshTickets,
  now,
}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();

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
        {!tickets?.length && !reservations?.length && (
          <ThemeText style={styles.noTicketsText}>{noTicketsLabel}</ThemeText>
        )}
        {reservations?.map((res) => (
          <TicketReservation key={res.reservation.order_id} reservation={res} />
        ))}
        {tickets?.map((fc) => (
          <SimpleTicket
            key={fc.order_id}
            fareContract={fc}
            now={now}
            onPressDetails={() =>
              navigation.navigate('TicketModal', {
                screen: 'TicketDetails',
                params: {orderId: fc.order_id},
              })
            }
          />
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
