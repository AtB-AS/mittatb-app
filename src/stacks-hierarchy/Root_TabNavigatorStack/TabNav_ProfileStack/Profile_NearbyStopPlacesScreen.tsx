import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import React, {useCallback} from 'react';
import {ProfileScreenProps} from './navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import SharedTexts from '@atb/translations/shared';

type Props = ProfileScreenProps<'Profile_NearbyStopPlacesScreen'>;

export const Profile_NearbyStopPlacesScreen = ({navigation, route}: Props) => {
  const fromLocation = useOnlySingleLocation<typeof route>('location');

  const {t} = useTranslation();

  return (
    <NearbyStopPlacesScreenComponent
      location={fromLocation}
      mode={route.params.mode}
      headerProps={{
        title: t(FavoriteDeparturesTexts.favoriteItemAdd.label),
        leftButton: {type: 'close'},
      }}
      onPressLocationSearch={(location) =>
        navigation.navigate('Root_LocationSearchByTextScreen', {
          label: t(SharedTexts.from),
          callerRouteName: route.name,
          callerRouteParam: 'location',
          initialLocation: location,
          onlyStopPlacesCheckboxInitialState: true,
        })
      }
      onSelectStopPlace={useCallback(
        (place: StopPlace) => {
          navigation.navigate('Profile_PlaceScreen', {
            place,
            mode: route.params.mode,
          });
        },
        [navigation, route.params.mode],
      )}
      onUpdateLocation={(location) => navigation.setParams({location})}
      onAddFavoritePlace={() =>
        navigation.navigate('Root_SearchFavoritePlaceScreen')
      }
    />
  );
};
