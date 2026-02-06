import {DepartureDetailsScreenComponent} from '@atb/screen-components/travel-details-screens';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = DashboardScreenProps<'Dashboard_DepartureDetailsScreen'>;

export const Dashboard_DepartureDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {items, activeItemIndex} = route.params;
  const focusRef = useFocusOnLoad(navigation);

  return (
    <DepartureDetailsScreenComponent
      focusRef={focusRef}
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Dashboard_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        navigation.push('Dashboard_PlaceScreen', {
          place: stopPlace,
          selectedQuayId,
        })
      }
      onPressTravelAid={() => {
        navigation.push('Dashboard_TravelAidScreen', {
          serviceJourneyDeparture: items[activeItemIndex],
        });
      }}
    />
  );
};
