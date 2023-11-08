import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useParkingViolationsReportingEnabled = () => {
  const {enable_parking_violations_reporting} = useRemoteConfig();
  const [debugOverride, _, debugOverrideReady] =
    useParkingViolationsReportingEnabledDebugOverride();
  return [
    debugOverride !== undefined
      ? debugOverride
      : enable_parking_violations_reporting,
    debugOverrideReady,
  ];
};

export const useParkingViolationsReportingEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnableParkingViolationsReportingDebugOverride,
  );
};
