import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {getIdTokenGlobal, useAuthContext} from '@atb/modules/auth';
import {KeyValuePair, storage} from '@atb/modules/storage';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {usePreferencesContext, UserPreferences} from '@atb/modules/preferences';
import {get, keys} from 'lodash';
import {Button} from '@atb/components/button';
import {
  RemoteConfigContextState,
  useRemoteConfigContext,
} from '@atb/modules/remote-config';
import {useGlobalMessagesContext} from '@atb/modules/global-messages';
import {APP_GROUP_NAME} from '@env';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  ArrowUpLeft,
  ExpandLess,
  ExpandMore,
} from '@atb/assets/svg/mono-icons/navigation';
import {DebugOverride} from './components/DebugOverride';
import {
  ButtonSectionItem,
  ExpandableSectionItem,
  GenericSectionItem,
  LinkSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {shareTravelHabitsSessionCountKey} from '@atb/modules/beacons';
import {useAnnouncementsContext} from '@atb/modules/announcements';
import {useNotificationsContext} from '@atb/modules/notifications';
import {useTimeContext} from '@atb/modules/time';
import {useBeaconsContext} from '@atb/modules/beacons';
import {useOnboardingContext} from '@atb/modules/onboarding';
import Bugsnag from '@bugsnag/react-native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  DebugSabotage,
  DebugTokenServerAddress,
} from '@atb/modules/mobile-token';
import {useMapContext} from '@atb/modules/map';
import {useEventStreamContext} from '@atb/modules/event-stream';
import {format} from 'date-fns';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useQueryClient} from '@tanstack/react-query';
import {useDebugUserInfoHeader} from '@atb/api';

function setClipboard(content: string) {
  Clipboard.setString(content);
  Alert.alert('Copied!', `Copied: ${content}`);
}

