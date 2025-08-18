import type {RemoteConfig} from '@atb/modules/remote-config';

/**
 * Add new feature toggles here! They will automatically be usable through
 * `useFeatureToggles` and be able to override in the debug menu.
 */
export const toggleSpecifications = [
  {
    name: 'isActivateTicketNowEnabled',
    remoteConfigKey: 'enable_activate_ticket_now',
  },
  {
    name: 'isBackendSmsAuthEnabled',
    remoteConfigKey: 'enable_backend_sms_auth',
  },
  {
    name: 'isBeaconsEnabled',
    remoteConfigKey: 'enable_beacons',
  },
  {
    name: 'isBonusProgramEnabled',
    remoteConfigKey: 'enable_bonus_program',
  },
  {
    name: 'isCarSharingInMapEnabled',
    remoteConfigKey: 'enable_car_sharing_in_map',
  },
  {
    name: 'isCityBikesInMapEnabled',
    remoteConfigKey: 'enable_city_bikes_in_map',
  },
  {
    name: 'isEventStreamEnabled',
    remoteConfigKey: 'enable_event_stream',
  },
  {
    name: 'isEventStreamFareContractsEnabled',
    remoteConfigKey: 'enable_event_stream_fare_contracts',
  },
  {
    name: 'isFlexibleTransportEnabled',
    remoteConfigKey: 'enable_flexible_transport',
  },
  {
    name: 'isFlexibleTransportOnAccessModeEnabled',
    remoteConfigKey: 'use_flexible_on_accessMode',
  },
  {
    name: 'isFlexibleTransportOnDirectModeEnabled',
    remoteConfigKey: 'use_flexible_on_directMode',
  },
  {
    name: 'isFlexibleTransportOnEgressModeEnabled',
    remoteConfigKey: 'use_flexible_on_egressMode',
  },
  {
    name: 'isFromTravelSearchToTicketBoatEnabled',
    remoteConfigKey: 'enable_from_travel_search_to_ticket_boat',
  },
  {
    name: 'isFromTravelSearchToTicketEnabled',
    remoteConfigKey: 'enable_from_travel_search_to_ticket',
  },
  {
    name: 'isGeofencingZonesEnabled',
    remoteConfigKey: 'enable_geofencing_zones',
  },
  {
    name: 'isLoadingErrorScreenEnabled',
    remoteConfigKey: 'enable_loading_error_screen',
  },
  {
    name: 'isLoadingScreenEnabled',
    remoteConfigKey: 'enable_loading_screen',
  },
  {
    name: 'isMapV2Enabled',
    remoteConfigKey: 'enable_map_v2',
  },
  {
    name: 'isNonTransitTripSearchEnabled',
    remoteConfigKey: 'enable_non_transit_trip_search',
  },
  {
    name: 'isNynorskEnabled',
    remoteConfigKey: 'enable_nynorsk',
  },
  {
    name: 'isOnBehalfOfEnabled',
    remoteConfigKey: 'enable_on_behalf_of',
  },
  {
    name: 'isOnboardingLoginEnabled',
    remoteConfigKey: 'enable_onboarding_login',
  },
  {
    name: 'isOnlyStopPlacesCheckboxEnabled',
    remoteConfigKey: 'enable_only_stop_places_checkbox',
  },
  {
    name: 'isParkingViolationsReportingEnabled',
    remoteConfigKey: 'enable_parking_violations_reporting',
  },
  {
    name: 'isPosthogEnabled',
    remoteConfigKey: 'enable_posthog',
  },
  {
    name: 'isPushNotificationsEnabled',
    remoteConfigKey: 'enable_push_notifications',
  },
  {
    name: 'isRealtimeMapEnabled',
    remoteConfigKey: 'enable_realtime_map',
  },
  {
    name: 'isRefundsEnabled',
    remoteConfigKey: 'enable_refunds',
  },
  {
    name: 'isServerTimeEnabled',
    remoteConfigKey: 'enable_server_time',
  },
  {
    name: 'isShmoDeepIntegrationEnabled',
    remoteConfigKey: 'enable_shmo_deep_integration',
  },
  {
    name: 'isShowValidTimeInfoEnabled',
    remoteConfigKey: 'enable_show_valid_time_info',
  },
  {
    name: 'isTicketInformationEnabled',
    remoteConfigKey: 'enable_ticket_information',
  },
  {
    name: 'isTipsAndInformationEnabled',
    remoteConfigKey: 'enable_tips_and_information',
  },
  {
    name: 'isTravelAidEnabled',
    remoteConfigKey: 'enable_travel_aid',
  },
  {
    name: 'isTravelAidStopButtonEnabled',
    remoteConfigKey: 'enable_travel_aid_stop_button',
  },
  {
    name: 'isVehiclesInMapEnabled',
    remoteConfigKey: 'enable_vehicles_in_map',
  },
  {
    name: 'isInAppReviewEnabled',
    remoteConfigKey: 'enable_in_app_review',
  },
  {
    name: 'isInAppReviewForAnnouncementsEnabled',
    remoteConfigKey: 'enable_in_app_review_for_announcements',
  },
  {
    name: 'isSmartParkAndRideEnabled',
    remoteConfigKey: 'enable_smart_park_and_ride',
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
