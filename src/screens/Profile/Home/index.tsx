import {useAuthState} from '@atb/auth';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {RootStackParamList} from '@atb/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useSearchHistory} from '@atb/search-history';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import {PRIVACY_POLICY_URL} from '@env';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'ProfileHome'
>;

type ProfileNearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  ProfileScreenNavigationProp
>;

type ProfileScreenProps = {
  navigation: ProfileNearbyScreenNavigationProp;
};

export default function ProfileHome({navigation}: ProfileScreenProps) {
  const {enable_i18n, enable_login} = useRemoteConfig();
  const style = useProfileHomeStyle();
  const {history, clearSearchHistory} = useSearchHistory();
  const {t} = useTranslation();
  const {authenticationType, signOut, user} = useAuthState();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.header.title)}
        leftButton={{type: 'home'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView style={style.scrollView}>
        {enable_login && (
          <Sections.Section withPadding>
            <Sections.HeaderItem
              text={t(ProfileTexts.sections.account.heading)}
            />
            {authenticationType !== 'phone' && (
              <Sections.LinkItem
                text={t(ProfileTexts.sections.account.linkItems.login.label)}
                onPress={() =>
                  navigation.navigate('Login', {
                    screen: 'PhoneInput',
                    params: {
                      afterLogin: {routeName: 'ProfileHome'},
                    },
                  })
                }
              />
            )}
            {authenticationType === 'phone' && (
              <Sections.GenericItem>
                <ThemeText>{user?.phoneNumber}</ThemeText>
              </Sections.GenericItem>
            )}
            {authenticationType === 'phone' && (
              <Sections.LinkItem
                text={t(ProfileTexts.sections.account.linkItems.logout.label)}
                onPress={signOut}
              />
            )}
            {__DEV__ && (
              <Sections.GenericItem>
                <ThemeText>SignedInState: {authenticationType}</ThemeText>
              </Sections.GenericItem>
            )}
          </Sections.Section>
        )}

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.settings.heading)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.appearance.label)}
            onPress={() => navigation.navigate('Appearance')}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.startScreen.label)}
            onPress={() => navigation.navigate('SelectStartScreen')}
          />
          {enable_i18n && (
            <Sections.LinkItem
              text={t(ProfileTexts.sections.settings.linkItems.language.label)}
              onPress={() => navigation.navigate('Language')}
            />
          )}
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.favorites.heading)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.favorites.linkItems.places.label)}
            onPress={() => navigation.navigate('FavoriteList')}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.favorites.linkItems.departures.label)}
            onPress={() => navigation.navigate('FavoriteDepartures')}
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.privacy.heading)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.privacy.linkItems.privacy.label)}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.privacy.linkItems.privacy.a11yHint,
              ),
            }}
            onPress={() =>
              Linking.openURL(PRIVACY_POLICY_URL ?? 'https://www.atb.no')
            }
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.privacy.linkItems.clearHistory.label)}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.privacy.linkItems.clearHistory.a11yHint,
              ),
            }}
            onPress={() =>
              Alert.alert(
                t(ProfileTexts.sections.privacy.linkItems.clearHistory.confirm),
                undefined,
                [
                  {
                    text: t(
                      ProfileTexts.sections.privacy.linkItems.clearHistory.alert
                        .cancel,
                    ),
                    style: 'cancel',
                  },
                  {
                    text: t(
                      ProfileTexts.sections.privacy.linkItems.clearHistory.alert
                        .confirm,
                    ),
                    style: 'destructive',
                    onPress: async () => {
                      await clearSearchHistory();
                    },
                  },
                ],
              )
            }
          />
        </Sections.Section>

        {__DEV__ && (
          <Sections.Section withPadding>
            <Sections.HeaderItem text="Developer menu" />
            <Sections.LinkItem
              text="Design system"
              onPress={() => navigation.navigate('DesignSystem')}
            />
          </Sections.Section>
        )}
      </ScrollView>
    </View>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
  scrollView: {
    marginTop: theme.spacings.medium,
  },
}));
