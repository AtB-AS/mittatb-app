import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuthState} from '@atb/auth';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {KeyValuePair, storage, StorageModelKeysEnum} from '@atb/storage';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {usePreferences, UserPreferences} from '@atb/preferences';
import {get, keys} from 'lodash';
import {Button} from '@atb/components/button';
import {
  RemoteConfigContextState,
  useRemoteConfig,
} from '@atb/RemoteConfigContext';
import {useGlobalMessagesState} from '@atb/global-messages';
import {APP_GROUP_NAME} from '@env';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {useVehiclesInMapDebugOverride} from '@atb/mobility';
import {DebugOverride} from './components/DebugOverride';
import {useRealtimeMapDebugOverride} from '@atb/components/map';
import {useTicketingAssistantDebugOverride} from '../../Root_TicketAssistantStack/use-ticketing-assistant-enabled';
import {useTipsAndInformationDebugOverride} from '@atb/tips-and-information/use-tips-and-information-enabled';
import {useCityBikesInMapDebugOverride} from '@atb/mobility/use-city-bikes-enabled';
import {useFlexibleTransportDebugOverride} from '../TabNav_DashboardStack/Dashboard_TripSearchScreen/use-flexible-transport-enabled';
import {useShowValidTimeInfoDebugOverride} from '../TabNav_DashboardStack/Dashboard_TripSearchScreen/use-show-valid-time-info-enabled';
import {
  ButtonSectionItem,
  ExpandableSectionItem,
  GenericSectionItem,
  HeaderSectionItem,
  LinkSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {useDebugOverride} from '@atb/debug';
import {useCarSharingInMapDebugOverride} from '@atb/mobility/use-car-sharing-enabled';
import {useGeofencingZonesDebugOverride} from '@atb/mobility/use-geofencing-zones-enabled';
import {useShmoDeepIntegrationDebugOverride} from '@atb/mobility/use-shmo-deep-integration-enabled';
import {
  useFromTravelSearchToTicketDebugOverride,
  useFromTravelSearchToTicketForBoatDebugOverride,
} from '@atb/travel-details-screens/use_from_travel_search_to_ticket_enabled';
import {useNonTransitTripSearchDebugOverride} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-non-transit-trip-search-enabled';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useLoadingScreenEnabledDebugOverride} from '@atb/loading-screen/use-loading-screen-enabled';
import {useLoadingErrorScreenEnabledDebugOverride} from '@atb/loading-screen/use-loading-error-screen-enabled';
import {useBeaconsEnabledDebugOverride} from '@atb/beacons';
import {useParkingViolationsReportingEnabledDebugOverride} from '@atb/parking-violations-reporting';
import {shareTravelHabitsSessionCountKey} from '@atb/beacons/use-should-show-share-travel-habits-screen';

import {useAnnouncementsState} from '@atb/announcements';
import {
  useNotifications,
  usePushNotificationsEnabledDebugOverride,
} from '@atb/notifications';
import {useTimeContextState} from '@atb/time';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {useOnBehalfOfEnabledDebugOverride} from '@atb/on-behalf-of';
import {useTicketInformationEnabledDebugOverride} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-is-ticket-information-enabled';
import {usePosthogEnabledDebugOverride} from '@atb/analytics/use-is-posthog-enabled';
import {useOnboardingState} from '@atb/onboarding';
import {useServerTimeEnabledDebugOverride} from '@atb/time';
import Bugsnag from '@bugsnag/react-native';
import {useActivateTicketNowEnabledDebugOverride} from '@atb/fare-contracts/use-is-activate-now-enabled';
import {useBackendSmsAuthEnabledDebugOverride} from '@atb/auth/use-is-backend-sms-auth-enabled';
import {useOnlyStopPlacesCheckboxEnabledDebugOverride} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen/use-only-stop-places-checkbox-enabled.tsx';
import {useIsTravelAidEnabledDebugOverride} from '@atb/travel-aid/use-is-travel-aid-enabled';
import {useIsTravelAidStopButtonEnabledDebugOverride} from '@atb/travel-aid/use-is-travel-aid-stop-button-enabled';

function setClipboard(content: string) {
  Clipboard.setString(content);
  Alert.alert('Copied!', `Copied: ${content}`);
}

export const Profile_DebugInfoScreen = () => {
  const styles = useStyles();

  const {
    onboardingSections,
    restartOnboardingSection,
    restartAllOnboardingSections,
  } = useOnboardingState();

  const {
    onboardForBeacons,
    revokeBeacons,
    deleteCollectedData,
    beaconsInfo,
    isConsentGranted,
    isBeaconsSupported,
    getPrivacyDashboardUrl,
    getPrivacyTermsUrl,
  } = useBeaconsState();
  const {resetDismissedGlobalMessages} = useGlobalMessagesState();
  const {userId} = useAuthState();
  const user = auth().currentUser;
  const [idToken, setIdToken] = useState<
    FirebaseAuthTypes.IdTokenResult | undefined
  >(undefined);

  const flexibleTransportDebugOverride = useFlexibleTransportDebugOverride();
  const flexibleTransportAccessModeDebugOverride = useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportAccessModeDebugOverride,
  );
  const flexibleTransportDirectModeDebugOverride = useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportDirectModeDebugOverride,
  );
  const flexibleTransportEgressModeDebugOverride = useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportEgressModeDebugOverride,
  );
  const fromTravelSearchToTicketDebugOverride =
    useFromTravelSearchToTicketDebugOverride();
  const fromTravelSearchToTicketForBoatDebugOverride =
    useFromTravelSearchToTicketForBoatDebugOverride();
  const vehiclesInMapDebugOverride = useVehiclesInMapDebugOverride();
  const cityBikesInMapDebugOverride = useCityBikesInMapDebugOverride();
  const carSharingInMapDebugOverride = useCarSharingInMapDebugOverride();
  const geofencingZonesDebugOverride = useGeofencingZonesDebugOverride();
  const shmoDeepIntegrationDebugOverride =
    useShmoDeepIntegrationDebugOverride();

  const realtimeMapDebugOverride = useRealtimeMapDebugOverride();
  const ticketingAssistantOverride = useTicketingAssistantDebugOverride();
  const tipsAndInformationOverride = useTipsAndInformationDebugOverride();
  const nonTransitTripSearchOverride = useNonTransitTripSearchDebugOverride();
  const showValidTimeInfoDebugOverride = useShowValidTimeInfoDebugOverride();
  const loadingScreenEnabledDebugOverride =
    useLoadingScreenEnabledDebugOverride();
  const loadingErrorScreenEnabledDebugOverride =
    useLoadingErrorScreenEnabledDebugOverride();
  const beaconsEnabledDebugOverride = useBeaconsEnabledDebugOverride();
  const parkingViolationsReportingEnabledDebugOverride =
    useParkingViolationsReportingEnabledDebugOverride();
  const {resetDismissedAnnouncements} = useAnnouncementsState();
  const pushNotificationsEnabledDebugOverride =
    usePushNotificationsEnabledDebugOverride();
  const onBehalfOfEnabledDebugOverride = useOnBehalfOfEnabledDebugOverride();
  const ticketInformationEnabledDebugOverride =
    useTicketInformationEnabledDebugOverride();
  const posthogEnabledDebugOverride = usePosthogEnabledDebugOverride();
  const serverTimeEnabledDebugOverride = useServerTimeEnabledDebugOverride();
  const activateTicketNowEnabledDebugOverride =
    useActivateTicketNowEnabledDebugOverride();
  const backendSmsAuthEnabledDebugOverride =
    useBackendSmsAuthEnabledDebugOverride();
  const onlyStopPlacesCheckboxEnabledDebugOverride =
    useOnlyStopPlacesCheckboxEnabledDebugOverride();
  const travelAidEnabledDebugOverride = useIsTravelAidEnabledDebugOverride();
  const travelAidStopButtonEnabledDebugOverride =
    useIsTravelAidStopButtonEnabledDebugOverride();

  useEffect(() => {
    (async function () {
      const idToken = await user?.getIdTokenResult();
      setIdToken(idToken);
    })();
  }, [user]);

  const {
    tokens,
    retry,
    mobileTokenStatus,
    isInspectable,
    nativeToken,
    debug: {
      nativeTokenStatus,
      remoteTokensStatus,
      validateToken,
      removeRemoteToken,
      renewToken,
      wipeToken,
    },
  } = useMobileTokenContextState();
  const {serverNow} = useTimeContextState();

  const {
    fcmToken,
    permissionStatus: pushNotificationPermissionStatus,
    register: registerNotifications,
    requestPermissions: requestPushNotificationPermissions,
    checkPermissions: checkPushNotificationPermissions,
  } = useNotifications();

  const remoteConfig = useRemoteConfig();

  const [storedValues, setStoredValues] = useState<
    readonly KeyValuePair[] | null
  >(null);

  useEffect(() => {
    storage.getAll().then(setStoredValues);
  }, []);

  function copyFirestoreLink() {
    if (userId)
      setClipboard(
        `https://console.firebase.google.com/u/1/project/atb-mobility-platform-staging/firestore/data/~2Fcustomers~2F${userId}`,
      );
  }

  const {setPreference, preferences} = usePreferences();
  const {showTestIds, debugShowSeconds} = preferences;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title="Debug info"
        leftButton={{type: 'back'}}
        rightButton={{type: 'chat'}}
      />
      <ScrollView testID="debugInfoScrollView">
        <Section style={styles.section}>
          <ButtonSectionItem
            label="Restart all onboarding sections"
            onPress={() => restartAllOnboardingSections()}
          />
          <ExpandableSectionItem
            text="Individual onboarding restarts"
            showIconText={true}
            expandContent={onboardingSections.map((onboardingSection) => {
              const {onboardingSectionId} = onboardingSection;
              return (
                <ButtonSectionItem
                  key={onboardingSectionId}
                  label={`Restart ${onboardingSectionId} onboarding`}
                  onPress={() => restartOnboardingSection(onboardingSectionId)}
                />
              );
            })}
          />
        </Section>
        <Section style={styles.section}>
          <LinkSectionItem
            text="Reset shareTravelHabits session counter"
            onPress={() => storage.set(shareTravelHabitsSessionCountKey, '0')}
          />
          <ToggleSectionItem
            text="Toggle test-ID"
            value={showTestIds}
            onValueChange={(showTestIds) => {
              setPreference({showTestIds});
            }}
          />
          <ToggleSectionItem
            text="Display seconds in trip planner"
            value={debugShowSeconds}
            onValueChange={(debugShowSeconds) => {
              setPreference({debugShowSeconds});
            }}
          />
          <LinkSectionItem
            text="Send test Bugsnag report (name/message)"
            onPress={() =>
              Bugsnag.notify({
                name: 'DEBUG_TEST_ERROR',
                message: 'This is a test error',
              })
            }
            subtitle='{"name":"DEBUG_TEST_ERROR","message":"This is a test error"}'
          />
          <LinkSectionItem
            text="Send test Bugsnag report (JS error)"
            onPress={() => {
              try {
                ('' as unknown as any).DEBUG_TEST_ERROR();
              } catch (e: any) {
                Bugsnag.notify(e);
              }
            }}
            subtitle="TypeError: ''.DEBUG_TEST_ERROR is not a function (it is undefined)"
          />
          <LinkSectionItem
            text="Reset dismissed Global messages"
            onPress={resetDismissedGlobalMessages}
          />
          <LinkSectionItem
            text="Reset dismissed Announcements"
            onPress={resetDismissedAnnouncements}
          />
          <LinkSectionItem
            text="Copy link to customer in Firestore (staging)"
            icon="arrow-upleft"
            onPress={() => copyFirestoreLink()}
          />

          <LinkSectionItem
            text="Force refresh id token"
            onPress={() => auth().currentUser?.getIdToken(true)}
          />

          <LinkSectionItem
            text="Force refresh remote config"
            onPress={remoteConfig.refresh}
          />

          <LinkSectionItem
            text="Reset feedback displayStats"
            onPress={() => storage.set('@ATB_feedback_display_stats', '')}
          />

          <LinkSectionItem
            text="Reset frontpage favourite departures"
            onPress={() => storage.set('@ATB_user_frontpage_departures', '[]')}
          />

          <LinkSectionItem
            text="Reset user map filters"
            onPress={() => storage.set('@ATB_user_map_filters', '')}
          />

          <LinkSectionItem
            text="Reset travel search filters"
            onPress={() =>
              storage.set('@ATB_user_travel_search_filters_v2', '')
            }
          />
          <LinkSectionItem
            text="Reset one time popovers"
            onPress={() => storage.remove(StorageModelKeysEnum.OneTimePopOver)}
          />
        </Section>
        <Section style={styles.section}>
          <HeaderSectionItem
            text="Remote config override"
            subtitle="If undefined the value
        from Remote Config will be used. Needs reload of app after change."
          />
          <GenericSectionItem>
            <DebugOverride
              description="Flexible transport enabled"
              override={flexibleTransportDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Use Flexible on AccessMode"
              override={flexibleTransportAccessModeDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Use Flexible on DirectMode"
              override={flexibleTransportDirectModeDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Use Flexible on EgressMode"
              override={flexibleTransportEgressModeDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable from travel search to ticket purchase."
              override={fromTravelSearchToTicketDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable from travel search to ticket purchase specifically for boats."
              override={fromTravelSearchToTicketForBoatDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable vehicles in map."
              override={vehiclesInMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable city bike stations in map."
              override={cityBikesInMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable car sharing in map."
              override={carSharingInMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable geofencing zones"
              override={geofencingZonesDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable shared mobility deep integration"
              override={shmoDeepIntegrationDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable realtime positions in map."
              override={realtimeMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable ticketing assistant"
              override={ticketingAssistantOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable tips and information for tickets"
              override={tipsAndInformationOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable non-transit trip search"
              override={nonTransitTripSearchOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Shows valid time info in ticket details"
              override={showValidTimeInfoDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable loading screen on app startup and user change"
              override={loadingScreenEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable loading error screen on app startup and user change"
              override={loadingErrorScreenEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable beacons"
              override={beaconsEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable parking violations reporting"
              override={parkingViolationsReportingEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable push notifications"
              override={pushNotificationsEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable onBehalfOf"
              override={onBehalfOfEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable ticket information"
              override={ticketInformationEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable PostHog"
              override={posthogEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable server time"
              override={serverTimeEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable activate ticket now"
              override={activateTicketNowEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable new backend sms auth"
              override={backendSmsAuthEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable only stop places checkbox"
              override={onlyStopPlacesCheckboxEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable travel aid feature"
              override={travelAidEnabledDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable travel aid stop button"
              override={travelAidStopButtonEnabledDebugOverride}
            />
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Firebase Auth user info"
            showIconText={true}
            expandContent={
              <View>
                {Object.entries(user?.toJSON() ?? {}).map(([key, value]) => (
                  <MapEntry key={key} title={key} value={value} />
                ))}
              </View>
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Firebase Auth user claims"
            showIconText={true}
            expandContent={
              <View>
                {!!idToken ? (
                  Object.entries(idToken).map(([key, value]) => (
                    <MapEntry key={key} title={key} value={value} />
                  ))
                ) : (
                  <ThemeText>No id token</ThemeText>
                )}
              </View>
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Remote config"
            showIconText={true}
            expandContent={
              remoteConfig && (
                <View>
                  {Object.keys(remoteConfig).map((key) => (
                    <MapEntry
                      key={key}
                      title={key}
                      value={
                        remoteConfig[key as keyof RemoteConfigContextState]
                      }
                    />
                  ))}
                </View>
              )
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Notifications"
            showIconText={true}
            expandContent={
              <>
                <ThemeText>
                  Notification status: {pushNotificationPermissionStatus}
                </ThemeText>
                <Button
                  style={styles.button}
                  onPress={requestPushNotificationPermissions}
                  text="Request permissions"
                />
                <Button
                  style={styles.button}
                  onPress={checkPushNotificationPermissions}
                  text="Check permissions"
                />
                <Button
                  style={styles.button}
                  onPress={() =>
                    registerNotifications(
                      pushNotificationPermissionStatus === 'granted',
                    )
                  }
                  text="Register"
                />
                <ThemeText selectable={true}>FCM Token: {fcmToken}</ThemeText>
              </>
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Storage"
            showIconText={true}
            expandContent={
              <>
                <View>
                  <MapEntry title="app_group_name" value={APP_GROUP_NAME} />
                </View>
                {storedValues && (
                  <View>
                    {storedValues.map(([key, value]) => (
                      <MapEntry key={key} title={key} value={value} />
                    ))}
                  </View>
                )}
              </>
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Preferences"
            showIconText={true}
            expandContent={
              preferences && (
                <View>
                  <ThemeText type="body__secondary">
                    Press a line to reset to undefined {'\n'}
                  </ThemeText>
                  {Object.keys(preferences).map((key) => (
                    <PressableOpacity
                      key={key}
                      onPress={() => setPreference({[key]: undefined})}
                    >
                      <MapEntry
                        title={key}
                        value={preferences[key as keyof UserPreferences]}
                      />
                    </PressableOpacity>
                  ))}
                </View>
              )
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Mobile token state"
            showIconText={true}
            expandContent={
              <View>
                {nativeToken && (
                  <View>
                    <ThemeText>{`Token id: ${nativeToken.getTokenId()}`}</ThemeText>
                    <ThemeText>{`Token start: ${new Date(
                      nativeToken.getValidityStart(),
                    ).toISOString()}`}</ThemeText>
                    <ThemeText>{`Token end: ${new Date(
                      nativeToken.getValidityEnd(),
                    ).toISOString()}`}</ThemeText>
                  </View>
                )}
                <ThemeText>{`Mobile token status: ${mobileTokenStatus}`}</ThemeText>
                <ThemeText>{`IsInspectable: ${isInspectable}`}</ThemeText>
                <ThemeText>{`Native token status: ${nativeTokenStatus}`}</ThemeText>
                <ThemeText>{`Remote tokens status: ${remoteTokensStatus}`}</ThemeText>
                <ThemeText>{`Now: ${new Date(
                  serverNow,
                ).toISOString()}`}</ThemeText>
                <Button
                  style={styles.button}
                  text="Reload token(s)"
                  onPress={retry}
                />
                {nativeToken && (
                  <Button
                    style={styles.button}
                    text="Wipe token"
                    onPress={wipeToken}
                  />
                )}
                {nativeToken && (
                  <Button
                    style={styles.button}
                    text="Validate token"
                    onPress={validateToken}
                  />
                )}
                {nativeToken && (
                  <Button
                    style={styles.button}
                    text="Renew token"
                    onPress={renewToken}
                  />
                )}
                <ExpandableSectionItem
                  text="Remote tokens"
                  showIconText={true}
                  expandContent={tokens?.map((token) => (
                    <View key={token.id} style={styles.remoteToken}>
                      {keys(token).map((k) => (
                        <ThemeText key={token.id + k}>
                          {k + ': ' + JSON.stringify(get(token, k))}
                        </ThemeText>
                      ))}
                      <Button
                        onPress={() => removeRemoteToken(token.id)}
                        text="Remove"
                      />
                    </View>
                  ))}
                />
              </View>
            }
          />
        </Section>

        {isBeaconsSupported && (
          <Section style={styles.section}>
            <ExpandableSectionItem
              text="Beacons"
              showIconText={true}
              expandContent={
                <View>
                  <View>
                    <ThemeText>{`Identifier: ${
                      beaconsInfo?.identifier ?? 'N/A'
                    }`}</ThemeText>
                    <ThemeText>{`Status: ${
                      beaconsInfo?.isStarted ? 'Running' : 'Not running'
                    }`}</ThemeText>
                    <ThemeText>{`Granted consents: ${
                      beaconsInfo?.consents ?? 'N/A'
                    }`}</ThemeText>
                  </View>
                  <Button
                    interactiveColor="interactive_0"
                    onPress={async () => {
                      const granted = await onboardForBeacons(true);
                      Alert.alert('Onboarding', `Access granted: ${granted}`);
                    }}
                    disabled={isConsentGranted}
                    style={styles.button}
                    text="Onboard and give consent"
                  />
                  <Button
                    interactiveColor="interactive_0"
                    onPress={async () => {
                      await revokeBeacons();
                    }}
                    style={styles.button}
                    disabled={!isConsentGranted}
                    text="Revoke"
                  />
                  <Button
                    interactiveColor="interactive_0"
                    onPress={async () => {
                      await deleteCollectedData();
                    }}
                    style={styles.button}
                    text="Delete Collected Data"
                  />
                  <Button
                    interactiveColor="interactive_0"
                    onPress={async () => {
                      const privacyDashboardUrl =
                        await getPrivacyDashboardUrl();
                      privacyDashboardUrl &&
                        Linking.openURL(privacyDashboardUrl);
                    }}
                    style={styles.button}
                    disabled={!isConsentGranted}
                    text="Open Privacy Dashboard"
                  />
                  <Button
                    interactiveColor="interactive_0"
                    onPress={async () => {
                      const privacyTermsUrl = await getPrivacyTermsUrl();
                      privacyTermsUrl && Linking.openURL(privacyTermsUrl);
                    }}
                    style={styles.button}
                    disabled={!isConsentGranted}
                    text="Open Privacy Terms"
                  />
                </View>
              }
            />
          </Section>
        )}
      </ScrollView>
    </View>
  );
};

function MapValue({value}: {value: any}) {
  if (value === undefined) {
    return <ThemeText>undefined</ThemeText>;
  }

  if (value === null) {
    return <ThemeText>null</ThemeText>;
  }

  const type = typeof value;

  switch (type) {
    case 'string':
      return (
        <ThemeText testID="debugValue" onPress={() => setClipboard(value)}>
          {value}
        </ThemeText>
      );
    case 'object':
      const entries = Object.entries(value);
      return (
        <View style={{flexDirection: 'column'}}>
          {entries.length ? (
            Object.entries(value).map(([key, value]) => (
              <MapEntry key={key} title={key} value={value} />
            ))
          ) : (
            <ThemeText color="secondary">Empty object</ThemeText>
          )}
        </View>
      );
    default:
      const stringified = value.toString();
      return (
        <ThemeText onPress={() => setClipboard(stringified)}>
          {stringified}
        </ThemeText>
      );
  }
}

function MapEntry({title, value}: {title: string; value: any}) {
  const styles = useStyles();
  const isLongString =
    !!value && typeof value === 'string' && value.length > 300;
  const [isExpanded, setIsExpanded] = useState<boolean>(!isLongString);

  if (!!value && typeof value === 'object') {
    return (
      <View key={title} style={styles.objectEntry}>
        <PressableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemeText type="heading__title" color="secondary">
            {title}
          </ThemeText>
          <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
        </PressableOpacity>
        {isExpanded && <MapValue value={value} />}
      </View>
    );
  } else {
    return (
      <View
        key={title}
        style={{flexDirection: 'row', flexWrap: 'wrap'}}
        testID={title === 'user_id' ? 'userId' : ''}
      >
        {isLongString ? (
          <PressableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <ThemeText type="body__primary--bold">{title}: </ThemeText>
            <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
          </PressableOpacity>
        ) : (
          <ThemeText type="body__primary--bold">{title}: </ThemeText>
        )}
        {isExpanded && <MapValue value={value} />}
      </View>
    );
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  section: {
    marginTop: theme.spacings.large,
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
  },
  buttons: {
    marginHorizontal: theme.spacings.medium,
  },
  button: {
    marginVertical: theme.spacings.small,
  },
  remoteToken: {
    marginBottom: theme.spacings.large,
  },
  objectEntry: {
    flexDirection: 'column',
    marginVertical: 12,
    borderLeftColor: theme.text.colors.secondary,
    borderLeftWidth: 1,
    paddingLeft: 4,
  },
}));
