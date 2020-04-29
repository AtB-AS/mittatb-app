import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {TicketingStackParams} from '../';
import ArrowRight from '../../../assets/svg/ArrowRight';
import ChevronDownIcon from '../../../assets/svg/ChevronDownIcon';
import PlusIcon from '../../../assets/svg/PlusIcon';
import MinusIcon from '../../../assets/svg/MinusIcon';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Offer'>;
};

const Offer: React.FC<Props> = ({navigation}) => (
  <View style={styles.container}>
    <Text style={styles.heading}>Kjøp reise</Text>
    <View style={[styles.borderedTextContainer, styles.grayBorder]}>
      <Text style={styles.text}>Bussreise</Text>
      <ChevronDownIcon opacity="0.2" />
    </View>
    <View style={[styles.borderedTextContainer, styles.grayBorder]}>
      <Text style={styles.text}>Sone A - Stor Trondheim</Text>
      <ChevronDownIcon opacity="0.2" />
    </View>
    <View style={[styles.borderedTextContainer, styles.blackBorder]}>
      <Text style={styles.text}>1 voksen - 40 kr</Text>
      <View style={styles.iconsContainerJustifiedRight}>
        <View style={styles.iconContainerWithPadding}>
          <MinusIcon />
        </View>
        <PlusIcon />
      </View>
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.textWithPadding}>Total</Text>
      <Text style={styles.textWithPadding}>40,00 kr</Text>
    </View>
    <TouchableHighlight
      onPress={() => navigation.push('PaymentMethod')}
      style={styles.button}
    >
      <View style={styles.buttonContentContainer}>
        <Text style={styles.buttonText}>Velg betalingsmiddel</Text>
        <ArrowRight fill="white" width={14} height={14} />
      </View>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  blackBorder: {
    borderColor: 'black',
  },
  borderedTextContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginRight: 3,
    padding: 12,
  },
  button: {padding: 12, backgroundColor: 'black'},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  container: {padding: 24, backgroundColor: 'white', flex: 1},
  grayBorder: {
    borderColor: '#cccccc',
  },
  heading: {
    fontSize: 26,
    color: 'black',
    letterSpacing: 0.35,
    paddingBottom: 12,
  },
  iconsContainerJustifiedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainerWithPadding: {
    paddingRight: 20,
  },
  text: {fontSize: 16},
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  textWithPadding: {fontSize: 16, paddingVertical: 24},
});

export default Offer;
