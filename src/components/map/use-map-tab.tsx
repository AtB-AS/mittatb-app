import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {usePreferenceItems} from '@atb/preferences';

export const useMapTab = () => {
  const {enable_map_tab} = useRemoteConfig();
  const {enableMapTab} = usePreferenceItems();
  return enableMapTab !== undefined ? enableMapTab : enable_map_tab;
};
