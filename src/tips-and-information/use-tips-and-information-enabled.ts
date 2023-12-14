import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useTipsAndInformationEnabled = () => {
  const {enable_tips_and_information} = useRemoteConfig();
  const [debugOverride] = useTipsAndInformationDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_tips_and_information;
};

export const useTipsAndInformationDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTipsAndInformationOverride,
  );
};
