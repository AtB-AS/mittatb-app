import React, {useState} from 'react';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useFiltersContext} from '@atb/modules/travel-search-filters';
import {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';

type TravelSearchFiltersState =
  | {
      enabled: true;
      filtersSelection: TravelSearchFiltersSelectionType;
      setFiltersSelection: React.Dispatch<
        React.SetStateAction<TravelSearchFiltersSelectionType>
      >;
      anyFiltersApplied: boolean;
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
 */
export const useTravelSearchFiltersState = (): TravelSearchFiltersState => {
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

  if (!travelSearchFilters?.transportModes)
    return {enabled: false, setFiltersSelection};

  return {
    enabled: true,
    filtersSelection,
    setFiltersSelection,
    anyFiltersApplied: !!filtersSelection.transportModes?.some(
      (m) => !m.selected,
    ),
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
