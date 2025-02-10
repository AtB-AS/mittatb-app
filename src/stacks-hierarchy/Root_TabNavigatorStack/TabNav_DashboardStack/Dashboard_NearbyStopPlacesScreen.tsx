import React, {useCallback} from 'react';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {
  FavoriteDeparturesTexts,
  NearbyTexts,
  useTranslation,
} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/nearby-stop-places';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';

type Props = DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>;

export const Dashboard_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation('location');
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
          label: t(NearbyTexts.search.label),
          callerRouteName: route.name,
          callerRouteParam: 'location',
          initialLocation: location,
          onlyStopPlacesCheckboxInitialState: true,
        })
      }
      onSelectStopPlace={useCallback(
        (place: StopPlace) => {
          navigation.navigate('Dashboard_PlaceScreen', {
            place,
            mode: route.params.mode,
            onCloseRoute: route.params.onCloseRoute,
          });
        },
        [navigation, route.params.mode, route.params.onCloseRoute],
      )}
      onUpdateLocation={(location) => navigation.setParams({location})}
      onAddFavorite={() => navigation.navigate('Root_SearchStopPlaceScreen')}
    />
  );
};
