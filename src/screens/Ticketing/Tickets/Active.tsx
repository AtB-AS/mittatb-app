import React, {useState} from 'react';
import {View, Text, RefreshControl, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '..';
import {secondsToDuration} from '../../../utils/date';
import {Expand} from '../../../assets/svg/icons/navigation';
import {useTicketState} from '../TicketContext';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import Button from '../../../components/button';
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
  const nowSecs = Date.now() / 1000;
  const valid = (f: FareContract): boolean => f.usage_valid_to > nowSecs;
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
        {paymentFailedReason && (
          <Text style={{color: 'red', ...styles.textItem}}>
            {paymentFailedReason}
          </Text>
        )}

        {fareContracts && fareContracts.length ? (
          fareContracts
            .filter((fc) => valid(fc))
            .sort(byExpiry)
            .map((fc, i) => {
              return (
                <View key={i} style={styles.ticketContainer}>
                  <View style={styles.ticketLineContainer}>
                    <Text style={styles.textItem}>
                      {secondsToDuration(Date.now() / 1000 - fc.usage_valid_to)}{' '}
                      - {fc.product_name}
                    </Text>
                    <Expand />
                  </View>
                  <Text style={styles.textItem}>
                    {fc.user_profiles.length > 1
                      ? `${fc.user_profiles.length} Voksne`
                      : `1 Voksen`}
                  </Text>
                  <Text style={styles.textItem}>Sone A</Text>
                  <View style={styles.receiptContainer}>
                    <Text style={styles.textItem}>Ordre-ID: {fc.order_id}</Text>
                    <TouchableOpacity onPress={() => showReceiptModal(fc)}>
                      <Text style={styles.textItem}>Kvittering</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
        ) : (
          <Text style={styles.body}>Du har ingen aktive reiserettigheter</Text>
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
            paymentFailedForReason(undefined);
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
  body: {fontSize: 16, paddingVertical: 24},
  textItem: {fontSize: 16, paddingVertical: 4},
  ticketContainer: {
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    padding: theme.spacings.medium,
  },
  ticketLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
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
