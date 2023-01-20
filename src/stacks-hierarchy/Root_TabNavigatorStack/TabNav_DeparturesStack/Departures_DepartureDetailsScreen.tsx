import {DepartureDetailsScreenComponent} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {DeparturesStackProps} from './navigation-types';

type Props = DeparturesStackProps<'Departures_DepartureDetailsScreen'>;

export const Departures_DepartureDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {items, activeItemIndex} = route.params;

  return (
    <DepartureDetailsScreenComponent
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Departures_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        navigation.push('Departures_PlaceScreen', {
          place: stopPlace,
          selectedQuayId,
          mode: 'Departure',
        })
      }
    />
  );
};
