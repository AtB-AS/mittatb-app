import {Place, Quay} from '@atb/api/types/departures';
import {ActionItem} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect, useState} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import DateNavigation from './components/DateNavigator';
import FavoriteToggle from './components/FavoriteToggle';
import QuaySection from './components/QuaySection';
import {SearchTime} from './NearbyPlaces';
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
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (enabled: boolean) => void;
  testID?: string;
  stopPlace: Place;
};

export default function QuayView({
  quay,
  navigateToDetails,
  searchTime,
  setSearchTime,
  showOnlyFavorites,
  setShowOnlyFavorites,
  testID,
  stopPlace,
}: QuayViewProps) {
  const {state, refresh} = useQuayData(
    quay,
    showOnlyFavorites,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];

  useEffect(() => {
    refresh();
  }, [quay]);

  return (
    <SectionList
      ListHeaderComponent={
        <>
          <FavoriteToggle
            enabled={showOnlyFavorites}
            setEnabled={setShowOnlyFavorites}
          />
          <DateNavigation
            searchTime={searchTime}
            setSearchTime={setSearchTime}
          />
        </>
      }
      refreshControl={
        <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuaySection
          quay={item}
          data={state.data}
          navigateToDetails={navigateToDetails}
          testID={'quaySection'}
          stopPlace={stopPlace}
        />
      )}
    />
  );
}
