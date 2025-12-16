import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {DashboardScreenProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/screen-components/travel-aid';

type Props = DashboardScreenProps<'Dashboard_TravelAidScreen'>;

export const Dashboard_TravelAidScreen = ({navigation, route}: Props) => {
  const focusRef = useFocusOnLoad(navigation);

  return (
    <TravelAidScreenComponent
      goBack={navigation.goBack}
      serviceJourneyDeparture={route.params.serviceJourneyDeparture}
      focusRef={focusRef}
    />
  );
};
