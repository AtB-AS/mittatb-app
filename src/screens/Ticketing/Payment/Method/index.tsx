import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../..';
import {reserveFareContracts} from '../../../../api';
import ArrowRight from '../../../../assets/svg/ArrowRight';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentMethod'>;
};

const PaymentMethod: React.FC<Props> = ({navigation}) => (
  <View style={styles.container}>
    <Text style={styles.heading}>Velg betalingsmiddel</Text>
    <TouchableHighlight
      onPress={async () => {
        const response = await reserveFareContracts();
        navigation.push('PaymentCreditCard', response);
      }}
      style={styles.button}
    >
      <View style={styles.buttonContentContainer}>
        <Text style={styles.buttonText}>Betal med bankkort</Text>
        <ArrowRight fill="white" width={14} height={14} />
      </View>
    </TouchableHighlight>
    <TouchableHighlight style={styles.button}>
      <View style={styles.buttonContentContainer}>
        <Text style={styles.buttonText}>Betal med Vipps</Text>
        <ArrowRight fill="white" width={14} height={14} />
      </View>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  button: {padding: 12, marginTop: 10, backgroundColor: 'black'},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  container: {padding: 24, backgroundColor: 'white', flex: 1},
  heading: {fontSize: 26, color: 'black', letterSpacing: 0.35},
});

export default PaymentMethod;
