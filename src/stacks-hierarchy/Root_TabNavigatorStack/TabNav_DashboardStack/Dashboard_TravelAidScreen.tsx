import {DashboardScreenProps} from './navigation-types';
import {TravelAidScreenComponent} from '@atb/travel-aid/TravelAidScreenComponent';

type Props = DashboardScreenProps<'Dashboard_TravelAidScreen'>;

export const Dashboard_TravelAidScreen = ({navigation, route}: Props) => {
  return (
    <TravelAidScreenComponent
      goBack={navigation.goBack}
      serviceJourneyDeparture={route.params.serviceJourneyDeparture}
    />
  );
};
