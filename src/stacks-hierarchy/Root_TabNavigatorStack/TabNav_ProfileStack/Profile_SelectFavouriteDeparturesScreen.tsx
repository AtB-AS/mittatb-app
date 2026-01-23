import {Quay} from '@atb/api/types/departures';
import {ProfileScreenProps} from './navigation-types';
import {SelectFavoriteDeparturesScreenComponent} from '@atb/screen-components/favorite-departures';

type Props = ProfileScreenProps<'Profile_SelectFavouriteDeparturesScreen'>;

export const Profile_SelectFavouriteDeparturesScreen = ({
  navigation,
  route,
}: Props) => {
  return (
    <SelectFavoriteDeparturesScreenComponent
      {...route.params}
      addedFavoritesVisibleOnDashboard={false}
      onPressClose={() => navigation.popTo('Profile_FavoriteDeparturesScreen')}
      onNavigateToQuay={(selectedQuay: Quay) =>
        navigation.push('Profile_SelectFavouriteDeparturesScreen', {
          place: route.params.place,
          selectedQuay,
          limitPerQuay: 1000,
          addedFavoritesVisibleOnDashboard: true,
        })
      }
    />
  );
};
