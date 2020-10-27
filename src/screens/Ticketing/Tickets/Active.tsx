import React, {useState} from 'react';
import {View, Text, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '..';
import {useTicketState} from '../TicketContext';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import Button from '../../../components/button';
import Ticket from './Ticket';
import ReceiptModal from './ReceiptModal';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Tickets'>;
};

const Tickets: React.FC<Props> = ({navigation}) => {
  const {
    paymentFailedReason,
    paymentFailedForReason,
    fareContracts,
    isRefreshingTickets,
    refreshTickets,
  } = useTicketState();
  const [selectedFareContract, setSelectedFareContract] = useState<
    FareContract | undefined
  >(undefined);
  const showReceiptModal = (f: FareContract) => {
    setSelectedFareContract(f);
  };

  const [now, setNow] = useState<number>(Date.now());
  setInterval(() => setNow(Date.now()), 2500);

  const valid = (f: FareContract): boolean =>
    f.usage_valid_to > Date.now() / 1000;
  const byExpiry = (a: FareContract, b: FareContract): number => {
    return b.usage_valid_to - a.usage_valid_to;
  };
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
        {fareContracts?.length ? (
          fareContracts
            .filter((fc) => valid(fc))
            .sort(byExpiry)
            .map((fc) => (
              <Ticket key={fc.order_id} fareContract={fc} now={now} />
            ))
        ) : (
          <Text style={styles.nonActiveText}>
            Du har ingen aktive billetter
          </Text>
        )}
        <ReceiptModal
          fareContract={selectedFareContract}
          show={!!selectedFareContract}
          close={() => setSelectedFareContract(undefined)}
        />
      </ScrollView>
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
    backgroundColor: theme.background.level1,
    flex: 1,
  },
  scrollView: {flex: 1, padding: theme.spacings.medium},
  iconContainer: {marginRight: theme.spacings.medium},
  validityText: {
    fontSize: theme.text.sizes.lead,
    color: theme.text.colors.faded,
  },
  nonActiveText: {
    fontSize: theme.text.sizes.body,
    textAlign: 'center',
  },
  travellersText: {
    fontSize: theme.text.sizes.body,
    paddingVertical: theme.spacings.xSmall,
  },
  ticketContainer: {
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    marginBottom: theme.spacings.medium,
  },
  extraText: {
    fontSize: theme.text.sizes.lead,
    paddingVertical: theme.spacings.xSmall,
    color: theme.text.colors.faded,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 3,
    padding: theme.spacings.medium,
  },
  ticketInfoContainer: {
    padding: theme.spacings.medium,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  receiptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export default Tickets;
