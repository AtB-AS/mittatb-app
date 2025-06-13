import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import React, {RefObject, useState} from 'react';
import {TravelSearchFiltersBottomSheet} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/TravelSearchFiltersBottomSheet';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useFiltersContext} from '@atb/modules/travel-search-filters';
import {
  FlexibleTransportOptionTypeWithSelectionType,
  TravelSearchFiltersSelectionType,
} from '@atb/modules/travel-search-filters';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';

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
  const {open, onOpenFocusRef} = useBottomSheetContext();
  const {travelSearchFilters} = useFirestoreConfigurationContext();
  const {filters, setFilters} = useFiltersContext();

  const transportModeFilterOptionsFromFirestore =
    travelSearchFilters?.transportModes;
  const travelSearchPreferencesFromFirestore =
    travelSearchFilters?.travelSearchPreferences;

  const defaultTransportModeFilterOptions =
    transportModeFilterOptionsFromFirestore?.map((option) => ({
      ...option,
      selected: option.selectedAsDefault,
    }));

  const defaultTravelSearchPreferences: TravelSearchPreferenceWithSelectionType[] =
    travelSearchPreferencesFromFirestore?.map((preference) => ({
      ...preference,
      selectedOption: preference.defaultOption,
    })) ?? [];

  const initialTransportModeSelection =
    filters?.transportModes ?? defaultTransportModeFilterOptions;

  const initialTravelSearchPreferences =
    filters?.travelSearchPreferences ?? defaultTravelSearchPreferences;

  const [filtersSelection, setFiltersSelection] =
    useState<TravelSearchFiltersSelectionType>({
      transportModes: initialTransportModeSelection,
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
