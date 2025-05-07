import {DepartureDetailsScreenComponent} from '@atb/screen-components/travel-details-screens';
import {DeparturesStackProps} from './navigation-types';

type Props = DeparturesStackProps<'Departures_DepartureDetailsScreen'>;

export const Departures_DepartureDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {items, activeItemIndex} = route.params;
  const activeItem = items[activeItemIndex];

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
      onPressTravelAid={() =>
        navigation.push('Departures_TravelAidScreen', {
          serviceJourneyDeparture: activeItem,
        })
      }
    />
  );
};
