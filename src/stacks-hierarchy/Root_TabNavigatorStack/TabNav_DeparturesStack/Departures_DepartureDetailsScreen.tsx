import {DepartureDetailsScreenComponent} from '@atb/screen-components/travel-details-screens';
import {DeparturesStackProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = DeparturesStackProps<'Departures_DepartureDetailsScreen'>;

export const Departures_DepartureDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {items, activeItemIndex} = route.params;
  const activeItem = items[activeItemIndex];
  const focusRef = useFocusOnLoad(navigation);

  return (
    <DepartureDetailsScreenComponent
      focusRef={focusRef}
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
