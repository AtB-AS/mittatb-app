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
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

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
  const isFocusedAndActive = useIsFocusedAndActive();

  const departuresProps: DeparturesProps = useMemo(
    () => ({
      enabled: isFocusedAndActive,
      quayIds,
      limitPerQuay:
        NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW + NUMBER_OF_DEPARTURES_IN_BUFFER,
      showOnlyFavorites: false,
      mode: 'Map',
      startTime: searchTime,
    }),
    [quayIds, searchTime, isFocusedAndActive],
  );

  const {
    departures,
    departuresIsLoading,
    departuresIsError,
    refetchDepartures,
  } = useDepartures(departuresProps);

  return (
    <BottomSheetSectionList
      nestedScrollEnabled
      ListHeaderComponent={
        <>
          {departuresIsError && (
            <StopPlacesError
              showTimeNavigation={showTimeNavigation}
              forceRefresh={refetchDepartures}
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
      keyExtractor={(item: StopPlaceAndQuay) => item.quay.id}
      renderItem={({item, index}: {item: StopPlaceAndQuay; index: number}) => (
        <QuaySection
          quay={item.quay}
          isLoading={departuresIsLoading}
          departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
          data={departures}
          didLoadingDataFail={departuresIsError}
          navigateToDetails={navigateToDetails}
          navigateToQuay={(quay) => navigateToQuay(item.stopPlace, quay)}
          testID={'quaySection' + index}
          showOnlyFavorites={false}
          searchDate={searchTime}
          mode="Map"
        />
      )}
    />
  );
};
