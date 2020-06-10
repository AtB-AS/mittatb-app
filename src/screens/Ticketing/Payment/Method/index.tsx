import React, {useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../..';
import {reserveOffers} from '../../../../api';
import ArrowRight from '../../../../assets/svg/ArrowRight';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentMethod'>;
  route: RouteProp<TicketingStackParams, 'PaymentMethod'>;
};

const PaymentMethod: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {offers} = route.params;

  const onCreditCard = async () => {
    setIsLoading(true);
    try {
      const response = await reserveOffers(offers);
      navigation.push('PaymentCreditCard', response);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <>
          <Text style={styles.heading}>Velg betalingsmiddel</Text>
          <TouchableHighlight onPress={onCreditCard} style={styles.button}>
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
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

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
