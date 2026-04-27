import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type PreviousZoneIds = {
  from: string;
  to: string;
};

type PreviousZonesStore = {
  previousZoneIds: PreviousZoneIds | undefined;
  setPreviousZoneIds: (zoneIds: PreviousZoneIds) => void;
};

/**
 * Persisted store holding the fare zones that were most recently selected by
 * the user in the purchase flow. Used as a fallback for default zones when
 * geolocation isn't available.
 */
export const usePreviousZonesStore = create<PreviousZonesStore>()(
  persist(
    (set) => ({
      previousZoneIds: undefined,
      setPreviousZoneIds: (zoneIds) => set({previousZoneIds: zoneIds}),
    }),
    {
      name: '@ATB_user_previous_zones',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({previousZoneIds: state.previousZoneIds}),
    },
  ),
);
