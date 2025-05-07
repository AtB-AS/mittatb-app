import {SelectTravelTokenScreenComponent} from '@atb/screen-components/select-travel-token-screen';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_SelectTravelTokenScreen'>;

export const Root_SelectTravelTokenScreen = ({navigation}: Props) => (
  <SelectTravelTokenScreenComponent onAfterSave={navigation.goBack} />
);
