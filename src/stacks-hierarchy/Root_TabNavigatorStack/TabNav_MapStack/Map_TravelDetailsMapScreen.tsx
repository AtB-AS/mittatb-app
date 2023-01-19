import {TravelDetailsMapScreenComponent} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {MapScreenProps} from './navigation-types';

type Props = MapScreenProps<'Map_TravelDetailsMapScreen'>;

export const Map_TravelDetailsMapScreen = ({navigation, route}: Props) => (
  <TravelDetailsMapScreenComponent
    {...route.params}
    onPressBack={navigation.goBack}
  />
);