export const Profile_DebugInfoScreen = () => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];

  const {
    onboardingSections,
    restartOnboardingSection,
    restartAllOnboardingSections,
  } = useOnboardingContext();

  const {
    onboardForBeacons,
    revokeBeacons,
    deleteCollectedData,
    beaconsInfo,
    isConsentGranted,
    isBeaconsSupported,
    getPrivacyDashboardUrl,
    getPrivacyTermsUrl,
  } = useBeaconsContext();
  const {resetDismissedGlobalMessages} = useGlobalMessagesContext();
  const {
    userId,
    retryAuth,
    debug: {user, idTokenResult},
  } = useAuthContext();

  const {
    debug: {overrides, setOverride},
  } = useFeatureTogglesContext();

  const {resetDismissedAnnouncements} = useAnnouncementsContext();

  const {eventLog} = useEventStreamContext();

  const {
    tokens,
    retry,
    mobileTokenStatus,
    isInspectable,
    nativeToken,
    debug: {
      nativeTokenStatus,
      remoteTokensStatus,
      createToken: initToken,
      removeRemoteToken,
      renewToken,
      wipeToken,
      nativeTokenError,
      remoteTokenError,
      setSabotage,
      sabotage,
      setAllTokenInspectable,
      allTokenInspectable,
    },
  } = useMobileTokenContext();
  const {serverNow} = useTimeContext();
  const serverTimeOffset = useMemo(() => Date.now() - serverNow, [serverNow]);
  const {setGivenShmoConsent} = useMapContext();
  const {
    fcmToken,
    permissionStatus: pushNotificationPermissionStatus,
    register: registerNotifications,
    requestPermissions: requestPushNotificationPermissions,
    checkPermissions: checkPushNotificationPermissions,
  } = useNotificationsContext();

  const remoteConfig = useRemoteConfigContext();

  const {resubscribeFirestoreConfig} = useFirestoreConfigurationContext();

  const queryClient = useQueryClient();

  const {shouldAddHeader, setShouldAddHeader} = useDebugUserInfoHeader();

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
  function copyIdToken() {
    const idToken = getIdTokenGlobal();
    if (idToken) setClipboard(idToken);
  }

  const {setPreference, preferences} = usePreferencesContext();
  const {
    showTestIds,
    debugShowSeconds,
    debugPredictionInaccurate,
    debugShowProgressBetweenStops,
  } = preferences;

  return (
    <View style={styles.container}>
      <FullScreenHeader title="Debug info" leftButton={{type: 'back'}} />
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
          <GenericSectionItem>
            <ThemeText>{`Device is ${serverTimeOffset}ms ahead of server time`}</ThemeText>
          </GenericSectionItem>
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
          <ToggleSectionItem
            text="Display percentage between stops in departure details"
            value={debugShowProgressBetweenStops}
            onValueChange={(debugShowProgressBetweenStops) => {
              setPreference({debugShowProgressBetweenStops});
            }}
          />
          <ToggleSectionItem
            text="Add debug user info header"
            value={shouldAddHeader}
            onValueChange={(checked) => {
              setShouldAddHeader(checked);
            }}
          />
          <ToggleSectionItem
            text="Show prediction inaccurate info"
            value={debugPredictionInaccurate}
            onValueChange={(value) => {
              setPreference({debugPredictionInaccurate: value});
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
            rightIcon={{svg: ArrowUpLeft}}
            onPress={() => copyFirestoreLink()}
          />
          <LinkSectionItem
            text="Copy ID token"
            rightIcon={{svg: ArrowUpLeft}}
            onPress={() => copyIdToken()}
          />
          <LinkSectionItem
            text="Force refresh auth state"
            onPress={retryAuth}
          />

          <LinkSectionItem
            text="Force refresh remote config"
            onPress={remoteConfig.refresh}
          />

          <LinkSectionItem
            text="Force refresh firestore config"
            onPress={resubscribeFirestoreConfig}
          />

          <LinkSectionItem
            text="Force refresh all react-query caches"
            onPress={() => queryClient.resetQueries()}
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
            text="Reset scooter consent"
            onPress={() => setGivenShmoConsent(false)}
          />
        </Section>
        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Feature toggle overrides"
            showIconText={true}
            expandContent={
              <Section>
                {overrides.map((o) => (
                  <GenericSectionItem key={o.name}>
                    <DebugOverride
                      name={o.name}
                      overrideVal={o.value}
                      setOverride={(v) => setOverride(o.name, v)}
                    />
                  </GenericSectionItem>
                ))}
              </Section>
            }
          />
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
                {!!idTokenResult ? (
                  Object.entries(idTokenResult).map(([key, value]) => (
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
            text="Event stream log"
            showIconText={true}
            expandContent={
              <View>
                {eventLog.map((event) => (
                  <MapEntry
                    key={event.date.toISOString() + event.meta}
                    title={format(event.date, 'HH:mm:ss.SSS')}
                    value={{streamEvent: event.streamEvent, meta: event.meta}}
                  />
                ))}
              </View>
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
                  expanded={true}
                  style={styles.button}
                  onPress={requestPushNotificationPermissions}
                  text="Request permissions"
                />
                <Button
                  expanded={true}
                  style={styles.button}
                  onPress={checkPushNotificationPermissions}
                  text="Check permissions"
                />
                <Button
                  expanded={true}
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
                  <ThemeText typography="body__s">
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
            testID="mobileTokenDebug"
            expandContent={
              <View>
                {nativeToken && (
                  <View>
                    <ThemeText testID="tokenId">{`Token id: ${nativeToken.getTokenId()}`}</ThemeText>
                    <ThemeText>{`Token start: ${new Date(
                      nativeToken.getValidityStart(),
                    ).toISOString()}`}</ThemeText>
                    <ThemeText>{`Token end: ${new Date(
                      nativeToken.getValidityEnd(),
                    ).toISOString()}`}</ThemeText>
                    <ThemeText>{`Is native token attested: ${nativeToken.isAttested()}`}</ThemeText>
                    <ThemeText>{`Is attestation required: ${nativeToken.isAttestRequired()}`}</ThemeText>
                  </View>
                )}
                <ThemeText testID="tokenStatus">{`Mobile token status: ${mobileTokenStatus}`}</ThemeText>
                <ThemeText>{`IsInspectable: ${isInspectable}`}</ThemeText>
                <ThemeText>{`Override remote token inspectable: ${allTokenInspectable}`}</ThemeText>
                <ThemeText>{`Native token status: ${nativeTokenStatus}`}</ThemeText>
                <ThemeText>{`Native token error: ${nativeTokenError}`}</ThemeText>
                <ThemeText>{`Remote tokens status: ${remoteTokensStatus}`}</ThemeText>
                <ThemeText>{`Remote tokens error: ${remoteTokenError}`}</ThemeText>
                <ThemeText>{`Now: ${new Date(
                  serverNow,
                ).toISOString()}`}</ThemeText>
                <Button
                  expanded={true}
                  style={styles.button}
                  text="Create new token"
                  onPress={initToken}
                />
                <Button
                  expanded={true}
                  style={styles.button}
                  text="Reload token(s)"
                  onPress={retry}
                />
                {nativeToken && (
                  <Button
                    expanded={true}
                    style={styles.button}
                    text="Wipe token"
                    onPress={wipeToken}
                  />
                )}
                {nativeToken && (
                  <Button
                    expanded={true}
                    style={styles.button}
                    text="Renew token"
                    onPress={renewToken}
                  />
                )}
                <ExpandableSectionItem
                  text="Remote tokens"
                  showIconText={true}
                  testID="remoteTokenExpandable"
                  expandContent={tokens?.map((token, index) => (
                    <View key={token.id} style={styles.remoteToken}>
                      {keys(token).map((k) => (
                        <ThemeText key={token.id + k}>
                          {k + ': ' + JSON.stringify(get(token, k))}
                        </ThemeText>
                      ))}
                      <Button
                        expanded={true}
                        onPress={() => removeRemoteToken(token.id)}
                        text="Remove"
                        testID={`removeRemoteToken${index}`}
                      />
                    </View>
                  ))}
                />
                <ExpandableSectionItem
                  text="Sabotage Tokens"
                  showIconText={true}
                  expandContent={
                    <View>
                      <DebugSabotage
                        sabotage={sabotage}
                        setSabotage={setSabotage}
                      />
                    </View>
                  }
                />
                <ExpandableSectionItem
                  text="Remote Token Inspectability"
                  showIconText={true}
                  expandContent={
                    <View>
                      <Button
                        expanded={true}
                        style={styles.button}
                        text="Set no inspectable token"
                        onPress={() => setAllTokenInspectable(false)}
                      />
                      <Button
                        expanded={true}
                        style={styles.button}
                        text="Set all inspectable token"
                        onPress={() => setAllTokenInspectable(true)}
                      />
                      <Button
                        expanded={true}
                        style={styles.button}
                        text="Reset token inspectability to default"
                        onPress={() => setAllTokenInspectable(undefined)}
                      />
                    </View>
                  }
                />
                <ExpandableSectionItem
                  text="Modify Server Endpoint"
                  showIconText={true}
                  expandContent={
                    <View>
                      <DebugTokenServerAddress />
                    </View>
                  }
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
                    expanded={true}
                    interactiveColor={interactiveColor}
                    onPress={async () => {
                      const granted = await onboardForBeacons(true);
                      Alert.alert('Onboarding', `Access granted: ${granted}`);
                    }}
                    disabled={isConsentGranted}
                    style={styles.button}
                    text="Onboard and give consent"
                  />
                  <Button
                    expanded={true}
                    interactiveColor={interactiveColor}
                    onPress={async () => {
                      await revokeBeacons();
                    }}
                    style={styles.button}
                    disabled={!isConsentGranted}
                    text="Revoke"
                  />
                  <Button
                    expanded={true}
                    interactiveColor={interactiveColor}
                    onPress={async () => {
                      await deleteCollectedData();
                    }}
                    style={styles.button}
                    text="Delete Collected Data"
                  />
                  <Button
                    expanded={true}
                    interactiveColor={interactiveColor}
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
                    expanded={true}
                    interactiveColor={interactiveColor}
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
  if (value === undefined) return null;

  if (!!value && typeof value === 'object') {
    return (
      <View key={title} style={styles.objectEntry}>
        <PressableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemeText typography="heading__m" color="secondary">
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
            <ThemeText typography="body__m__strong">{title}: </ThemeText>
            <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
          </PressableOpacity>
        ) : (
          <ThemeText typography="body__m__strong">{title}: </ThemeText>
        )}
        {isExpanded && <MapValue value={value} />}
      </View>
    );
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  section: {
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  buttons: {
    marginHorizontal: theme.spacing.medium,
  },
  button: {
    marginVertical: theme.spacing.small,
  },
  remoteToken: {
    marginBottom: theme.spacing.large,
  },
  objectEntry: {
    flexDirection: 'column',
    marginVertical: 8,
    borderLeftColor: theme.color.foreground.dynamic.secondary,
    borderLeftWidth: 1,
    paddingLeft: 4,
  },
}));
