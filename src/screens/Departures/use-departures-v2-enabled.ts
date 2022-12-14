import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {usePreferences} from '@atb/preferences';

export const useDeparturesV2Enabled = () => {
  const {enable_departures_v2_as_default} = useRemoteConfig();
  const {
    preferences: {departuresV2, newDepartures},
  } = usePreferences();

  if (enable_departures_v2_as_default) {
    return departuresV2 ?? true;
  } else {
    return newDepartures ?? false;
  }
};
