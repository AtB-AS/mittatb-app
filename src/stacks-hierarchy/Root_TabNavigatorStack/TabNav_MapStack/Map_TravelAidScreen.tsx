import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {MapScreenProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/screen-components/travel-aid';

type Props = MapScreenProps<'Map_TravelAidScreen'>;

export const Map_TravelAidScreen = ({navigation, route}: Props) => {
  const focusRef = useFocusOnLoad(navigation);

  return (
    <TravelAidScreenComponent
      goBack={navigation.goBack}
      serviceJourneyDeparture={route.params.serviceJourneyDeparture}
      focusRef={focusRef}
    />
  );
};
