import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';
import {FavoriteDeparturesScreenComponent} from '@atb/screen-components/favorite-departures';

type Props = ProfileScreenProps<'Profile_FavoriteDeparturesScreen'>;

export const Profile_FavoriteDeparturesScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);

  return (
    <FavoriteDeparturesScreenComponent
      focusRef={focusRef}
      onPressAddFavorite={() =>
        navigation.navigate('Profile_NearbyStopPlacesScreen', {
          location: undefined,
          mode: 'Favourite',
        })
      }
    />
  );
};
