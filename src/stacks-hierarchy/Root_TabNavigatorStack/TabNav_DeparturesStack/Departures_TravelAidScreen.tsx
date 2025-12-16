import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {DeparturesStackProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/screen-components/travel-aid';

type Props = DeparturesStackProps<'Departures_TravelAidScreen'>;

export const Departures_TravelAidScreen = ({navigation, route}: Props) => {
  const focusRef = useFocusOnLoad(navigation);

  return (
    <TravelAidScreenComponent
      goBack={navigation.goBack}
      serviceJourneyDeparture={route.params.serviceJourneyDeparture}
      focusRef={focusRef}
    />
  );
};
