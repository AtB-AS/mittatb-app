import React, {useEffect, useMemo, useState} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import {useStopPlaceData} from './StopPlaceState';
import {Quay, StopPlacePosition} from '@atb/api/types/departures';
import {SearchTime} from './Departures';
import DateNavigation from './components/DateNavigator';
import {QuaySection} from './PlaceScreen';

type StopPlaceScreenProps = {
  stopPlacePosition: StopPlacePosition;
  navigateToQuay: (quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
};

export default function StopScreen({
  stopPlacePosition,
  navigateToQuay,
  navigateToDetails,
}: StopPlaceScreenProps) {
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const stopPlace = stopPlacePosition.node?.place;
  const {state, refresh} = useStopPlaceData(
    stopPlacePosition,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );
  const quayListData: SectionListData<Quay>[] | undefined = stopPlace?.quays
    ? [{data: stopPlace.quays}]
    : undefined;

  useEffect(() => {
    refresh();
  }, [stopPlace]);

  useMemo(
    () =>
      stopPlace?.quays?.sort((a, b) =>
        publicCodeCompare(a.publicCode, b.publicCode),
      ),
    [stopPlace],
  );

  return (
    <>
      {quayListData && (
        <SectionList
          stickySectionHeadersEnabled={true}
          stickyHeaderIndices={[0]}
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
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <QuaySection
              quay={item}
              isSelected={false}
              data={state.data}
              navigateToDetails={navigateToDetails}
              navigateToQuay={navigateToQuay}
            />
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
