import {SelectTravelTokenScreenComponent} from '@atb/screen-components/select-travel-token-screen';
import {RootStackScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = RootStackScreenProps<'Root_SelectTravelTokenScreen'>;

export const Root_SelectTravelTokenScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  return (
    <SelectTravelTokenScreenComponent
      onAfterSave={navigation.goBack}
      focusRef={focusRef}
    />
  );
};
