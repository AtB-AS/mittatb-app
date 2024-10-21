import {FeatureToggleSpecification, toggleSpecifications} from './toggle-specifications';

export type FeatureToggleNames = (typeof toggleSpecifications)[number]['name'];
export type FeatureToggles = {
  [K in (typeof toggleSpecifications)[number]['name']]: boolean;
};

export type OverridesMap = Record<string, boolean | undefined>;

export type DebugOverride = {
  name: FeatureToggleNames;
  key: FeatureToggleSpecification['debugOverrideKey'];
  value: boolean | undefined;
};

export type SetDebugOverride = (
  key: FeatureToggleSpecification['debugOverrideKey'],
  val: boolean | undefined,
) => void;
