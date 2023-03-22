import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useTipsAndInformation = () => {
  const {enable_tips_and_information} = useRemoteConfig();
  const [debugOverride] = useTipsAndInformationOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_tips_and_information;
};

export const useTipsAndInformationOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableTipsAndInformationOverride,
  );
};
