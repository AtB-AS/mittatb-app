import {useBottomSheet} from '@atb/components/bottom-sheet';
import React, {useRef, useState} from 'react';
import {TravelSearchFiltersBottomSheet} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/TravelSearchFiltersBottomSheet';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useTravelSearchFiltersEnabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-travel-search-filters-enabled';
import type {
  FlexibleTransportOptionTypeWithSelectionType,
  TravelSearchFiltersSelectionType,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {useFilters} from '@atb/travel-search-filters';

type TravelSearchFiltersState =
  | {
      enabled: true;
      openBottomSheet: () => void;
      filtersSelection: TravelSearchFiltersSelectionType;
      anyFiltersApplied: boolean;
      resetTransportModes: () => void;
      disableFlexibleTransport: () => void;
      closeRef: React.Ref<any>;
    }
  | {enabled: false; filtersSelection?: undefined};

/**
 * THe travel search filters state, including whether it is enabled or not, the
 * selected filters, and a function for opening the bottom sheet.
 */
export const useTravelSearchFiltersState = (): TravelSearchFiltersState => {
  const {open} = useBottomSheet();
  const travelSearchFiltersEnabled = useTravelSearchFiltersEnabled();
  const {travelSearchFilters} = useFirestoreConfiguration();
  const {filters, setFilters} = useFilters();

  const transportModeFilterOptionsFromFirestore =
    travelSearchFilters?.transportModes;
  const flexibleTransportFilterOptionFromFirestore =
    travelSearchFilters?.flexibleTransport;

  const defaultTransportModeFilterOptions =
    transportModeFilterOptionsFromFirestore?.map((option) => ({
      ...option,
      selected: true,
    }));
  const defaultFlexibleTransportFilterOption =
    flexibleTransportFilterOptionFromFirestore &&
    ({
      ...flexibleTransportFilterOptionFromFirestore,
      enabled: true,
    } as FlexibleTransportOptionTypeWithSelectionType);

  const initialTransportModeSelection =
    filters?.transportModes ?? defaultTransportModeFilterOptions;

  const initialFlexibleTransportFilterOption =
    filters?.flexibleTransport ?? defaultFlexibleTransportFilterOption;

  const [filtersSelection, setFiltersSelection] =
    useState<TravelSearchFiltersSelectionType>({
      transportModes: initialTransportModeSelection,
      flexibleTransport: initialFlexibleTransportFilterOption,
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
          filtersSelection={filtersSelection}
          onSave={setFiltersSelection}
        />
      ),
      closeRef,
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
    closeRef,
  };
};
