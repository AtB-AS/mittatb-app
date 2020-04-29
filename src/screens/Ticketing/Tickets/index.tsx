import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {nb} from 'date-fns/locale';
import {TicketingStackParams} from '../';
import {FareContract} from '../../../api/fareContracts';
import {listFareContracts} from '../../../api';
import {secondsToDuration} from '../../../utils/date';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Tickets'>;
  route: RouteProp<TicketingStackParams, 'Tickets'>;
};

const Tickets: React.FC<Props> = ({navigation, route}) => {
  const hasPurchased = route?.params?.hasPurchased;
  const [fareContracts, setFareContracts] = useState<
    FareContract[] | undefined
  >(undefined);

  useEffect(() => {
    async function getFareContracts() {
      const response = await listFareContracts();
      setFareContracts(response.fare_contracts);
    }

    if (hasPurchased) {
      getFareContracts();
    }
  }, []);

  return (
    <View>
      <Text>Reiserettigheter</Text>
      {fareContracts ? (
        fareContracts.map((fc, i) => (
          <View key={i}>
            <Text>
              {secondsToDuration(fc.duration, nb, false)} - {fc.product_name}
            </Text>
            <Text>1 voksen</Text>
            <Text>Sone 1</Text>
          </View>
        ))
      ) : (
        <Text>Du har ingen aktive reiserettigheter</Text>
      )}
      <TouchableHighlight
        onPress={() => navigation.push('Offer')}
        style={{padding: 10, backgroundColor: 'black'}}
      >
        <Text style={{color: 'white'}}>Kjøp reiserett</Text>
      </TouchableHighlight>
    </View>
  );
};

export default Tickets;
