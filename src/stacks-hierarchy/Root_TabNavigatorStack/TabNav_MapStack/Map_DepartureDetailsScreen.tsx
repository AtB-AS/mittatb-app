import {DepartureDetailsScreenComponent} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {MapScreenProps} from './navigation-types';

type Props = MapScreenProps<'Map_DepartureDetailsScreen'>;

export const Map_DepartureDetailsScreen = ({navigation, route}: Props) => {
  const {items, activeItemIndex} = route.params;

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
    />
  );
};
