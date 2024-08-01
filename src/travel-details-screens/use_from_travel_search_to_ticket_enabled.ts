import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StorageModelKeysEnum} from '@atb/storage';
import {useDebugOverride} from '@atb/debug';

export const useFromTravelSearchToTicketEnabled = () => {
  const [debugOverride] = useFromTravelSearchToTicketDebugOverride();
  const {enable_from_travel_search_to_ticket: enabledInRemoteConfig} =
    useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useFromTravelSearchToTicketDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableFromTravelSearchToTicketDebugOverride,
  );
};

export const useFromTravelSearchToTicketForBoatEnabled = () => {
  const [debugOverride] = useFromTravelSearchToTicketForBoatDebugOverride();
  const {enable_from_travel_search_to_ticket_boat: enabledInRemoteConfig} =
    useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useFromTravelSearchToTicketForBoatDebugOverride = () => {
  const ret = useDebugOverride(
    StorageModelKeysEnum.EnableFromTravelSearchToTicketBoatDebugOverride,
  );
  return ret;
};
