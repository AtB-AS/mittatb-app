import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuthState} from '@atb/auth';
import {useAppDispatch, useAppState} from '@atb/AppContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import storage, {KeyValuePair, StorageModelKeysEnum} from '@atb/storage';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import Slider from '@react-native-community/slider';
import {usePreferences, UserPreferences} from '@atb/preferences';
import {get, keys} from 'lodash';
import Button from '@atb/components/button';
import {
  RemoteConfigContextState,
  useRemoteConfig,
} from '@atb/RemoteConfigContext';
import {useGlobalMessagesState} from '@atb/global-messages';
import ThemeIcon from '@atb/components/theme-icon';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import RadioSegments from '@atb/components/radio-segments';
import {useTravelSearchFiltersDebugOverride} from '@atb/screens/Dashboard/use-travel-search-filters-enabled';

function setClipboard(content: string) {
  Clipboard.setString(content);
  Alert.alert('Copied!', `Copied: ${content}`);
}

export default function DebugInfo() {
  const style = useProfileHomeStyle();
  const appDispatch = useAppDispatch();
  const {restartMobileTokenOnboarding} = useAppState();
  const {resetDismissedGlobalMessages} = useGlobalMessagesState();
  const {user, abtCustomerId} = useAuthState();
  const [idToken, setIdToken] = useState<
    FirebaseAuthTypes.IdTokenResult | undefined
  >(undefined);

  const [travelSearchFilterOverride, setTravelSearchFilterOverride] =
    useTravelSearchFiltersDebugOverride();

  useEffect(() => {
    async function run() {
      if (!!user) {
        const idToken = await user.getIdTokenResult();
        setIdToken(idToken);
      } else {
        setIdToken(undefined);
      }
    }

    run();
  }, [user]);

  const {
    token,
    remoteTokens,
    retry,
    createToken,
    wipeToken,
    validateToken,
    removeRemoteToken,
    renewToken,
    fallbackEnabled,
    isLoading,
    isError,
  } = useMobileTokenContextState();

  const remoteConfig = useRemoteConfig();

  const mobileTokenEnabled = useHasEnabledMobileToken();

  const [storedValues, setStoredValues] = useState<
    readonly KeyValuePair[] | null
  >(null);

  useEffect(() => {
    storage.getAll().then(setStoredValues);
  }, []);

  function copyFirestoreLink() {
    if (abtCustomerId)
      setClipboard(
        `https://console.firebase.google.com/u/1/project/atb-mobility-platform-staging/firestore/data/~2Fcustomers~2F${abtCustomerId}`,
      );
  }

  const {setPreference, preferences} = usePreferences();
  const {showTestIds, tripSearchPreferences} = preferences;

  const tripSearchDefaults = {
    transferPenalty: 10,
    waitReluctance: 1.5,
    walkReluctance: 1.5,
    walkSpeed: 1.3,
  };

  return (
    <View style={style.container}>
      <FullScreenHeader
        title="Debug info"
        leftButton={{type: 'back'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView testID="debugInfoScrollView">
        <Sections.Section withPadding withTopPadding>
          <Sections.ActionItem
            mode="toggle"
            text="Toggle test-ID"
            checked={showTestIds}
            onPress={(showTestIds) => {
              setPreference({showTestIds});
            }}
          />
          <Sections.LinkItem
            text="Restart onboarding"
            onPress={() => {
              appDispatch({type: 'RESTART_ONBOARDING'});
            }}
          />
          <Sections.LinkItem
            text="Set mobile token onboarded to false"
            onPress={restartMobileTokenOnboarding}
          />
          <Sections.LinkItem
            text="Reset dismissed Global messages"
            onPress={resetDismissedGlobalMessages}
          />
          <Sections.LinkItem
            text="Copy link to customer in Firestore (staging)"
            icon="arrow-upleft"
            onPress={() => copyFirestoreLink()}
          />

          <Sections.LinkItem
            text="Force refresh id token"
            onPress={() => auth().currentUser?.getIdToken(true)}
          />

          <Sections.LinkItem
            text="Force refresh remote config"
            onPress={remoteConfig.refresh}
          />

          <Sections.LinkItem
            text="Reset feedback displayStats"
            onPress={() => storage.set('@ATB_feedback_display_stats', '')}
          />

          <Sections.LinkItem
            text="Reset frontpage favourite departures"
            onPress={() => storage.set('@ATB_user_frontpage_departures', '[]')}
          />

          <Sections.LinkItem
            text="Reset has read departures v2 onboarding"
            onPress={() =>
              storage.set(
                StorageModelKeysEnum.HasReadDeparturesV2Onboarding,
                JSON.stringify(false),
              )
            }
          />

          <Sections.GenericItem>
            <ThemeText>
              Debug override for enable travel search filter. If undefined the
              value from Remote Config will be used. Needs reload of app after
              change.
            </ThemeText>
            <RadioSegments
              activeIndex={
                travelSearchFilterOverride
                  ? 0
                  : travelSearchFilterOverride === undefined
                  ? 1
                  : 2
              }
              color="interactive_2"
              style={{marginTop: 8}}
              options={[
                {
                  text: 'True',
                  onPress: () => setTravelSearchFilterOverride(true),
                },
                {
                  text: 'Undefined',
                  onPress: () => setTravelSearchFilterOverride(undefined),
                },
                {
                  text: 'False',
                  onPress: () => setTravelSearchFilterOverride(false),
                },
              ]}
            />
          </Sections.GenericItem>
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text={'Trip search parameters'}
            showIconText={true}
            expandContent={
              <View>
                <ThemeText type="body__secondary" color="secondary">
                  Press labels to reset to default
                </ThemeText>
                <LabeledSlider
                  max={50}
                  label="transferPenalty"
                  defaultValue={tripSearchDefaults.transferPenalty}
                  initialValue={tripSearchPreferences?.transferPenalty}
                  step={1}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        transferPenalty: n,
                      },
                    });
                  }}
                />
                <LabeledSlider
                  max={5}
                  label="waitReluctance"
                  defaultValue={tripSearchDefaults.waitReluctance}
                  initialValue={tripSearchPreferences?.waitReluctance}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        waitReluctance: n,
                      },
                    });
                  }}
                />
                <LabeledSlider
                  max={5}
                  label="walkReluctance"
                  defaultValue={tripSearchDefaults.walkReluctance}
                  initialValue={tripSearchPreferences?.walkReluctance}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        walkReluctance: n,
                      },
                    });
                  }}
                />
                <LabeledSlider
                  max={5}
                  label="walkSpeed"
                  defaultValue={tripSearchDefaults.walkSpeed}
                  initialValue={tripSearchPreferences?.walkSpeed}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        walkSpeed: n,
                      },
                    });
                  }}
                />
              </View>
            }
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text="Firebase Auth user info"
            showIconText={true}
            expandContent={
              <View>
                {Object.entries(user?.toJSON() ?? {}).map(([key, value]) => (
                  <MapEntry title={key} value={value} />
                ))}
              </View>
            }
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text="Firebase Auth user claims"
            showIconText={true}
            expandContent={
              <View>
                {!!idToken ? (
                  Object.entries(idToken).map(([key, value]) => (
                    <MapEntry title={key} value={value} />
                  ))
                ) : (
                  <ThemeText>No id token</ThemeText>
                )}
              </View>
            }
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text="Remote config"
            showIconText={true}
            expandContent={
              remoteConfig && (
                <View>
                  {Object.keys(remoteConfig).map((key) => (
                    <MapEntry
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
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text="Storage"
            showIconText={true}
            expandContent={
              storedValues && (
                <View>
                  {storedValues.map(([key, value]) => (
                    <MapEntry title={key} value={value} />
                  ))}
                </View>
              )
            }
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text="Preferences"
            showIconText={true}
            expandContent={
              preferences && (
                <View>
                  <ThemeText type="body__secondary">
                    Press a line to reset to undefined {'\n'}
                  </ThemeText>
                  {Object.keys(preferences).map((key) => (
                    <TouchableOpacity
                      onPress={() => setPreference({[key]: undefined})}
                    >
                      <MapEntry
                        title={key}
                        value={preferences[key as keyof UserPreferences]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )
            }
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ExpandableItem
            text="Mobile token state"
            showIconText={true}
            expandContent={
              mobileTokenEnabled ? (
                <View>
                  {token && (
                    <View>
                      <ThemeText>{`Token id: ${token.getTokenId()}`}</ThemeText>
                      <ThemeText>{`Token start: ${new Date(
                        token.getValidityStart(),
                      ).toISOString()}`}</ThemeText>
                      <ThemeText>{`Token end: ${new Date(
                        token.getValidityEnd(),
                      ).toISOString()}`}</ThemeText>
                    </View>
                  )}
                  <ThemeText>{`Fallback enabled: ${fallbackEnabled}`}</ThemeText>
                  <ThemeText>{`Is loading: ${isLoading}`}</ThemeText>
                  <ThemeText>{`Is error: ${isError}`}</ThemeText>
                  <Button
                    style={style.button}
                    text="Reload token(s)"
                    onPress={retry}
                  />
                  <Button
                    style={style.button}
                    text="Create token"
                    onPress={createToken}
                  />
                  {token && (
                    <Button
                      style={style.button}
                      text="Wipe token"
                      onPress={wipeToken}
                    />
                  )}
                  {token && (
                    <Button
                      style={style.button}
                      text="Validate token"
                      onPress={validateToken}
                    />
                  )}
                  {token && (
                    <Button
                      style={style.button}
                      text="Renew token"
                      onPress={renewToken}
                    />
                  )}
                  <Sections.ExpandableItem
                    text="Remote tokens"
                    showIconText={true}
                    expandContent={remoteTokens?.map((token) => (
                      <View key={token.id} style={style.remoteToken}>
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
              ) : (
                <ThemeText>Mobile token not enabled</ThemeText>
              )
            }
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
}

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
              <MapEntry title={key} value={value} />
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
  const styles = useProfileHomeStyle();
  const isLongString =
    !!value && typeof value === 'string' && value.length > 300;
  const [isExpanded, setIsExpanded] = useState<boolean>(
    isLongString ? false : true,
  );

  if (!!value && typeof value === 'object') {
    return (
      <View key={title} style={styles.objectEntry}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemeText type="heading__title" color="secondary">
            {title}
          </ThemeText>
          <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
        </TouchableOpacity>
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
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <ThemeText type="body__primary--bold">{title}: </ThemeText>
            <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
          </TouchableOpacity>
        ) : (
          <ThemeText type="body__primary--bold">{title}: </ThemeText>
        )}
        {isExpanded && <MapValue value={value} />}
      </View>
    );
  }
}
//TODO gå inn i mapValue() over og sett testID på verdien av userId -> deretter test på denne i account.e2e.ts
function LabeledSlider({
  label,
  min = 0,
  max,
  step = 0.1,
  defaultValue,
  initialValue,
  onSetValue,
}: {
  label: string;
  min?: number;
  max: number;
  step?: number;
  defaultValue?: number;
  initialValue?: number;
  onSetValue: (n: number) => void;
}): JSX.Element {
  const [pref, setPref] = useState(initialValue || defaultValue);

  return (
    <Sections.GenericItem>
      <ThemeText
        onPress={
          defaultValue
            ? () => {
                onSetValue(defaultValue);
                setPref(defaultValue);
              }
            : undefined
        }
      >
        {label}: {pref?.toFixed(1)}
      </ThemeText>
      <Slider
        style={{width: '100%'}}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={pref}
        onValueChange={setPref}
        onSlidingComplete={onSetValue}
      />
    </Sections.GenericItem>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
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
