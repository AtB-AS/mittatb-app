import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {usePreferenceItems} from '@atb/preferences';

export const useMapPage = () => {
  const {enable_map_page} = useRemoteConfig();
  const {enableMapPage} = usePreferenceItems();
  return enableMapPage !== undefined ? enableMapPage : enable_map_page;
};
