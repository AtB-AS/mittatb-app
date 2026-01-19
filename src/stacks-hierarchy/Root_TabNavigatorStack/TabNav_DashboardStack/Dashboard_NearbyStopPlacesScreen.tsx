import React, {useCallback} from 'react';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import SharedTexts from '@atb/translations/shared';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>;

export const Dashboard_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation(route, 'location');
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad(navigation);

  return (
    <NearbyStopPlacesScreenComponent
      focusRef={focusRef}
      location={fromLocation}
      mode={route.params.mode}
      headerProps={{
        title: t(FavoriteDeparturesTexts.favoriteItemAdd.label),
        rightButton: {type: 'close'},
      }}
      isLargeTitle={false}
      onPressLocationSearch={(location) =>
        navigation.navigate('Root_LocationSearchByTextScreen', {
          label: t(SharedTexts.from),
          callerRouteConfig: {
            route: [
              'Root_TabNavigatorStack',
              {
                screen: 'TabNav_DashboardStack',
                params: {
                  screen: 'Dashboard_NearbyStopPlacesScreen',
                  params: {
                    location: route.params.location,
                    mode: route.params.mode,
                    onCloseRoute: route.params.onCloseRoute,
                  },
                  merge: true,
                },
              },
            ],
            locationRouteParam: 'location',
          },
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
      onAddFavoritePlace={() =>
        navigation.navigate('Root_SearchFavoritePlaceScreen')
      }
    />
  );
};
