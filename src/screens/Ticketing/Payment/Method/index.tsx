import React, {useState} from 'react';
import {ActivityIndicator, Linking, StyleSheet, Text, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../..';
import {reserveOffers} from '../../../../api';
import {ArrowRight} from '../../../../assets/svg/icons/navigation';
import {PaymentType} from '../../../../api/fareContracts';
import {AxiosError} from 'axios';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentMethod'>;
  route: RouteProp<TicketingStackParams, 'PaymentMethod'>;
};

const PaymentMethod: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {offers} = route.params;

  const handlePress = async (paymentType: PaymentType) => {
    setIsLoading(true);
    try {
      const response = await reserveOffers(offers, paymentType);
      switch (paymentType) {
        case PaymentType.CreditCard:
          navigation.push('PaymentCreditCard', response);
          break;
        case PaymentType.Vipps:
          if (await Linking.canOpenURL(response.url)) {
            Linking.openURL(response.url);
          }
          break;
      }
    } catch (err) {
      console.warn(err.response);
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
          <TouchableHighlight
            onPress={() => handlePress(PaymentType.CreditCard)}
            style={styles.button}
          >
            <View style={styles.buttonContentContainer}>
              <Text style={styles.buttonText}>Betal med bankkort</Text>
              <ArrowRight fill="white" width={14} height={14} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => handlePress(PaymentType.Vipps)}
            style={styles.button}
          >
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
