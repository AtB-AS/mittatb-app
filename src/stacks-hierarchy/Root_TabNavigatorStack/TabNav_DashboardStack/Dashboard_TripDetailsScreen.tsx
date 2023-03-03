import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {TripDetailsScreenComponent} from '@atb/travel-details-screens/TripDetailsScreenComponent';
import {useDeparturesV2Enabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';

type Props = DashboardScreenProps<'Dashboard_TripDetailsScreen'>;

export const Dashboard_TripDetailsScreen = ({navigation, route}: Props) => {
  const departuresV2Enabled = useDeparturesV2Enabled();
  return (
    <TripDetailsScreenComponent
      {...route.params}
      onPressDetailsMap={(params) =>
        navigation.navigate('Dashboard_TravelDetailsMapScreen', params)
      }
      onPressBuyTicket={(params) =>
        navigation.navigate('Root_PurchaseOverviewScreen', params)
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
      onPressDeparture={(items, activeItemIndex) =>
        navigation.navigate('Dashboard_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
    />
  );
};
