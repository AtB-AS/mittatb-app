import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Add, Remove} from '../../../../assets/svg/icons/actions';
import insets from '../../../../utils/insets';

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
          <TouchableOpacity onPress={increment} hitSlop={insets.all(8)}>
            <View style={styles.iconContainer}>
              <Add />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={decrement} hitSlop={insets.all(8)}>
          <View style={styles.iconContainer}>
            <Remove />
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
