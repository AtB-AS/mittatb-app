import {TripPattern} from '@atb/api/types/trips';
import {storage, StorageModelTypes} from '@atb/modules/storage';
import {getTripPatternKey} from './utils';

export type StoredTripPattern = {
  key: string;
} & TripPattern;

class TripPatternStore {
  storageKey: StorageModelTypes;

  constructor(storageKey: StorageModelTypes) {
    this.storageKey = storageKey;
  }

  async getTripPatterns(): Promise<StoredTripPattern[]> {
    const tripPatterns = await storage.get(this.storageKey);
    return (
      tripPatterns ? JSON.parse(tripPatterns) : []
    ) as StoredTripPattern[];
  }

  private async _setTripPatterns(
    tripPatterns: StoredTripPattern[],
  ): Promise<StoredTripPattern[]> {
    const sorted = [...tripPatterns].sort((a, b) => {
      return (
        new Date(a.expectedStartTime).getTime() -
        new Date(b.expectedStartTime).getTime()
      );
    });
    await storage.set(this.storageKey, JSON.stringify(sorted));
    return tripPatterns;
  }

  async addTripPattern(tripPattern: TripPattern): Promise<StoredTripPattern[]> {
    let tripPatterns = await this.getTripPatterns();
    tripPatterns = tripPatterns.concat({
      ...tripPattern,
      key: getTripPatternKey(tripPattern),
    });
    return await this._setTripPatterns(tripPatterns);
  }

  async removeTripPattern(
    tripPattern: TripPattern,
  ): Promise<StoredTripPattern[]> {
    let tripPatterns = await this.getTripPatterns();
    tripPatterns = tripPatterns.filter(
      (item) => item.key !== getTripPatternKey(tripPattern),
    );
    return await this._setTripPatterns(tripPatterns);
  }

  async updateTripPattern(
    tripPattern: TripPattern,
  ): Promise<StoredTripPattern[]> {
    let tripPatterns = await this.getTripPatterns();
    tripPatterns = tripPatterns.map((item) => {
      if (item.key !== getTripPatternKey(tripPattern)) {
        return item;
      }
      return {...tripPattern, key: getTripPatternKey(tripPattern)};
    });
    return await this._setTripPatterns(tripPatterns);
  }
}

export const storedTripPatterns = new TripPatternStore(
  '@ATB_user_trip_patterns',
);
