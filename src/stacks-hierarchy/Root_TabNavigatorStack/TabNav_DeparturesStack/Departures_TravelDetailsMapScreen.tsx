import {TravelDetailsMapScreenComponent} from '@atb/screen-components/travel-details-map-screen';
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
