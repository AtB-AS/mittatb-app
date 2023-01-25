import {ProfileScreenProps} from './navigation-types';
import {SelectTravelTokenScreenComponent} from '@atb/select-travel-token-screen';

type Props = ProfileScreenProps<'Profile_SelectTravelTokenScreen'>;

export const Profile_SelectTravelTokenScreen = ({navigation}: Props) => (
  <SelectTravelTokenScreenComponent onAfterSave={navigation.goBack} />
);
