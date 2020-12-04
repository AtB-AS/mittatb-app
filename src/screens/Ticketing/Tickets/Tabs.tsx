import React, {useState} from 'react';
import {View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTicketState} from '../../../TicketContext';
import {FareContractTicket} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import useInterval from '../../../utils/use-interval';
import TicketsScrollView from './TicketsScrollView';
import {RootStackParamList} from '../../../navigation';
import TicketOptions from './TicketOptions';

export type TicketingScreenNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type Props = {
  navigation: TicketingScreenNavigationProp;
};

export const ActiveTickets: React.FC<Props> = ({navigation}) => {
  const {
    activeReservations,
    fareContractTickets,
    isRefreshingTickets,
    refreshTickets,
    fareContractTypes,
    isRefreshingTypes,
  } = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const valid = (f: FareContractTicket): boolean =>
    f.usage_valid_to > Date.now() / 1000;
  const byExpiry = (a: FareContractTicket, b: FareContractTicket): number => {
    return b.usage_valid_to - a.usage_valid_to;
  };
  const validTickets = fareContractTickets?.filter(valid).sort(byExpiry);
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <TicketsScrollView
        reservations={activeReservations}
        tickets={validTickets}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={refreshTickets}
        noTicketsLabel="Du har ingen aktive billetter"
        now={now}
      />

      <TicketOptions
        fareContractTypes={fareContractTypes}
        isRefreshingTypes={isRefreshingTypes}
        navigation={navigation}
      />
    </View>
  );
};

export const ExpiredTickets: React.FC<Props> = ({navigation}) => {
  const {
    fareContractTickets,
    isRefreshingTickets,
    refreshTickets,
    fareContractTypes,
    isRefreshingTypes,
  } = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const expired = (f: FareContractTicket): boolean =>
    !(f.usage_valid_to > Date.now() / 1000);
  const byExpiry = (a: FareContractTicket, b: FareContractTicket): number => {
    return b.usage_valid_to - a.usage_valid_to;
  };
  const expiredTickets = fareContractTickets?.filter(expired).sort(byExpiry);
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <TicketsScrollView
        tickets={expiredTickets}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={refreshTickets}
        noTicketsLabel="Fant ingen billetthistorikk"
        now={now}
      />

      <TicketOptions
        fareContractTypes={fareContractTypes}
        isRefreshingTypes={isRefreshingTypes}
        navigation={navigation}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level1,
  },
}));
