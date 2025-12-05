import {Quay, StopPlace} from '@atb/api/types/departures';
import React, {useMemo} from 'react';
import {
  QuaySection,
  StopPlaceAndQuay,
} from '@atb/screen-components/place-screen';
import {BottomSheetSectionList} from '@gorhom/bottom-sheet';
import {MapStopPlacesListHeader} from './MapStopPlacesListHeader';
import {StopPlacesError} from './StopPlacesError';
import {
  getStopPlaceAndQuays,
  NUMBER_OF_DEPARTURES_IN_BUFFER,
  NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
} from '../utils';

import {SectionListData} from 'react-native';
import {DeparturesProps, useDepartures} from '../hooks/use-departures';

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
  searchTime: string;
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
    testID,
    addedFavoritesVisibleOnDashboard,
    setTravelTarget,
    distance,
  } = props;

  const stopPlaceAndQuays: StopPlaceAndQuay[] = useMemo(
    () => getStopPlaceAndQuays(stopPlaces),
    [stopPlaces],
  );

  const quays: Quay[] = useMemo(
    () => stopPlaceAndQuays.map(({quay}) => quay),
    [stopPlaceAndQuays],
  );

  const quayListData: SectionListData<StopPlaceAndQuay>[] =
    stopPlaceAndQuays.length ? [{data: stopPlaceAndQuays}] : [];

  const quayIds = useMemo(() => quays.map((q) => q.id), [quays]);

  const departuresProps: DeparturesProps = useMemo(
    () => ({
      quayIds,
      limitPerQuay:
        NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW + NUMBER_OF_DEPARTURES_IN_BUFFER,
      showOnlyFavorites: false,
      mode: 'Map',
      startTime: searchTime,
    }),
    [quayIds, searchTime],
  );

  const {departures, isLoading, isError, refetch} =
    useDepartures(departuresProps);

  return (
    <BottomSheetSectionList
      nestedScrollEnabled
      ListHeaderComponent={
        <>
          {isError && (
            <StopPlacesError
              showTimeNavigation={showTimeNavigation}
              forceRefresh={refetch}
            />
          )}
          <MapStopPlacesListHeader
            setTravelTarget={setTravelTarget}
            distance={distance}
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
          isLoading={isLoading}
          departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
          data={departures}
          didLoadingDataFail={isError}
          navigateToDetails={navigateToDetails}
          navigateToQuay={(quay) => navigateToQuay(item.stopPlace, quay)}
          testID={'quaySection' + index}
          showOnlyFavorites={false}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          searchDate={searchTime}
          mode="Map"
        />
      )}
    />
  );
};
