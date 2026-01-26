import {StopPlace} from '@atb/api/types/departures';
import {useOnlySingleLocation} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {DeparturesStackProps} from './navigation-types';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import SharedTexts from '@atb/translations/shared';
import {useThemeContext} from '@atb/theme';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = DeparturesStackProps<'Departures_NearbyStopPlacesScreen'>;

export const Departures_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation(route, 'location');
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const focusRef = useFocusOnLoad(navigation);

  return (
    <NearbyStopPlacesScreenComponent
      focusRef={focusRef}
      location={fromLocation}
      showFavoriteChips={true}
      headerProps={{
        title: t(DeparturesTexts.header.title),
        globalMessageContext: GlobalMessageContextEnum.appDepartures,
        color: theme.color.background.neutral[1],
      }}
      isLargeTitle={true}
      onPressLocationSearch={(location) =>
        navigation.navigate('Root_LocationSearchByTextScreen', {
          label: t(SharedTexts.from),
          callerRouteConfig: {
            route: [
              'Root_TabNavigatorStack',
              {
                screen: 'TabNav_DeparturesStack',
                params: {
                  screen: 'Departures_NearbyStopPlacesScreen',
                  params: {
                    location: route.params.location,
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
          navigation.navigate('Departures_PlaceScreen', {
            place,
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
