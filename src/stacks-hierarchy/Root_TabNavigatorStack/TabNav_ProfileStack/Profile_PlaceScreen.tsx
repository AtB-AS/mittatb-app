import {PlaceScreenComponent} from '@atb/place-screen';
import {ProfileScreenProps} from './navigation-types';

type Props = ProfileScreenProps<'Profile_PlaceScreen'>;

export const Profile_PlaceScreen = ({navigation, route}: Props) => (
  <PlaceScreenComponent
    {...route.params}
    onPressClose={() => navigation.navigate('Profile_FavoriteDeparturesScreen')}
  />
);
