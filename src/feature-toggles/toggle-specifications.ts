import type {RemoteConfig} from '@atb/remote-config';

enum OverridesKeysEnum {
  EnableActivateTicketNowDebugOverride = '@ATB_enable_activate_ticket_now_debug_override',
  EnablePosthogDebugOverride = '@ATB_enable_posthog_debug_override',
}

/**
 * Add new feature toggles here! They will automatically be usable through
 * `useFeatureToggles` and be able to override in the debug menu.
 */
export const toggleSpecifications = [
  {
    name: 'isActivateTicketNowEnabled',
    remoteConfigKey: 'enable_activate_ticket_now',
    debugOverrideKey: OverridesKeysEnum.EnableActivateTicketNowDebugOverride,
  },
  {
    name: 'isPosthogEnabled',
    remoteConfigKey: 'enable_posthog',
    debugOverrideKey: OverridesKeysEnum.EnablePosthogDebugOverride,
  },
] as const satisfies readonly FeatureToggleSpecification[];

/**
 * Utility type to narrow the RemoteConfig keys to the ones representing a
 * feature toggle.
 */
type RemoteConfigFeatureTogglesKeys = {
  [K in keyof RemoteConfig]: RemoteConfig[K] extends boolean
    ? K extends `enable_${string}`
      ? K
      : never
    : never;
}[keyof RemoteConfig];

export type FeatureToggleSpecification = {
  name: string;
  remoteConfigKey: RemoteConfigFeatureTogglesKeys;
  debugOverrideKey: OverridesKeysEnum;
};
