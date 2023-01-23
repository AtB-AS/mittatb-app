import {QuayDeparturesScreenComponent} from '@atb/quay-departures-screen';
import {MapScreenProps} from './navigation-types';

type Props = MapScreenProps<'Map_QuayDeparturesScreen'>;

export const Map_QuayDeparturesScreen = ({navigation, route}: Props) => (
  <QuayDeparturesScreenComponent
    {...route.params}
    onPressDeparture={(items, activeItemIndex) =>
      navigation.navigate('Map_DepartureDetailsScreen', {
        items,
        activeItemIndex,
      })
    }
  />
);
