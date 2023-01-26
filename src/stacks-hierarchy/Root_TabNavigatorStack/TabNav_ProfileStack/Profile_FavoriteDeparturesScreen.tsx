import {ProfileScreenProps} from './navigation-types';
import {FavoriteDeparturesScreenComponent} from '@atb/favorite-departures/FavoriteDeparturesScreenComponent';

type Props = ProfileScreenProps<'Profile_FavoriteDeparturesScreen'>;

export const Profile_FavoriteDeparturesScreen = ({navigation}: Props) => (
  <FavoriteDeparturesScreenComponent
    onPressAddFavorite={() =>
      navigation.navigate('Profile_NearbyStopPlacesScreen', {
        location: undefined,
        mode: 'Favourite',
      })
    }
  />
);
