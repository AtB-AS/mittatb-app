import {DepartureDetailsScreenComponent} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {NearbyScreenProps} from './navigation-types';

type Props = NearbyScreenProps<'Nearby_DepartureDetailsScreen'>;

export const Nearby_DepartureDetailsScreen = ({navigation, route}: Props) => {
  const {items, activeItemIndex} = route.params;

  return (
    <DepartureDetailsScreenComponent
      items={items}
      activeItemIndex={activeItemIndex}
      onPressDetailsMap={(params) =>
        navigation.navigate('Nearby_TravelDetailsMapScreen', params)
      }
      onPressQuay={(stopPlace) =>
        navigation.navigate('Nearby_QuayDeparturesScreen', {stopPlace})
      }
    />
  );
};
