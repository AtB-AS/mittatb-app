import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import {StyleSheet} from '../../theme';
import shadows from './shadows';

const PositionArrow: React.FC<{flyToCurrentLocation(): void}> = ({
  flyToCurrentLocation,
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel="Min posisjon"
      accessibilityRole="button"
      onPress={flyToCurrentLocation}
    >
      <View style={styles.flyToButton}>
        <CurrentLocationArrow />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  flyToButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 36,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...shadows,
  },
});
export default PositionArrow;
