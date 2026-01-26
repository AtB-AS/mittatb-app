import {FavoriteDeparturesScreenComponent} from '@atb/screen-components/favorite-departures';
import {LocationSearchCallerRoute} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = DashboardScreenProps<'Dashboard_FavoriteDeparturesScreen'>;
const callerRoute: LocationSearchCallerRoute = [
  'Root_TabNavigatorStack',
  {
    screen: 'TabNav_DashboardStack',
    params: {
      screen: 'Dashboard_FavoriteDeparturesScreen',
    },
  },
];

export const Dashboard_FavoriteDeparturesScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);

  return (
    <FavoriteDeparturesScreenComponent
      focusRef={focusRef}
      onPressAddFavorite={() =>
        navigation.navigate('Dashboard_NearbyStopPlacesScreen', {
          location: undefined,
          onCloseRoute: callerRoute,
        })
      }
    />
  );
};
