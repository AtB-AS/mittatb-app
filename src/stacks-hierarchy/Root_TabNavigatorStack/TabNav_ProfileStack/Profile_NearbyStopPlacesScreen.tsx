import {
  usePendingLocationSearchStore,
  useOnlySingleLocation,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import React, {useCallback, useEffect} from 'react';
import {ProfileScreenProps} from './navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import SharedTexts from '@atb/translations/shared';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

const RESULT_KEY = 'Profile_NearbyStopPlacesScreen--location';

type Props = ProfileScreenProps<'Profile_NearbyStopPlacesScreen'>;

export const Profile_NearbyStopPlacesScreen = ({navigation, route}: Props) => {
  const fromLocation = useOnlySingleLocation(route, 'location');
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad(navigation);
  const {pendingResult, clearPendingResult} = usePendingLocationSearchStore();

  useEffect(() => {
    if (pendingResult?.key === RESULT_KEY) {
      if (pendingResult.location?.resultType !== 'journey') {
        navigation.setParams({location: pendingResult.location});
      }
      clearPendingResult();
    }
  }, [pendingResult, clearPendingResult, navigation]);

  return (
    <NearbyStopPlacesScreenComponent
      focusRef={focusRef}
      location={fromLocation}
      showFavoriteChips={false}
      headerProps={{
        title: t(FavoriteDeparturesTexts.favoriteItemAdd.label),
        leftButton: {type: 'back'},
      }}
      isLargeTitle={false}
      onPressLocationSearch={(location) => {
        clearPendingResult();
        navigation.navigate('Root_LocationSearchByTextScreen', {
          resultKey: RESULT_KEY,
          label: t(SharedTexts.from),
          initialLocation: location,
          onlyStopPlacesCheckboxInitialState: true,
        });
      }}
      onSelectStopPlace={useCallback(
        (place: StopPlace) => {
          navigation.navigate('Profile_SelectFavouriteDeparturesScreen', {
            stopPlace: place,
            limitPerQuay: 5,
            addedFavoritesVisibleOnDashboard: false,
          });
        },
        [navigation],
      )}
      onUpdateLocation={(location) => navigation.setParams({location})}
      onAddFavoritePlace={() =>
        navigation.navigate('Root_SearchFavoritePlaceScreen')
      }
    />
  );
};
