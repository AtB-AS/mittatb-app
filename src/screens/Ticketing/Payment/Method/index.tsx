import React from 'react';
import {Text, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../..';
import {reserveFareContracts} from '../../../../api';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentMethod'>;
};

const PaymentMethod: React.FC<Props> = ({navigation}) => (
  <View>
    <Text>Velg betalingsmiddel</Text>
    <TouchableHighlight
      onPress={async () => {
        const response = await reserveFareContracts();
        navigation.push('PaymentCreditCard', response);
      }}
      style={{padding: 10, backgroundColor: 'black'}}
    >
      <Text style={{color: 'white'}}>Betal med bankkort</Text>
    </TouchableHighlight>
    <TouchableHighlight style={{padding: 10, backgroundColor: 'black'}}>
      <Text style={{color: 'white'}}>Betal med Vipps</Text>
    </TouchableHighlight>
  </View>
);

export default PaymentMethod;
