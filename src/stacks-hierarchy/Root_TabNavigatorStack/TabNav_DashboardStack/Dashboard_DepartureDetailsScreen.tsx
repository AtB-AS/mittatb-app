import {DepartureDetailsScreenComponent} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';

type Props = DashboardScreenProps<'Dashboard_DepartureDetailsScreen'>;

export const Dashboard_DepartureDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {items, activeItemIndex} = route.params;

  return (
    <DepartureDetailsScreenComponent
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Dashboard_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        navigation.push('Dashboard_PlaceScreen', {
          place: stopPlace,
          selectedQuayId,
          mode: 'Departure',
        })
      }
      onPressTravelAid={(serviceJourney) => {
        navigation.push('Dashboard_TravelAidScreen', {
          serviceJourney,
        });
      }}
    />
  );
};
