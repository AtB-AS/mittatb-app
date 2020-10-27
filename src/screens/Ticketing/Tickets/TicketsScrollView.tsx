import React, {useState} from 'react';
import {View, Text, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '..';
import {useTicketState} from '../TicketContext';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Ticket from './Ticket';

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
        colors={['rgba(245, 245, 246, 0.1)', 'rgba(245, 245, 246, 1)']}
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
}));

export default TicketsScrollView;
