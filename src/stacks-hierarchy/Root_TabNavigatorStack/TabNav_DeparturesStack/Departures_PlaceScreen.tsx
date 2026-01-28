import {DeparturesStackProps} from './navigation-types';
import {PlaceScreenComponent} from '@atb/screen-components/place-screen';

type Props = DeparturesStackProps<'Departures_PlaceScreen'>;

export const Departures_PlaceScreen = ({navigation, route}: Props) => {
  return (
    <PlaceScreenComponent
      {...route.params}
      onPressQuay={(quayId) => navigation.setParams({selectedQuayId: quayId})}
      onPressDeparture={(items, activeItemIndex) =>
        navigation.push('Departures_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
    />
  );
};
