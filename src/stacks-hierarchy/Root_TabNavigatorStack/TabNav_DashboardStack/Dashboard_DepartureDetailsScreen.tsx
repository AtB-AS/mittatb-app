import {DepartureDetailsScreenComponent} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {useDeparturesV2Enabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';

type Props = DashboardScreenProps<'Dashboard_DepartureDetailsScreen'>;

export const Dashboard_DepartureDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {items, activeItemIndex} = route.params;
  const departuresV2Enabled = useDeparturesV2Enabled();

  return (
    <DepartureDetailsScreenComponent
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Dashboard_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        departuresV2Enabled
          ? navigation.push('Dashboard_PlaceScreen', {
              place: stopPlace,
              selectedQuayId,
              mode: 'Departure',
            })
          : navigation.push('Dashboard_QuayDeparturesScreen', {stopPlace})
      }
    />
  );
};
