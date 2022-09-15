import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {usePreferences} from '@atb/preferences';

export const useNewFrontpage = () => {
  const {enable_frontpage} = useRemoteConfig();
  const {
    preferences: {newFrontPage},
  } = usePreferences();
  return newFrontPage !== undefined ? newFrontPage : enable_frontpage;
};
