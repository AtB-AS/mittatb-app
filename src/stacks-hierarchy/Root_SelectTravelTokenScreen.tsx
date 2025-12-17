import {SelectTravelTokenScreenComponent} from '@atb/screen-components/select-travel-token-screen';
import {RootStackScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useIsFocused} from '@react-navigation/native';

type Props = RootStackScreenProps<'Root_SelectTravelTokenScreen'>;

export const Root_SelectTravelTokenScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const isFocused = useIsFocused();
  return (
    <SelectTravelTokenScreenComponent
      onAfterSave={navigation.goBack}
      focusRef={focusRef}
      isFocused={isFocused}
    />
  );
};
