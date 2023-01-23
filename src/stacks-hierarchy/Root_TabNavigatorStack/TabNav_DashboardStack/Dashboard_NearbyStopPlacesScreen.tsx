import {useOnlySingleLocation} from '@atb/location-search';
import React from 'react';
import {Location} from '@atb/favorites/types';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlaces} from '@atb/nearby-stop-places';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useRoute} from '@react-navigation/native';

type Props = DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>;

export type NearbyStopPlacesScreenParams = {
  location: Location | undefined;
  onCloseRoute?: string;
};

const Dashboard_NearbyStopPlacesScreen = ({navigation}: Props) => {
  const fromLocation = useOnlySingleLocation('location');
  const currentRoute = useRoute();

  const navigateToPlace = (place: StopPlace) => {
    navigation.navigate('Dashboard_PlaceScreen', {
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

export default Dashboard_NearbyStopPlacesScreen;
