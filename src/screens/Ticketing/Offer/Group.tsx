import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PlusIcon from '../../../assets/svg/PlusIcon';
import MinusIcon from '../../../assets/svg/MinusIcon';
import insets from '../../../utils/insets';
import {OfferPrice} from '../../../api/fareContracts';

type Props = {
  name: string;
  price: number;
  count: number;
  increment(): void;
  decrement(): void;
};

const Offer: React.FC<Props> = ({name, price, count, increment, decrement}) => {
  return (
    <View style={[styles.borderedTextContainer, styles.blackBorder]}>
      <Text style={styles.text}>
        {count} {name} - {count * price} kr
      </Text>
      <View style={styles.iconsContainerJustifiedRight}>
        <View style={styles.iconContainerWithPadding}>
          <TouchableOpacity onPress={decrement} hitSlop={insets.all(8)}>
            <View style={styles.iconContainer}>
              <MinusIcon />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={increment} hitSlop={insets.all(8)}>
          <View style={styles.iconContainer}>
            <PlusIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  iconsContainerJustifiedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainerWithPadding: {
    paddingRight: 20,
  },
  iconContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 16},
});

export default Offer;
