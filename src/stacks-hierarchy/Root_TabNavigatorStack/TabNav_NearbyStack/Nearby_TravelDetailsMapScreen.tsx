import {NearbyScreenProps} from './navigation-types';
import {TravelDetailsMapScreenComponent} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';

type Props = NearbyScreenProps<'Nearby_TravelDetailsMapScreen'>;

export const Nearby_TravelDetailsMapScreen = ({navigation, route}: Props) => (
  <TravelDetailsMapScreenComponent
    {...route.params}
    onPressBack={navigation.goBack}
  />
);
