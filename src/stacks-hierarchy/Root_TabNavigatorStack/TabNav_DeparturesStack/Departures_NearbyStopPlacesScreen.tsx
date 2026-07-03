import {StopPlace} from '@atb/api/types/departures';
import {
  usePendingLocationSearchStore,
  useOnlySingleLocation,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect} from 'react';
import {DeparturesStackProps} from './navigation-types';
import {NearbyStopPlacesScreenComponent} from '@atb/screen-components/nearby-stop-places';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import SharedTexts from '@atb/translations/shared';
import {useThemeContext} from '@atb/theme';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

const RESULT_KEY = 'Departures_NearbyStopPlacesScreen--location';

type Props = DeparturesStackProps<'Departures_NearbyStopPlacesScreen'>;

export const Departures_NearbyStopPlacesScreen = ({
  navigation,
  route,
}: Props) => {
  const fromLocation = useOnlySingleLocation(route, 'location');
  const {t} = useTranslation();
  const {theme} = useThemeContext();
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
      showFavoriteChips={true}
      headerProps={{
        title: t(DeparturesTexts.header.title),
        globalMessageContext: GlobalMessageContextEnum.appDepartures,
        color: theme.color.background.neutral[1],
      }}
      isLargeTitle={true}
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
