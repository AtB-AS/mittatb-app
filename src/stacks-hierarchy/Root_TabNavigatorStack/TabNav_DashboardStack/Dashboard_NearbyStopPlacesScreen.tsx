import React, {useCallback} from 'react';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import SharedTexts from '@atb/translations/shared';
import {useThemeContext} from '@atb/theme';

type Props = DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>;

export const Dashboard_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation<typeof route>('location');
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  return (
    <NearbyStopPlacesScreenComponent
      location={fromLocation}
      mode={route.params.mode}
      headerProps={{
        title: t(FavoriteDeparturesTexts.favoriteItemAdd.label),
        leftButton: {type: 'close'},
        color: theme.color.background.neutral[1],
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
