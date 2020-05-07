import React from 'react';
import {View, Text, StyleSheet, RefreshControl} from 'react-native';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {nb} from 'date-fns/locale';
import {TicketingStackParams} from '../';
import {secondsToDuration} from '../../../utils/date';
import ArrowRight from '../../../assets/svg/ArrowRight';
import ChevronDownIcon from '../../../assets/svg/ChevronDownIcon';
import {useTicketState} from '../TicketContext';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Tickets'>;
};

const Tickets: React.FC<Props> = ({navigation}) => {
  const {fareContracts, isRefreshingTickets, refreshTickets} = useTicketState();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingTickets}
          onRefresh={refreshTickets}
        />
      }
    >
      <Text style={styles.heading}>Reiserettigheter</Text>
      {fareContracts && fareContracts.length ? (
        fareContracts.map((fc, i) => (
          <View key={i} style={styles.ticketContainer}>
            <View style={styles.ticketLineContainer}>
              <Text style={styles.textItem}>
                {secondsToDuration(fc.duration, nb)} - {fc.product_name}
              </Text>
              <ChevronDownIcon />
            </View>
            <Text style={styles.textItem}>1 voksen</Text>
            <Text style={styles.textItem}>Sone A</Text>
          </View>
        ))
      ) : (
        <Text style={styles.body}>Du har ingen aktive reiserettigheter</Text>
      )}
      <TouchableHighlight
        onPress={() => navigation.push('Offer')}
        style={styles.button}
      >
        <View style={styles.buttonContentContainer}>
          <Text style={styles.buttonText}>Kjøp reiserett</Text>
          <ArrowRight fill="white" width={14} height={14} />
        </View>
      </TouchableHighlight>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {fontSize: 16, paddingVertical: 24},
  button: {padding: 12, backgroundColor: 'black'},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  container: {padding: 24, backgroundColor: 'white', flex: 1},
  heading: {fontSize: 26, color: 'black', letterSpacing: 0.35},
  textItem: {fontSize: 16, paddingVertical: 4},
  ticketContainer: {
    marginVertical: 12,
    padding: 8,
    borderColor: 'black',
    borderWidth: 1,
  },
  ticketLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
});

export default Tickets;
