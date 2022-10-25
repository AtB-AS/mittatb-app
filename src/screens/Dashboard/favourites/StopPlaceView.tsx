import {Place, Quay} from '@atb/api/types/departures';
import {useStopPlaceData} from '@atb/screens/Departures/state/stop-place-state';
import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData} from 'react-native';
import QuayItem from '@atb/screens/Dashboard/favourites/QuayItem';
import {publicCodeCompare} from '@atb/screens/Departures/utils';

const MAX_NUMBER_OF_LINES_PER_QUAY_TO_SHOW = 5;

type StopPlaceViewProps = {
  stopPlace: Place;
  navigateToQuay: (quay: Quay) => void;
  testID?: string;
};

export default function StopPlaceView({
  stopPlace,
  navigateToQuay,
  testID,
}: StopPlaceViewProps) {
  const {state, refresh} = useStopPlaceData(stopPlace, false, undefined, 1);
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

  return quayListData ? (
    <SectionList
      refreshControl={
        <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item, index}) => (
        <QuayItem
          quay={item}
          departuresPerQuay={MAX_NUMBER_OF_LINES_PER_QUAY_TO_SHOW}
          data={state.data}
          navigateToQuay={navigateToQuay}
          stopPlace={stopPlace}
        />
      )}
    />
  ) : null;
}
