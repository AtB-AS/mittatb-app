import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData} from 'react-native';
import {useStopPlaceData} from './state/stop-place-state';
import {Place, Quay} from '@atb/api/types/departures';
import DateNavigation from './components/DateNavigator';
import QuaySection from './components/QuaySection';
import Feedback from '@atb/components/feedback';
import {SearchTime} from '@atb/screens/Departures/utils';

type StopPlaceViewProps = {
  stopPlace: Place;
  navigateToQuay: (quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
  searchTime: SearchTime;
  setSearchTime: (searchTime: SearchTime) => void;
  testID?: string;
};

export default function StopPlaceView({
  stopPlace,
  navigateToQuay,
  navigateToDetails,
  searchTime,
  setSearchTime,
  testID,
}: StopPlaceViewProps) {
  const {state, refresh} = useStopPlaceData(
    stopPlace,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );
  const quayListData: SectionListData<Quay>[] | undefined = stopPlace.quays
    ? [{data: stopPlace.quays}]
    : undefined;

  useEffect(() => {
    refresh();
  }, [stopPlace]);

  useMemo(
    () =>
      stopPlace.quays?.sort((a, b) =>
        publicCodeCompare(a.publicCode, b.publicCode),
      ),
    [stopPlace],
  );

  return (
    <>
      {quayListData && (
        <SectionList
          ListHeaderComponent={
            <DateNavigation
              searchTime={searchTime}
              setSearchTime={setSearchTime}
            ></DateNavigation>
          }
          refreshControl={
            <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
          }
          sections={quayListData}
          testID={testID}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => (
            <>
              <QuaySection
                quay={item}
                data={state.data}
                navigateToDetails={navigateToDetails}
                navigateToQuay={navigateToQuay}
                testID={'quaySection' + index}
                stopPlace={stopPlace}
              />
              {index === 0 && (
                <Feedback
                  viewContext="departures"
                  metadata={quayListData}
                  avoidResetOnMetadataUpdate
                />
              )}
            </>
          )}
        />
      )}
    </>
  );
}

function publicCodeCompare(a?: string, b?: string): number {
  // Show quays with no public code last
  if (!a) return 1;
  if (!b) return -1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(a) && parseInt(b)) {
    return parseInt(a) - parseInt(b);
  }
  // Otherwise compare as strings (e.g. K1 < K2)
  return a.localeCompare(b);
}
