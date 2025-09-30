import {Quay, StopPlace} from '@atb/api/types/departures';
import React from 'react';
import {type DepartureSearchTime} from '@atb/components/date-selection';
import {QuaySection} from '@atb/screen-components/place-screen';
import {BottomSheetSectionList} from '@gorhom/bottom-sheet';
import {
  NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
  useStopPlacesData,
} from '../hooks/use-stop-places-data';
import {MapStopPlacesListHeader} from './MapStopPlacesListHeader';
import {StopPlacesError} from './StopPlacesError';

type Props = {
  stopPlaces: StopPlace[];
  showTimeNavigation?: boolean;
  navigateToQuay: (sp: StopPlace, quay: Quay) => void;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date: string | undefined,
    fromStopPosition: number,
  ) => void;
  searchTime: DepartureSearchTime;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (enabled: boolean) => void;
  isFocused: boolean;
  testID?: string;
  addedFavoritesVisibleOnDashboard?: boolean;
  setTravelTarget?: (target: string) => void;
  distance?: number | undefined;
};

export const StopPlacesSheetView = (props: Props) => {
  const {
    stopPlaces,
    showTimeNavigation = true,
    navigateToQuay,
    navigateToDetails,
    searchTime,
    showOnlyFavorites,
    setShowOnlyFavorites,
    isFocused,
    testID,
    addedFavoritesVisibleOnDashboard,
    setTravelTarget,
    distance,
  } = props;

  const {
    didLoadingDataFail,
    forceRefresh,
    state,
    quayListData,
    searchStartTime,
  } = useStopPlacesData({
    mode: 'Map',
    searchTime,
    stopPlaces,
    setShowOnlyFavorites,
    isFocused,
    showOnlyFavorites,
  });

  return (
    <BottomSheetSectionList
      style={{flex: 1}}
      nestedScrollEnabled
      ListHeaderComponent={
        <>
          {didLoadingDataFail && (
            <StopPlacesError
              showTimeNavigation={showTimeNavigation}
              forceRefresh={forceRefresh}
            />
          )}
          <MapStopPlacesListHeader
            setTravelTarget={setTravelTarget}
            distance={distance}
            showTimeNavigation={showTimeNavigation}
            stopPlaces={stopPlaces}
          />
        </>
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.quay.id}
      renderItem={({item, index}) => (
        <QuaySection
          quay={item.quay}
          isLoading={state.isLoading}
          departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
          data={state.data}
          didLoadingDataFail={didLoadingDataFail}
          navigateToDetails={navigateToDetails}
          navigateToQuay={(quay) => navigateToQuay(item.stopPlace, quay)}
          testID={'quaySection' + index}
          showOnlyFavorites={showOnlyFavorites}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          searchDate={searchStartTime}
          mode="Map"
        />
      )}
    />
  );
};
