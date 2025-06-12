import {StopPlace} from '@atb/api/types/departures';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {DeparturesTexts, NearbyTexts, useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {DeparturesStackProps} from './navigation-types';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';

type Props = DeparturesStackProps<'Departures_NearbyStopPlacesScreen'>;

export const Departures_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation<typeof route>('location');
  const {t} = useTranslation();

  return (
    <NearbyStopPlacesScreenComponent
      location={fromLocation}
      mode={route.params.mode}
      headerProps={{
        title: t(DeparturesTexts.header.title),
        rightButton: {type: 'chat'},
        leftButton: {type: 'status-disruption'},
        globalMessageContext: GlobalMessageContextEnum.appDepartures,
      }}
      onPressLocationSearch={(location) =>
        navigation.navigate('Root_LocationSearchByTextScreen', {
          label: t(SharedTexts),
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
