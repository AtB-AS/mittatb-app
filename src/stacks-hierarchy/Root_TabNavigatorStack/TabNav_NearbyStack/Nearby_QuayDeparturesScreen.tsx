import {QuayDeparturesScreenComponent} from '@atb/quay-departures-screen';
import {NearbyScreenProps} from './navigation-types';

type Props = NearbyScreenProps<'Nearby_QuayDeparturesScreen'>;

export const Nearby_QuayDeparturesScreen = ({navigation, route}: Props) => (
  <QuayDeparturesScreenComponent
    {...route.params}
    onPressDeparture={(items, activeItemIndex) =>
      navigation.navigate('Nearby_DepartureDetailsScreen', {
        items,
        activeItemIndex,
      })
    }
  />
);
