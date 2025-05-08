import {
  TravelSearchFiltersSelectionType,
  TransportModeFilterOptionWithSelectionType,
} from './types';
import {storage, StorageModelTypes} from '@atb/modules/storage';

class FilterStore<TravelSearchFiltersSelectionType> {
  key: StorageModelTypes;

  constructor(key: StorageModelTypes) {
    this.key = key;
  }

  async getFilters(): Promise<TravelSearchFiltersSelectionType> {
    const userFilters = await storage.get(this.key);
    return (
      userFilters ? JSON.parse(userFilters) : {}
    ) as TravelSearchFiltersSelectionType;
  }

  async setFilters(
    filters: TravelSearchFiltersSelectionType,
  ): Promise<TravelSearchFiltersSelectionType> {
    await storage.set(this.key, JSON.stringify(filters));
    return filters;
  }

  async getFiltersAndMigrateFromV1IfNeeded(): Promise<TravelSearchFiltersSelectionType> {
    const filtersV1Key: StorageModelTypes = '@ATB_user_travel_search_filters';
    const userFiltersV1JSON = await storage.get(filtersV1Key);
    const userFiltersV1 =
      userFiltersV1JSON &&
      (JSON.parse(
        userFiltersV1JSON,
      ) as TransportModeFilterOptionWithSelectionType[]);

    const userFilters = await this.getFilters();

    if (Array.isArray(userFiltersV1)) {
      await storage.remove(filtersV1Key);
      const migratedFilters = {
        ...userFilters,
        transportModes: userFiltersV1,
      };
      await this.setFilters(migratedFilters);

      return migratedFilters;
    }

    return userFilters;
  }
}

export const storedFilters = new FilterStore<TravelSearchFiltersSelectionType>(
  '@ATB_user_travel_search_filters_v2',
);
