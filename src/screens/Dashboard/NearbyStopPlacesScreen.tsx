import {useOnlySingleLocation} from '@atb/location-search';
import React from 'react';
import {Location} from '@atb/favorites/types';
import {DashboardScreenProps} from '@atb/screens/Dashboard/types';
import {Place} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlaces} from '@atb/screens/Departures/components/NearbyStopPlaces';
import FullScreenHeader from '@atb/components/screen-header/full-header';

export type NearbyStopPlacesScreenParams = {
  location: Location | undefined;
};

type RootProps = DashboardScreenProps<'NearbyStopPlacesScreen'>;

const NearbyStopPlacesScreen = ({navigation, route}: RootProps) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');

  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
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
        callerRouteName={'NearbyStopPlacesScreen'}
        onSelect={navigateToPlace}
        mode={'Favourite'}
      />
    </>
  );
};

export default NearbyStopPlacesScreen;
