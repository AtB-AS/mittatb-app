import {PlaceScreenComponent} from '@atb/screen-components/place-screen';
import {MapScreenProps} from './navigation-types';

type Props = MapScreenProps<'Map_PlaceScreen'>;

export const Map_PlaceScreen = ({navigation, route}: Props) => {
  return (
    <PlaceScreenComponent
      {...route.params}
      onPressQuay={(stopPlace, quayId, onlyReplaceParam) =>
        onlyReplaceParam
          ? navigation.setParams({selectedQuayId: quayId})
          : navigation.push('Map_PlaceScreen', {
              place: stopPlace,
              selectedQuayId: quayId,
              mode: route.params.mode,
            })
      }
      onPressDeparture={(items, activeItemIndex) =>
        navigation.push('Map_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
    />
  );
};
