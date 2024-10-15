import {DeparturesStackProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/travel-aid/TravelAidScreenComponent';

type Props = DeparturesStackProps<'Departures_TravelAidScreen'>;

export const Departures_TravelAidScreen = ({navigation, route}: Props) => {
  const {serviceJourney} = route.params;
  return <TravelAidScreenComponent serviceJourney={serviceJourney} />;
};
