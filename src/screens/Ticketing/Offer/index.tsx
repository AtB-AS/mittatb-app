import React from 'react';
import {Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {TicketingStackParams} from '../';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Offer'>;
};

const Offer: React.FC<Props> = ({navigation}) => (
  <View>
    <Text>Kjøp reise</Text>
    <Text>Bussreise</Text>
    <Text>Sone A - Stor Trondheim</Text>
    <Text>1 voksen - 40 kr</Text>
    <Text>Total 40 kr</Text>
    <TouchableHighlight
      onPress={() => navigation.push('PaymentMethod')}
      style={{padding: 10, backgroundColor: 'black'}}
    >
      <Text style={{color: 'white'}}>Velg betalingsmiddel</Text>
    </TouchableHighlight>
  </View>
);

export default Offer;
