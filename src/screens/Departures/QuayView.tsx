import React, {useEffect, useState} from 'react';
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
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
};

export default function QuayView({quay, navigateToDetails}: QuayViewProps) {
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
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
          data={state.data}
          navigateToDetails={navigateToDetails}
        />
      )}
    />
  );
}
