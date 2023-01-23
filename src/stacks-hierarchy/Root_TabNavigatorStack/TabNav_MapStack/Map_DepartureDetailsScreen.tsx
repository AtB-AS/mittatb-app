import {DepartureDetailsScreenComponent} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {MapScreenProps} from './navigation-types';
import {useDeparturesV2Enabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';

type Props = MapScreenProps<'Map_DepartureDetailsScreen'>;

export const Map_DepartureDetailsScreen = ({navigation, route}: Props) => {
  const {items, activeItemIndex} = route.params;
  const departuresV2Enabled = useDeparturesV2Enabled();

  return (
    <DepartureDetailsScreenComponent
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Map_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace, selectedQuayId) =>
        departuresV2Enabled
          ? navigation.push('Map_PlaceScreen', {
              place: stopPlace,
              selectedQuayId,
              mode: 'Departure',
            })
          : navigation.push('Map_QuayDeparturesScreen', {stopPlace})
      }
    />
  );
};
