import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import React, {useCallback} from 'react';
import {ProfileScreenProps} from './navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import SharedTexts from '@atb/translations/shared';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = ProfileScreenProps<'Profile_NearbyStopPlacesScreen'>;

export const Profile_NearbyStopPlacesScreen = ({navigation, route}: Props) => {
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
        leftButton: {type: 'back'},
      }}
      isLargeTitle={false}
      onPressLocationSearch={(location) =>
        navigation.navigate('Root_LocationSearchByTextScreen', {
          label: t(SharedTexts.from),
          callerRouteConfig: {
            route: [
              'Root_TabNavigatorStack',
              {
                screen: 'TabNav_ProfileStack',
                params: {
                  screen: 'Profile_NearbyStopPlacesScreen',
                  params: {
                    location: route.params.location,
                    mode: route.params.mode,
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
          navigation.navigate('Profile_SelectFavouriteDeparturesScreen', {
            place,
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
