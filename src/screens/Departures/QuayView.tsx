import React, {useEffect} from 'react';
import {RefreshControl, SectionList, SectionListData} from 'react-native';
import {Quay} from '@atb/api/types/departures';
import {SearchTime} from './NearbyPlaces';
import DateNavigation from './components/DateNavigator';
import QuaySection from './components/QuaySection';
import {useQuayData} from './state/quay-state';

export type QuayViewParams = {
  quay: Quay;
};

export type QuayViewProps = {
  quay: Quay;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
  searchTime: SearchTime;
  setSearchTime: (searchTime: SearchTime) => void;
};

export default function QuayView({
  quay,
  navigateToDetails,
  searchTime,
  setSearchTime,
}: QuayViewProps) {
  const {state, refresh} = useQuayData(
    quay,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];

  useEffect(() => {
    refresh();
  }, [quay]);

  return (
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
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuaySection
          quay={item}
          data={state.data}
          navigateToDetails={navigateToDetails}
        />
      )}
    />
  );
}
