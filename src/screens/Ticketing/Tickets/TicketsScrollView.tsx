import React from 'react';
import {View, Text, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet, useTheme} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Ticket from './Ticket';
import hexToRgba from 'hex-to-rgba';

type Props = {
  tickets?: FareContract[];
  noTicketsLabel: string;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  now: number;
};

const TicketsScrollView: React.FC<Props> = ({
  tickets,
  noTicketsLabel,
  isRefreshingTickets,
  refreshTickets,
  now,
}) => {
  const {theme} = useTheme();
  const styles = useStyles();

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
        {tickets?.length ? (
          tickets.map((fc) => (
            <Ticket key={fc.order_id} fareContract={fc} now={now} />
          ))
        ) : (
          <Text style={styles.noTicketsText}>{noTicketsLabel}</Text>
        )}
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
  container: {flex: 1, marginBottom: 8},
  scrollView: {flex: 1, padding: theme.spacings.medium},
  noTicketsText: {
    fontSize: theme.text.sizes.body,
    textAlign: 'center',
  },
  gradient: {
    backgroundColor: theme.background.level1,
  },
}));

export default TicketsScrollView;
