import {MapScreenProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/travel-aid/TravelAidScreenComponent';

type Props = MapScreenProps<'Map_TravelAidScreen'>;

export const Map_TravelAidScreen = ({navigation, route}: Props) => {
  const {serviceJourney} = route.params;
  return <TravelAidScreenComponent serviceJourney={serviceJourney} />;
};
