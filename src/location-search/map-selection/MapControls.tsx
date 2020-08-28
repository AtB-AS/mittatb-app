import React from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import colors from '../../theme/colors';
import {Add, Remove} from '../../assets/svg/icons/actions';
import {StyleSheet} from '../../theme';
import shadows from './shadows';

export type Props = {
  flyToCurrentLocation(): void;
  zoomIn(): void;
  zoomOut(): void;
};

const MapControls: React.FC<Props> = ({
  flyToCurrentLocation,
  zoomIn,
  zoomOut,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={flyToCurrentLocation}>
        <View style={styles.flyToButton}>
          <CurrentLocationArrow />
        </View>
      </TouchableOpacity>
      <View style={styles.zoomContainer}>
        <TouchableOpacity onPress={zoomIn}>
          <View style={styles.zoomInButton}>
            <Add />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut}>
          <View style={styles.zoomOutButton}>
            <Remove />
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
  zoomContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    ...shadows,
  },
  zoomInButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomOutButton: {
    width: 36,
    height: 36,
    borderTopColor: colors.general.gray200,
    borderTopWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MapControls;
