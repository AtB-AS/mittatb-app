import {
  DebugOverride,
  FeatureToggleNames,
  FeatureToggles,
  OverridesMap,
} from '@atb/feature-toggles/types';
import {storage} from '@atb/storage';
import {parseBoolean} from '@atb/utils/parse-boolean';
import {RemoteConfig} from '@atb/remote-config';
import {toggleSpecifications} from './toggle-specifications';
import {isDefined} from '@atb/utils/presence.ts';

/**
 * Get stored overrides from local storage for all entries in OverrideKeysEnum,
 * and map it to an object. Will return empty object if something fails.
 */
export const getStoredOverrides = async (): Promise<OverridesMap> => {
  const keys = toggleSpecifications.map((s) => toStorageKey(s.name));
  const storedPairs = await storage.getMulti(keys);
  const overridesMap = storedPairs?.reduce<OverridesMap>((all, [k, v]) => {
    all[k] = parseBoolean(v);
    return all;
  }, {});
  return overridesMap || {};
};

/**
 * Map the toggle specifications to the FeatureToggles type which is returned
 * from the context.
 */
export const getFeatureTogglesFromSpecs = (
  remoteConfig: RemoteConfig,
  overrides: OverridesMap,
) =>
  toggleSpecifications.reduce<FeatureToggles>((acc, spec) => {
    const override = overrides[toStorageKey(spec.name)];
    acc[spec.name] = isDefined(override)
      ? override
      : remoteConfig[spec.remoteConfigKey];
    return acc;
  }, {} as FeatureToggles); // Is safe to cast as the FeatureToggles type is derived from toggleSpecifications

/**
 * Map the toggle specifications to the DebugOverride type which is returned
 * as debug data from the context to use in DebugInfoScreen.
 */
export const getDebugOverridesFromSpecs = (
  overrides: OverridesMap,
): DebugOverride[] =>
  toggleSpecifications.map((spec) => ({
    name: spec.name,
    value: overrides[toStorageKey(spec.name)],
  }));

export const toStorageKey = (name: FeatureToggleNames) => `@ATB_${name}`;
