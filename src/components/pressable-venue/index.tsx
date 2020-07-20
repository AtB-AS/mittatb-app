import React from 'react';
import {Coordinates} from '@entur/sdk';
import {venueToFeature} from '../../api/geocoder';
import {mapFeatureToLocation} from '../../utils/location';
import {Location} from '../../favorites/types';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  coordinates: Coordinates;
  onPress?(loc: Location): void;
};
const PressableVenue: React.FC<Props> = ({onPress, coordinates, children}) => {
  const onPressInternal = async () => {
    const localityResult = await venueToFeature(coordinates);
    if (!localityResult) return;
    onPress?.(mapFeatureToLocation(localityResult));
  };

  if (!onPress) {
    return <>{children}</>;
  }

  return (
    <TouchableOpacity onPress={onPressInternal}>{children}</TouchableOpacity>
  );
};

export default PressableVenue;
