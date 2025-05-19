import {DepartureDetailsScreenComponent} from '@atb/screen-components/travel-details-screens';
import {MapScreenProps} from './navigation-types';

type Props = MapScreenProps<'Map_DepartureDetailsScreen'>;

export const Map_DepartureDetailsScreen = ({navigation, route}: Props) => {
  const {items, activeItemIndex} = route.params;
  const activeItem = items[activeItemIndex];

  return (
    <DepartureDetailsScreenComponent
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Map_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        navigation.push('Map_PlaceScreen', {
          place: stopPlace,
          selectedQuayId,
          mode: 'Departure',
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
