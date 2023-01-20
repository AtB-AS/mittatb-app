import {TravelDetailsMapScreenComponent} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {DeparturesStackProps} from './navigation-types';

type Props = DeparturesStackProps<'Departures_TravelDetailsMapScreen'>;

export const Departures_TravelDetailsMapScreen = ({
  navigation,
  route,
}: Props) => (
  <TravelDetailsMapScreenComponent
    {...route.params}
    onPressBack={navigation.goBack}
  />
);
