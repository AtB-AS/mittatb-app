import {create} from 'zustand';
import {SelectableLocationType} from './types';

type LocationSearchStore = {
  pendingResult: {
    key: string;
    location: SelectableLocationType | undefined;
  } | null;
  setPendingResult: (
    key: string,
    location: SelectableLocationType | undefined,
  ) => void;
  clearPendingResult: () => void;
};

/**
 * Listen for locations selected from the location search screens (map and
 * text), by passing a resultKey when navigating to the search screen, then
 * listen to the pendingResult in this store.
 *
 * @example
 * ```ts
 * const onNavigate = () => {
 *   navigation.navigate('Root_LocationSearchByTextScreen', {
 *     resultKey: 'someKey',
 *   });
 * };
 *
 * const {pendingResult, clearPendingResult} = useLocationSearchStore();
 * useEffect(() => {
 *   if (pendingResult.key === 'someKey') {
 *     navigation.setParams({location: pendingResult.location});
 *     clearPendingResult();
 *   }
 * }, [pendingResult]);
 * ```
 */
export const usePendingLocationSearchStore = create<LocationSearchStore>(
  (set) => ({
    pendingResult: null,
    setPendingResult: (key, location) => set({pendingResult: {key, location}}),
    clearPendingResult: () => set({pendingResult: null}),
  }),
);
