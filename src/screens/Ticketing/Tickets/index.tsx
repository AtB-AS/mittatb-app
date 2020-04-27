import React from 'react';
import {View, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Tickets'>;
};

const Tickets: React.FC<Props> = ({navigation}) => (
  <View>
    <Text>Reiserettigheter</Text>
    <Text>Du har ingen aktive reiserettigheter</Text>
    <TouchableHighlight
      onPress={() => navigation.push('Offer')}
      style={{padding: 10, backgroundColor: 'black'}}
    >
      <Text style={{color: 'white'}}>Kjøp reiserett</Text>
    </TouchableHighlight>
  </View>
);

export default Tickets;
