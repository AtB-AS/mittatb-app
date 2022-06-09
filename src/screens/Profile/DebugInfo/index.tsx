import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuthState} from '@atb/auth';
import {useAppDispatch} from '@atb/AppContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import storage from '@atb/storage';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import Slider from '@react-native-community/slider';
import {TripSearchPreferences, usePreferences} from '@atb/preferences';
import {get, keys} from 'lodash';
import {useNavigation} from '@react-navigation/native';

function setClipboard(content: string) {
  Clipboard.setString(content);
  Alert.alert('Copied!', `Copied: ${content}`);
}

export default function DebugInfo() {
  const style = useProfileHomeStyle();
  const appDispatch = useAppDispatch();
  const {user, abtCustomerId} = useAuthState();
  const [idToken, setIdToken] = useState<
    FirebaseAuthTypes.IdTokenResult | undefined
  >(undefined);
  const {tokenStatus, retry, travelTokens} = useMobileTokenContextState();
  const navigation = useNavigation();

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

  const [storedValues, setStoredValues] = useState<
    [string, string | null][] | null
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

  const {
    setPreference,
    preferences: {tripSearchPreferences, showTestIds},
  } = usePreferences();

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
            text="Restart travel document onboarding"
            onPress={() => navigation.navigate('TravelDocumentOnboardingStack')}
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
            text="Reset feedback displayStats"
            onPress={() => storage.set('@ATB_feedback_display_stats', '')}
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.GenericItem>
            <ThemeText type="heading__component">
              Trip search parameters
            </ThemeText>
            <ThemeText type="body__secondary" color="secondary">
              Press labels to reset to default
            </ThemeText>
          </Sections.GenericItem>
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
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem text="Firebase Auth user info" />
          <Sections.GenericItem>
            <View>
              {Object.entries(user?.toJSON() ?? {}).map(([key, value]) =>
                mapEntry(key, value),
              )}
            </View>
          </Sections.GenericItem>
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem text="Firebase Auth user claims" />
          <Sections.GenericItem>
            {!!idToken ? (
              Object.entries(idToken).map(([key, value]) =>
                mapEntry(key, value),
              )
            ) : (
              <ThemeText>No id token</ThemeText>
            )}
          </Sections.GenericItem>
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem text="Storage" />
          {storedValues && (
            <Sections.GenericItem>
              {storedValues.map(([key, value]) => mapEntry(key, value))}
            </Sections.GenericItem>
          )}
        </Sections.Section>

        {retry && (
          <Sections.Section withPadding withTopPadding>
            <Sections.HeaderItem text="Mobile token state" />
            <Sections.GenericItem>
              <View>
                <ThemeText>{`Token state: ${tokenStatus?.state}`}</ThemeText>
                <ThemeText>{`Token id: ${tokenStatus?.tokenId}`}</ThemeText>
                <ThemeText>{`Visual state: ${tokenStatus?.visualState}`}</ThemeText>
                <ThemeText>{`Error message: ${tokenStatus?.error?.message}`}</ThemeText>
                <ThemeText>{`Error missing inet: ${tokenStatus?.error?.missingNetConnection}`}</ThemeText>
                <ThemeText>{`Error object: ${
                  tokenStatus?.error?.err
                    ? JSON.stringify(
                        tokenStatus?.error?.err,
                        Object.getOwnPropertyNames(tokenStatus?.error?.err),
                      )
                    : undefined
                }`}</ThemeText>
              </View>
            </Sections.GenericItem>
            <Sections.HeaderItem text="Travel tokens" />
            {travelTokens?.map((token) => (
              <Sections.GenericItem>
                {keys(token).map((k) => (
                  <ThemeText>
                    {k + ': ' + JSON.stringify(get(token, k))}
                  </ThemeText>
                ))}
              </Sections.GenericItem>
            ))}
            {retry && (
              <>
                <Sections.LinkItem text="Retry" onPress={() => retry(false)} />
                <Sections.LinkItem
                  text="Force restart"
                  onPress={() => retry(true)}
                />
              </>
            )}
          </Sections.Section>
        )}
      </ScrollView>
    </View>
  );
}

function mapValue(value: any) {
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
      if (entries.length) {
        return (
          <View style={{flexDirection: 'column'}}>
            {Object.entries(value).map(([key, value]) => mapEntry(key, value))}
          </View>
        );
      } else {
        return <ThemeText>Empty object</ThemeText>;
      }
    default:
      const stringified = value.toString();
      return (
        <ThemeText onPress={() => setClipboard(stringified)}>
          {stringified}
        </ThemeText>
      );
  }
}

function mapEntry(key: string, value: any) {
  if (!!value && typeof value === 'object') {
    return (
      <View key={key} style={{flexDirection: 'column', marginVertical: 12}}>
        <ThemeText type="heading__title" color="secondary">
          {key} (object):
        </ThemeText>
        {mapValue(value)}
      </View>
    );
  } else {
    return (
      <View
        key={key}
        style={{flexDirection: 'row', flexWrap: 'wrap'}}
        testID={key === 'user_id' ? 'userId' : ''}
      >
        <ThemeText type="body__primary--bold">{key}: </ThemeText>
        {mapValue(value)}
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
}));
