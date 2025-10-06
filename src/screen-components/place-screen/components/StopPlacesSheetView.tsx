import {EstimatedCall, Quay, StopPlace} from '@atb/api/types/departures';
import React, {useMemo} from 'react';
import {
  QuaySection,
  StopPlaceAndQuay,
} from '@atb/screen-components/place-screen';
import {BottomSheetSectionList} from '@gorhom/bottom-sheet';
import {MapStopPlacesListHeader} from './MapStopPlacesListHeader';
import {StopPlacesError} from './StopPlacesError';
import {useGetDeparturesQuery} from '../hooks/use-get-departures-query';
import {DeparturesVariables} from '@atb/api/bff/departures';
import {
  getStopPlaceAndQuays,
  getTimeRangeByMode,
  NUMBER_OF_DEPARTURES_IN_BUFFER,
  NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
} from '../utils';
import {flatMap} from '@atb/utils/array';
import {SectionListData} from 'react-native';

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

  const updatedTimeRange = getTimeRangeByMode('Map', searchTime);
  const quayIds = useMemo(() => quays.map((q) => q.id), [quays]);

  const query = useMemo(
    () =>
      ({
        ids: quayIds,
        numberOfDepartures:
          NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW +
          NUMBER_OF_DEPARTURES_IN_BUFFER,
        startTime: searchTime,
        timeRange: updatedTimeRange,
      }) as DeparturesVariables,
    [quayIds, searchTime, updatedTimeRange],
  );

  const {
    data: stopDetailsData,
    isLoading: stateIsLoading,
    isError: didLoadingDataFail,
    refetch: refetchStopDetails,
  } = useGetDeparturesQuery({query});

  return (
    <BottomSheetSectionList
      nestedScrollEnabled
      ListHeaderComponent={
        <>
          {didLoadingDataFail && (
            <StopPlacesError
              showTimeNavigation={showTimeNavigation}
              forceRefresh={refetchStopDetails}
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
          isLoading={stateIsLoading}
          departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
          data={
            stopDetailsData
              ? (flatMap(
                  stopDetailsData?.quays,
                  (q) => q.estimatedCalls,
                ) as EstimatedCall[])
              : []
          }
          didLoadingDataFail={didLoadingDataFail}
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
