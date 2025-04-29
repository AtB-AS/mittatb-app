import {FavoriteDeparturesScreenComponent} from '@atb/screen-components/favorite-departures/FavoriteDeparturesScreenComponent';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';

type Props = DashboardScreenProps<'Dashboard_FavoriteDeparturesScreen'>;

export const Dashboard_FavoriteDeparturesScreen = ({
  navigation,
  route,
}: Props) => (
  <FavoriteDeparturesScreenComponent
    onPressAddFavorite={() =>
      navigation.navigate('Dashboard_NearbyStopPlacesScreen', {
        location: undefined,
        mode: 'Favourite',
        onCloseRoute: route.name,
      })
    }
  />
);
