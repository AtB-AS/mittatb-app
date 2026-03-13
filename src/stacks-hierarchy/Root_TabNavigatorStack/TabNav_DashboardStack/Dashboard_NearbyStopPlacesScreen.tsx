import React, {useCallback, useEffect} from 'react';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {
  usePendingLocationSearchStore,
  useOnlySingleLocation,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import SharedTexts from '@atb/translations/shared';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

const RESULT_KEY = 'Dashboard_NearbyStopPlacesScreen--location';

type Props = DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>;

export const Dashboard_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
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
        (stopPlace: StopPlace) => {
          navigation.navigate('Dashboard_SelectFavoriteDeparturesScreen', {
            stopPlace,
            addedFavoritesVisibleOnDashboard: true,
            limitPerQuay: 5,
            onCompleteRouteName: route.params.onCompleteRouteName,
          });
        },
        [navigation, route.params.onCompleteRouteName],
      )}
      onUpdateLocation={(location) => navigation.setParams({location})}
      onAddFavoritePlace={() =>
        navigation.navigate('Root_SearchFavoritePlaceScreen')
      }
    />
  );
};
