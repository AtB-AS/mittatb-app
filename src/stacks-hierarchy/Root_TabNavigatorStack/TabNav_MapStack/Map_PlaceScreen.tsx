import {PlaceScreenComponent} from '@atb/screen-components/place-screen';
import {MapScreenProps} from './navigation-types';

type Props = MapScreenProps<'Map_PlaceScreen'>;

export const Map_PlaceScreen = ({navigation, route}: Props) => {
  return (
    <PlaceScreenComponent
      {...route.params}
      onPressQuay={(quayId) => navigation.setParams({selectedQuayId: quayId})}
      onPressDeparture={(items, activeItemIndex) =>
        navigation.push('Map_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
    />
  );
};
