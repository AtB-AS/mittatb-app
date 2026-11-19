import React, {useState} from 'react';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useFiltersContext} from '@atb/modules/travel-search-filters';
import {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';
import type {InitialTravelSearchFilters} from '@atb/modules/travel-search-filters';
import {
  overridePreferenceValues,
  selectTransportModeFiltersById,
} from './utils';

type TravelSearchFiltersState =
  | {
      enabled: true;
      filtersSelection: TravelSearchFiltersSelectionType;
      setFiltersSelection: React.Dispatch<
        React.SetStateAction<TravelSearchFiltersSelectionType>
      >;
      resetTransportModes: () => void;
    }
  | {
      enabled: false;
      filtersSelection?: undefined;
      setFiltersSelection: React.Dispatch<
        React.SetStateAction<TravelSearchFiltersSelectionType>
      >;
    };

/**
 * The travel search filters state, including whether it is enabled or not, the
 * selected filters, and a function for opening the bottom sheet.
 *
 * @param initialFilters - Filters to start with instead of the user's selection,
 * e.g. from a deep link. These are not saved.
 */
export const useTravelSearchFiltersState = (
  initialFilters?: InitialTravelSearchFilters,
): TravelSearchFiltersState => {
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
    selectTransportModeFiltersById(
      defaultTransportModeFilterOptions,
      initialFilters?.transportModes,
    ) ??
    filters?.transportModes ??
    defaultTransportModeFilterOptions;

  const initialTravelSearchPreferences = overridePreferenceValues(
    filters?.travelSearchPreferences ?? defaultTravelSearchPreferences,
    initialFilters?.travelSearchPreferences,
  );

  const [filtersSelection, setFiltersSelection] =
    useState<TravelSearchFiltersSelectionType>({
      transportModes: initialTransportModeSelection,
      travelSearchPreferences: initialTravelSearchPreferences,
    });

  if (!travelSearchFilters?.transportModes)
    return {enabled: false, setFiltersSelection};

  return {
    enabled: true,
    filtersSelection,
    setFiltersSelection,
    resetTransportModes: () => {
      const filtersWithInitialTransportModes = {
        ...filtersSelection,
        transportModes: defaultTransportModeFilterOptions,
      };
      setFilters(filtersWithInitialTransportModes);
      setFiltersSelection(filtersWithInitialTransportModes);
    },
  };
};
