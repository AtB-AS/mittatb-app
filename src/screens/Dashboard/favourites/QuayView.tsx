import {Place, Quay} from '@atb/api/types/departures';
import React, {useEffect} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import {useQuayData} from '@atb/screens/Departures/state/quay-state';
import QuayItem from '@atb/screens/Dashboard/favourites/QuayItem';

export type QuayViewProps = {
  quay: Quay;
  testID?: string;
  stopPlace: Place;
};

export default function QuayView({quay, testID, stopPlace}: QuayViewProps) {
  const {state, refresh} = useQuayData(quay, false, undefined, 1);

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];

  useEffect(() => {
    refresh();
  }, [quay]);

  return (
    <SectionList
      refreshControl={
        <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuayItem quay={item} data={state.data} stopPlace={stopPlace} />
      )}
    />
  );
}
