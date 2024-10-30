import {toggleSpecifications} from './toggle-specifications';

export type FeatureTogglesContextState = FeatureToggles & {
  debug: {
    overrides: DebugOverride[];
    setOverride: SetDebugOverride;
  };
};

export type FeatureToggleNames = (typeof toggleSpecifications)[number]['name'];
export type FeatureToggles = {
  [K in (typeof toggleSpecifications)[number]['name']]: boolean;
};

export type OverridesMap = Record<string, boolean | undefined>;

export type DebugOverride = {
  name: FeatureToggleNames;
  value: boolean | undefined;
};

export type SetDebugOverride = (
  name: FeatureToggleNames,
  val: boolean | undefined,
) => void;
