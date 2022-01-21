import React, {useEffect, useState} from 'react';
import {RefreshControl, SectionList, SectionListData} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Quay} from '@atb/api/types/departures';
import {SearchTime} from './Departures';
import {DeparturesStackParams} from '.';
import DateNavigation from './components/DateNavigator';
import {QuaySection} from './PlaceScreen';
import {useQuayData} from './QuayState';

export type QuayScreenParams = {
  quay: Quay;
};

export type QuayScreenProps = {
  quay: Quay;
  navigateToDetails: (
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
  navigateToQuay: (quay: Quay) => void;
};

export default function QuayScreen({
  quay,
  navigateToDetails,
  navigateToQuay,
}: QuayScreenProps) {
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
          isSelected={true}
          data={state.data}
          navigateToDetails={navigateToDetails}
          navigateToQuay={navigateToQuay}
        />
      )}
    />
  );
}
