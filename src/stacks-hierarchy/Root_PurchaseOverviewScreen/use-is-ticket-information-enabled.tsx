import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useIsTicketInformationEnabled = () => {
  const {enable_ticket_information} = useRemoteConfig();
  const [debugOverride, _, debugOverrideReady] =
    useTicketInformationEnabledDebugOverride();
  return [
    debugOverride !== undefined ? debugOverride : enable_ticket_information,
    debugOverrideReady,
  ];
};

export const useTicketInformationEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTicketInformationDebugOverride,
  );
};
