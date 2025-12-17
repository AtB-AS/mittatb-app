import {DeparturesStackProps} from './navigation-types';
import {PlaceScreenComponent} from '@atb/screen-components/place-screen';

type Props = DeparturesStackProps<'Departures_PlaceScreen'>;

export const Departures_PlaceScreen = ({navigation, route}: Props) => {
  return (
    <PlaceScreenComponent
      {...route.params}
      onPressQuay={(stopPlace, quayId, onlyReplaceParam) =>
        onlyReplaceParam
          ? navigation.setParams({selectedQuayId: quayId})
          : navigation.push('Departures_PlaceScreen', {
              place: stopPlace,
              selectedQuayId: quayId,
              mode: route.params.mode,
            })
      }
      onPressDeparture={(items, activeItemIndex) =>
        navigation.push('Departures_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
    />
  );
};
