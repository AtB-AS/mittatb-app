import {StopPlace} from '@atb/api/types/departures';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {DeparturesStackProps} from './navigation-types';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import SharedTexts from '@atb/translations/shared';
import {useThemeContext} from '@atb/theme';

type Props = DeparturesStackProps<'Departures_NearbyStopPlacesScreen'>;

export const Departures_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation(route, 'location');
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  return (
    <NearbyStopPlacesScreenComponent
      location={fromLocation}
      mode={route.params.mode}
      headerProps={{
        title: t(DeparturesTexts.header.title),
        globalMessageContext: GlobalMessageContextEnum.appDepartures,
        color: theme.color.background.neutral[1],
      }}
      isLargeTitle={true}
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
          navigation.navigate('Departures_PlaceScreen', {
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
