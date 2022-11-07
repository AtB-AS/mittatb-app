import {useOnlySingleLocation} from '@atb/location-search';
import React from 'react';
import {Location} from '@atb/favorites/types';
import {DashboardScreenProps} from '@atb/screens/Dashboard/types';
import {Place} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlaces} from '@atb/screens/Departures/components/NearbyStopPlaces';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {ProfileScreenProps} from '@atb/screens/Profile/types';
import {useRoute} from '@react-navigation/native';

type NearbyStopPlacesProfileScreenProps =
  ProfileScreenProps<'NearbyStopPlacesProfileScreen'>;
type NearbyStopPlacesDashboardScreenProps =
  DashboardScreenProps<'NearbyStopPlacesDashboardScreen'>;

type NearbyStopPlacesPropsInternal =
  | NearbyStopPlacesProfileScreenProps
  | NearbyStopPlacesDashboardScreenProps;

type NavigationProps = NearbyStopPlacesProfileScreenProps['navigation'] &
  NearbyStopPlacesDashboardScreenProps['navigation'];

export type NearbyStopPlacesScreenParams = {
    location: Location | undefined;
    onCloseRoute?: string;
};

// Having issues doing proper typing where the navigation
// gets all overlapping types of routes as this is used from
// several places. For routes and properties this works
// but having to _combine_ everything for navigation to work.
type RootProps = NearbyStopPlacesPropsInternal & {navigation: NavigationProps};

const NearbyStopPlacesScreen = ({navigation, route}: RootProps) => {
  const fromLocation = useOnlySingleLocation('location');
  const currentRoute = useRoute();

  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
      mode: 'Favourite',
      onCloseRoute: route?.params?.onCloseRoute,
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

export default NearbyStopPlacesScreen;
