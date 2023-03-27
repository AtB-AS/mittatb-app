import {StopPlace} from '@atb/api/types/departures';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {NearbyTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React from 'react';
import {DeparturesStackProps} from './navigation-types';
import {NearbyStopPlacesScreenComponent} from '@atb/nearby-stop-places';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {FullScreenHeader} from '@atb/components/screen-header';

type Props = DeparturesStackProps<'Departures_NearbyStopPlacesScreen'>;

export const Departures_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation('location');
  const {t} = useTranslation();

  const {leftButton} = useServiceDisruptionSheet();

  return (
    <>
      <FullScreenHeader
        title={t(DeparturesTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={leftButton}
        globalMessageContext="app-departures"
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
          navigation.navigate('Departures_PlaceScreen', {
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
