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
import {useMobileContextState} from '@atb/mobile-token/MobileTokenContext';

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
  const {tokenStatus} = useMobileContextState();

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

  return (
    <View style={style.container}>
      <FullScreenHeader
        title="Debug info"
        leftButton={{type: 'back'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView>
        <Sections.Section withPadding withTopPadding>
          <Sections.LinkItem
            text="Restart onboarding"
            onPress={() => {
              appDispatch({type: 'RESTART_ONBOARDING'});
            }}
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

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem text="Mobile token state" />
          <Sections.GenericItem>
            <View>
              <ThemeText>{`Token state: ${tokenStatus?.state}`}</ThemeText>
              <ThemeText>{`Visual state: ${tokenStatus?.visualState}`}</ThemeText>
              <ThemeText>{`Error message: ${tokenStatus?.error?.message}`}</ThemeText>
              <ThemeText>{`Error missing inet: ${tokenStatus?.error?.missingNetConnection}`}</ThemeText>
              <ThemeText>{`Error object: ${JSON.stringify(
                tokenStatus?.error?.err,
              )}`}</ThemeText>
            </View>
          </Sections.GenericItem>
        </Sections.Section>
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
      return <ThemeText onPress={() => setClipboard(value)}>{value}</ThemeText>;
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
      <View key={key} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <ThemeText type="body__primary--bold">{key}: </ThemeText>
        {mapValue(value)}
      </View>
    );
  }
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  buttons: {
    marginHorizontal: theme.spacings.medium,
  },
}));
