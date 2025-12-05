import {PlaceScreenComponent} from '@atb/screen-components/place-screen';
import {ProfileScreenProps} from './navigation-types';
import {useIsFocused} from '@react-navigation/native';

type Props = ProfileScreenProps<'Profile_PlaceScreen'>;

export const Profile_PlaceScreen = ({navigation, route}: Props) => {
  const isFocused = useIsFocused();
  return (
    <PlaceScreenComponent
      {...route.params}
      onPressClose={() => navigation.popTo('Profile_FavoriteDeparturesScreen')}
      onPressQuay={(stopPlace, quayId, onlyReplaceParam) =>
        onlyReplaceParam
          ? navigation.setParams({selectedQuayId: quayId})
          : navigation.push('Profile_PlaceScreen', {
              place: stopPlace,
              selectedQuayId: quayId,
              mode: route.params.mode,
            })
      }
      isFocused={isFocused}
    />
  );
};
