import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {TripDetailsScreenComponent} from '@atb/travel-details-screens/TripDetailsScreenComponent';
import {useAnalytics} from '@atb/analytics';

type Props = DashboardScreenProps<'Dashboard_TripDetailsScreen'>;

export const Dashboard_TripDetailsScreen = ({navigation, route}: Props) => {
  const analytics = useAnalytics();

  return (
    <TripDetailsScreenComponent
      {...route.params}
      onPressDetailsMap={(params) => {
        params.vehicleWithPosition
          ? analytics.logEvent('Trip details', 'See live bus clicked', {
              fromPlace: params.fromPlace,
              toPlace: params.toPlace,
            })
          : analytics.logEvent('Trip details', 'Map clicked');
        navigation.navigate('Dashboard_TravelDetailsMapScreen', params);
      }}
      onPressBuyTicket={(params) => {
        analytics.logEvent('Trip details', 'Buy ticket clicked');
        navigation.navigate('Root_PurchaseOverviewScreen', params);
      }}
      onPressQuay={(stopPlace, selectedQuayId) => {
        analytics.logEvent('Trip details', 'Stop place clicked');
        navigation.push('Dashboard_PlaceScreen', {
          place: stopPlace,
          selectedQuayId,
          mode: 'Departure',
        });
      }}
      onPressDeparture={(items, activeItemIndex) => {
        analytics.logEvent('Trip details', 'Departure clicked');
        navigation.navigate('Dashboard_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        });
      }}
    />
  );
};
