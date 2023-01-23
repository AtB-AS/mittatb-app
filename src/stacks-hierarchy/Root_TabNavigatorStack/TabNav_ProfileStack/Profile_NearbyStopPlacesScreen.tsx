import {useOnlySingleLocation} from '@atb/location-search';
import React from 'react';
import {Location} from '@atb/favorites/types';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlaces} from '@atb/nearby-stop-places';
import {FullScreenHeader} from '@atb/components/screen-header';
// import {ProfileScreenProps} from '@atb/screens/Profile/types';
import {useRoute} from '@react-navigation/native';

// type NearbyStopPlacesProfileScreenProps =
//   ProfileScreenProps<'NearbyStopPlacesProfileScreen'>;
// type NearbyStopPlacesProfileScreenProps =
//   ProfileScreenProps<'NearbyStopPlacesProfileScreen'>;

// type NearbyStopPlacesPropsInternal =
//   | NearbyStopPlacesProfileScreenProps
//   | NearbyStopPlacesProfileScreenProps;
//
// type NavigationProps = NearbyStopPlacesProfileScreenProps['navigation'] &
//   NearbyStopPlacesProfileScreenProps['navigation'];

type Props = ProfileScreenProps<'Profile_NearbyStopPlacesScreen'>;

export type NearbyStopPlacesScreenParams = {
  location: Location | undefined;
};

// Having issues doing proper typing where the navigation
// gets all overlapping types of routes as this is used from
// several places. For routes and properties this works
// but having to _combine_ everything for navigation to work.
// type RootProps = NearbyStopPlacesPropsInternal & {navigation: NavigationProps};

export const Profile_NearbyStopPlacesScreen = ({navigation}: Props) => {
  const fromLocation = useOnlySingleLocation('location');
  const currentRoute = useRoute();

  const navigateToPlace = (place: StopPlace) => {
    navigation.navigate('Profile_PlaceScreen', {
      place,
      mode: 'Favourite',
    });
  };
  const {t} = useTranslation();

  return (
    <>
      <FullScreenHeader
        title={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
        leftButton={{type: 'close'}}
      />
      <NearbyStopPlaces
        navigation={navigation}
        fromLocation={fromLocation}
        callerRouteName={currentRoute.name}
        onSelect={navigateToPlace}
        mode={'Favourite'}
      />
    </>
  );
};
