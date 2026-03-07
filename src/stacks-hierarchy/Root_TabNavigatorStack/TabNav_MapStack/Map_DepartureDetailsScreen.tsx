import {DepartureDetailsScreenComponent} from '@atb/screen-components/travel-details-screens';
import {MapScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = MapScreenProps<'Map_DepartureDetailsScreen'>;

export const Map_DepartureDetailsScreen = ({navigation, route}: Props) => {
  const {items, activeItemIndex} = route.params;
  const activeItem = items[activeItemIndex];
  const focusRef = useFocusOnLoad(navigation);

  return (
    <DepartureDetailsScreenComponent
      focusRef={focusRef}
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Map_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        navigation.push('Map_PlaceScreen', {
          place: stopPlace,
          selectedQuayId,
        })
      }
      onPressTravelAid={() =>
        navigation.push('Map_TravelAidScreen', {
          serviceJourneyDeparture: activeItem,
        })
      }
    />
  );
};
