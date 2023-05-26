import {PlaceScreenComponent} from '@atb/place-screen';
import {ProfileScreenProps} from './navigation-types';

type Props = ProfileScreenProps<'Profile_PlaceScreen'>;

export const Profile_PlaceScreen = ({navigation, route}: Props) => (
  <PlaceScreenComponent
    {...route.params}
    onPressClose={() => navigation.navigate('Profile_FavoriteDeparturesScreen')}
    onPressQuay={(stopPlace, quayId, onlyReplaceParam) =>
      onlyReplaceParam
        ? navigation.setParams({selectedQuayId: quayId})
        : navigation.push('Profile_PlaceScreen', {
            place: stopPlace,
            selectedQuayId: quayId,
            mode: route.params.mode,
          })
    }
  />
);
