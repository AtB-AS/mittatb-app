import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {PlaceScreenComponent} from '@atb/place-screen';

type Props = DashboardScreenProps<'Dashboard_PlaceScreen'>;

export const Dashboard_PlaceScreen = ({navigation, route}: Props) => (
  <PlaceScreenComponent
    {...route.params}
    onPressQuay={(stopPlace, quayId, onlyReplaceParam) =>
      onlyReplaceParam
        ? navigation.setParams({selectedQuayId: quayId})
        : navigation.push('Dashboard_PlaceScreen', {
            place: stopPlace,
            selectedQuayId: quayId,
            mode: 'Departure',
          })
    }
    onPressDeparture={(items, activeItemIndex) =>
      navigation.navigate('Dashboard_DepartureDetailsScreen', {
        items,
        activeItemIndex,
      })
    }
    onPressClose={() =>
      navigation.navigate('Dashboard_FavoriteDeparturesScreen')
    }
  />
);
