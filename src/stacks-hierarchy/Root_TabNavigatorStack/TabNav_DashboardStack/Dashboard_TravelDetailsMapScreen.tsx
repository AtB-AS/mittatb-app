import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {TravelDetailsMapScreenComponent} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';

type Props = DashboardScreenProps<'Dashboard_TravelDetailsMapScreen'>;

export const Dashboard_TravelDetailsMapScreen = ({
  navigation,
  route,
}: Props) => (
  <TravelDetailsMapScreenComponent
    {...route.params}
    onPressBack={navigation.goBack}
  />
);
