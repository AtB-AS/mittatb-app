import storage, {StorageModelTypes} from '../storage';
import {TransportModeFilterOptionWithSelectionType} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';

class FilterStore<T = TransportModeFilterOptionWithSelectionType> {
  key: StorageModelTypes;

  constructor(key: StorageModelTypes) {
    this.key = key;
  }

  async getFilters(): Promise<T[]> {
    const userFilters = await storage.get(this.key);
    return (userFilters ? JSON.parse(userFilters) : []) as T[];
  }

  async setFilters(filters: T[]): Promise<T[]> {
    await storage.set(this.key, JSON.stringify(filters));
    return filters;
  }
}

export const storedFilters =
  new FilterStore<TransportModeFilterOptionWithSelectionType>(
    '@ATB_user_travel_search_filters',
  );
