import type {RemoteConfig} from '@atb/remote-config';

/**
 * Add new feature toggles here! They will automatically be usable through
 * `useFeatureToggles` and be able to override in the debug menu.
 */
export const toggleSpecifications = [
  // These are not in use in this commit. Just to show how they will be written.
  {
    name: 'isActivateTicketNowEnabled',
    remoteConfigKey: 'enable_activate_ticket_now',
  },
  {
    name: 'isPosthogEnabled',
    remoteConfigKey: 'enable_posthog',
  },
] as const satisfies readonly FeatureToggleSpecification[];

/**
 * Utility type to narrow the RemoteConfig keys to the ones representing a
 * feature toggle.
 */
type RemoteConfigFeatureTogglesKeys = {
  [K in keyof RemoteConfig]: RemoteConfig[K] extends boolean
    ? K extends `enable_${string}` | `use_${string}`
      ? K
      : never
    : never;
}[keyof RemoteConfig];

export type FeatureToggleSpecification = {
  name: `is${string}Enabled`;
  remoteConfigKey: RemoteConfigFeatureTogglesKeys;
};
