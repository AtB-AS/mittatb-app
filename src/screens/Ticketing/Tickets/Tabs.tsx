import React, {useState} from 'react';
import {View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '..';
import {useTicketState} from '../TicketContext';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import Button from '../../../components/button';
import useInterval from '../../../utils/use-interval';
import TicketsScrollView from './TicketsScrollView';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Tickets'>;
};

export const ActiveTickets: React.FC<Props> = ({navigation}) => {
  const {fareContracts, isRefreshingTickets, refreshTickets} = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const valid = (f: FareContract): boolean =>
    f.usage_valid_to > Date.now() / 1000;
  const byExpiry = (a: FareContract, b: FareContract): number => {
    return b.usage_valid_to - a.usage_valid_to;
  };
  const validTickets = fareContracts?.filter((fc) => valid(fc)).sort(byExpiry);
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <TicketsScrollView
        tickets={validTickets}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={refreshTickets}
        noTicketsLabel="Du har ingen aktive billetter"
        now={now}
      />

      <View style={styles.buttonContainer}>
        <Button
          text="Kjøp enkeltbillett"
          onPress={() => {
            navigation.push('Offer');
          }}
          style={{marginBottom: 0}}
        />
      </View>
    </View>
  );
};

export const ExpiredTickets: React.FC<Props> = ({navigation}) => {
  const {fareContracts, isRefreshingTickets, refreshTickets} = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const expired = (f: FareContract): boolean =>
    !(f.usage_valid_to > Date.now() / 1000);
  const byExpiry = (a: FareContract, b: FareContract): number => {
    return b.usage_valid_to - a.usage_valid_to;
  };
  const expiredTickets = fareContracts
    ?.filter((fc) => expired(fc))
    .sort(byExpiry);
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
      <View style={styles.buttonContainer}>
        <Button
          text="Kjøp enkeltbillett"
          onPress={() => {
            navigation.push('Offer');
          }}
          style={{marginBottom: 0}}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level1,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));
