import {useBottomSheet} from '@atb/components/bottom-sheet';
import React, {RefObject, useState} from 'react';
import {TravelSearchFiltersBottomSheet} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/TravelSearchFiltersBottomSheet';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useFilters} from '@atb/travel-search-filters';
import {
  FlexibleTransportOptionTypeWithSelectionType,
  TravelSearchFiltersSelectionType,
} from '@atb/travel-search-filters';
import {TravelSearchPreferenceWithSelectionType} from '@atb/travel-search-filters/types';

type TravelSearchFiltersState =
  | {
      enabled: true;
      openBottomSheet: () => void;
      filtersSelection: TravelSearchFiltersSelectionType;
      anyFiltersApplied: boolean;
      resetTransportModes: () => void;
      disableFlexibleTransport: () => void;
    }
  | {enabled: false; filtersSelection?: undefined};

/**
 * The travel search filters state, including whether it is enabled or not, the
 * selected filters, and a function for opening the bottom sheet.
 */
export const useTravelSearchFiltersState = ({
  onCloseFocusRef,
}: {
  onCloseFocusRef: RefObject<any>;
}): TravelSearchFiltersState => {
  const {open, onOpenFocusRef} = useBottomSheet();
  const {travelSearchFilters} = useFirestoreConfiguration();
  const {filters, setFilters} = useFilters();

  const transportModeFilterOptionsFromFirestore =
    travelSearchFilters?.transportModes;
  const flexibleTransportFilterOptionFromFirestore =
    travelSearchFilters?.flexibleTransport;
  const travelSearchPreferencesFromFirestore =
    travelSearchFilters?.travelSearchPreferences;

  const defaultTransportModeFilterOptions =
    transportModeFilterOptionsFromFirestore?.map((option) => ({
      ...option,
      selected: option.selectedAsDefault,
    }));
  const defaultFlexibleTransportFilterOption =
    flexibleTransportFilterOptionFromFirestore &&
    ({
      ...flexibleTransportFilterOptionFromFirestore,
      enabled: true,
    } as FlexibleTransportOptionTypeWithSelectionType);

  const defaultTravelSearchPreferences: TravelSearchPreferenceWithSelectionType[] =
    travelSearchPreferencesFromFirestore?.map((preference) => ({
      ...preference,
      selectedOption: preference.defaultOption,
    })) ?? [];

  const initialTransportModeSelection =
    filters?.transportModes ?? defaultTransportModeFilterOptions;

  const initialFlexibleTransportFilterOption =
    filters?.flexibleTransport ?? defaultFlexibleTransportFilterOption;

  const initialTravelSearchPreferences =
    filters?.travelSearchPreferences ?? defaultTravelSearchPreferences;

  const [filtersSelection, setFiltersSelection] =
    useState<TravelSearchFiltersSelectionType>({
      transportModes: initialTransportModeSelection,
      flexibleTransport: initialFlexibleTransportFilterOption,
      travelSearchPreferences: initialTravelSearchPreferences,
    });

  if (!travelSearchFilters?.transportModes) return {enabled: false};

  const openBottomSheet = () => {
    open(
      () => (
        <TravelSearchFiltersBottomSheet
          ref={onOpenFocusRef}
          filtersSelection={filtersSelection}
          onSave={setFiltersSelection}
        />
      ),
      onCloseFocusRef,
    );
  };

  return {
    enabled: true,
    openBottomSheet,
    filtersSelection,
    anyFiltersApplied:
      filtersSelection.transportModes?.some((m) => !m.selected) ||
      !filtersSelection.flexibleTransport?.enabled ||
      false,
    resetTransportModes: () => {
      const filtersWithInitialTransportModes = {
        ...filtersSelection,
        transportModes: defaultTransportModeFilterOptions,
      };
      setFilters(filtersWithInitialTransportModes);
      setFiltersSelection(filtersWithInitialTransportModes);
    },
    disableFlexibleTransport: () => {
      const filtersWithFlexibleTransportDisabled = {
        ...filtersSelection,
        flexibleTransport: {
          ...filtersSelection.flexibleTransport,
          enabled: false,
        } as FlexibleTransportOptionTypeWithSelectionType,
      };
      setFilters(filtersWithFlexibleTransportDisabled);
      setFiltersSelection(filtersWithFlexibleTransportDisabled);
    },
  };
};
