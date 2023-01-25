import {useOnlySingleLocation} from '@atb/location-search';
import React from 'react';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StopPlace} from '@atb/api/types/departures';
import {
  FavoriteDeparturesTexts,
  NearbyTexts,
  useTranslation,
} from '@atb/translations';
import {NearbyStopPlacesScreenComponent} from '@atb/nearby-stop-places';
import {FullScreenHeader} from '@atb/components/screen-header';

type Props = DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>;

const Dashboard_NearbyStopPlacesScreen = ({navigation, route}: Props) => {
  const fromLocation = useOnlySingleLocation('location');
  const {t} = useTranslation();

  return (
    <>
      <FullScreenHeader
        title={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
        leftButton={{type: 'close'}}
      />
      <NearbyStopPlacesScreenComponent
        location={fromLocation}
        mode={route.params.mode}
        onPressLocationSearch={(location) =>
          navigation.navigate('LocationSearchStack', {
            screen: 'LocationSearchByTextScreen',
            params: {
              label: t(NearbyTexts.search.label),
              callerRouteName: route.name,
              callerRouteParam: 'location',
              initialLocation: location,
            },
          })
        }
        onSelectStopPlace={(place: StopPlace) => {
          navigation.navigate('Dashboard_PlaceScreen', {
            place,
            mode: route.params.mode,
            onCloseRoute: route.params.onCloseRoute,
          });
        }}
        onUpdateLocation={(location) => navigation.setParams({location})}
      />
    </>
  );
};

export default Dashboard_NearbyStopPlacesScreen;
