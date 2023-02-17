import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import React from 'react';
import {ProfileScreenProps} from './navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {
  FavoriteDeparturesTexts,
  NearbyTexts,
  useTranslation,
} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/nearby-stop-places';
import {FullScreenHeader} from '@atb/components/screen-header';

type Props = ProfileScreenProps<'Profile_NearbyStopPlacesScreen'>;

export const Profile_NearbyStopPlacesScreen = ({navigation, route}: Props) => {
  const fromLocation = useOnlySingleLocation('location');

  const {t} = useTranslation();

  return (
    <>
      <FullScreenHeader
        title={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
        leftButton={{type: 'close'}}
      />
      <NearbyStopPlacesScreenComponent
        location={fromLocation}
        mode={route.params.mode}
        onPressLocationSearch={(location) =>
          navigation.navigate('Root_LocationSearchByTextScreen', {
            label: t(NearbyTexts.search.label),
            callerRouteName: route.name,
            callerRouteParam: 'location',
            initialLocation: location,
          })
        }
        onSelectStopPlace={(place: StopPlace) => {
          navigation.navigate('Profile_PlaceScreen', {
            place,
            mode: route.params.mode,
          });
        }}
        onUpdateLocation={(location) => navigation.setParams({location})}
        onAddFavorite={() => navigation.navigate('Root_SearchStopPlaceScreen')}
      />
    </>
  );
};
