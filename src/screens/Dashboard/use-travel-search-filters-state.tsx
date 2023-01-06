import {useBottomSheet} from '@atb/components/bottom-sheet';
import React, {useRef, useState} from 'react';
import {TravelSearchFiltersBottomSheet} from '@atb/screens/Dashboard/TravelSearchFiltersBottomSheet';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useTravelSearchFiltersEnabled} from '@atb/screens/Dashboard/use-travel-search-filters-enabled';
import type {TravelSearchFiltersType} from '@atb/screens/Dashboard/types';

type TravelSearchFiltersState =
  | {
      enabled: true;
      openBottomSheet: () => void;
      selectedFilters: TravelSearchFiltersType;
      closeRef: React.Ref<any>;
    }
  | {enabled: false; selectedFilters?: undefined};

/**
 * THe travel search filters state, including whether it is enabled or not, the
 * selected filters, and a function for opening the bottom sheet.
 */
export const useTravelSearchFiltersState = (): TravelSearchFiltersState => {
  const {open} = useBottomSheet();
  const travelSearchFiltersEnabled = useTravelSearchFiltersEnabled();
  const {travelSearchFilters} = useFirestoreConfiguration();
  const transportModeFilterOptions = travelSearchFilters?.transportModes;
  const [selectedFilters, setSelectedFilters] =
    useState<TravelSearchFiltersType>({
      transportModes: transportModeFilterOptions,
    });
  const closeRef = useRef();

  if (!travelSearchFiltersEnabled) return {enabled: false};
  if (!travelSearchFilters?.transportModes) return {enabled: false};

  const openBottomSheet = () => {
    open(
      (close, focusRef) => (
        <TravelSearchFiltersBottomSheet
          close={close}
          ref={focusRef}
          filters={{transportModes: transportModeFilterOptions}}
          initialSelection={selectedFilters}
          onSave={setSelectedFilters}
        />
      ),
      closeRef,
    );
  };

  return {enabled: true, openBottomSheet, selectedFilters, closeRef};
};
