import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuthContext} from '@atb/auth';
import {KeyValuePair, storage, StorageModelKeysEnum} from '@atb/storage';
import {useMobileTokenContext} from '@atb/mobile-token';
import {usePreferencesContext, UserPreferences} from '@atb/preferences';
import {get, keys} from 'lodash';
import {Button} from '@atb/components/button';
import {
  RemoteConfigContextState,
  useRemoteConfigContext,
} from '@atb/RemoteConfigContext';
import {useGlobalMessagesContext} from '@atb/global-messages';
import {APP_GROUP_NAME} from '@env';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
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
import {shareTravelHabitsSessionCountKey} from '@atb/beacons/use-should-show-share-travel-habits-screen';

import {useAnnouncementsContext} from '@atb/announcements';
import {useNotificationsContext} from '@atb/notifications';
import {useTimeContext} from '@atb/time';
import {useBeaconsContext} from '@atb/beacons/BeaconsContext';
import {useOnboardingContext} from '@atb/onboarding';
import Bugsnag from '@bugsnag/react-native';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {DebugSabotage} from '@atb/mobile-token/DebugSabotage';

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
      setSabotage,
      sabotage,
    },
  } = useMobileTokenContext();
  const {serverNow} = useTimeContext();

  const {
    fcmToken,
    permissionStatus: pushNotificationPermissionStatus,
    register: registerNotifications,
    requestPermissions: requestPushNotificationPermissions,
    checkPermissions: checkPushNotificationPermissions,
  } = useNotificationsContext();

  const remoteConfig = useRemoteConfigContext();

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

  const {setPreference, preferences} = usePreferencesContext();
  const {showTestIds, debugShowSeconds, debugPredictionInaccurate} =
    preferences;

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
            icon="arrow-upleft"
            onPress={() => copyFirestoreLink()}
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
          <ExpandableSectionItem
            text="Feature toggle overrides"
            showIconText={true}
            expandContent={
              <View>
                {overrides.map((o) => (
                  <GenericSectionItem key={o.name}>
                    <DebugOverride
                      description={`Override for '${o.name}'`}
                      overrideVal={o.value}
                      setOverride={(v) => setOverride(o.name, v)}
                    />
                  </GenericSectionItem>
                ))}
              </View>
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
                  <ThemeText typography="body__secondary">
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
                <ExpandableSectionItem
                  text="Sabotage Tokens"
                  showIconText={true}
                  expandContent={
                    <View>
                      <DebugSabotage sabotage={sabotage} setSabotage={setSabotage}/>
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
                    interactiveColor={interactiveColor}
                    onPress={async () => {
                      await revokeBeacons();
                    }}
                    style={styles.button}
                    disabled={!isConsentGranted}
                    text="Revoke"
                  />
                  <Button
                    interactiveColor={interactiveColor}
                    onPress={async () => {
                      await deleteCollectedData();
                    }}
                    style={styles.button}
                    text="Delete Collected Data"
                  />
                  <Button
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

  if (!!value && typeof value === 'object') {
    return (
      <View key={title} style={styles.objectEntry}>
        <PressableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemeText typography="heading__title" color="secondary">
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
            <ThemeText typography="body__primary--bold">{title}: </ThemeText>
            <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
          </PressableOpacity>
        ) : (
          <ThemeText typography="body__primary--bold">{title}: </ThemeText>
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
    marginVertical: 12,
    borderLeftColor: theme.color.foreground.dynamic.secondary,
    borderLeftWidth: 1,
    paddingLeft: 4,
  },
}));
