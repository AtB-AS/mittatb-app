import {MapScreenProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/travel-aid/TravelAidScreenComponent';

type Props = MapScreenProps<'Map_TravelAidScreen'>;

export const Map_TravelAidScreen = ({navigation, route}: Props) => {
  return (
    <TravelAidScreenComponent
      goBack={navigation.goBack}
      serviceJourneyDeparture={route.params.serviceJourneyDeparture}
    />
  );
};
