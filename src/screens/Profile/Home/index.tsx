import {useAuthState} from '@atb/auth';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {TabNavigatorParams} from '@atb/navigation/TabNavigator';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import {PRIVACY_POLICY_URL} from '@env';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'ProfileHome'
>;

type ProfileNearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TabNavigatorParams, 'Profile'>,
  ProfileScreenNavigationProp
>;

type ProfileScreenProps = {
  navigation: ProfileNearbyScreenNavigationProp;
};

export default function ProfileHome({navigation}: ProfileScreenProps) {
  const {enable_i18n} = useRemoteConfig();
  const style = useProfileHomeStyle();
  const {t} = useTranslation();
  const {signInAnonymously, signOut, user} = useAuthState();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.header.title)}
        leftButton={{type: 'home'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView>
        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.settings.heading)}
            mode="subheading"
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
            mode="subheading"
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
            mode="subheading"
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
        </Sections.Section>

        {__DEV__ && (
          <Sections.Section withPadding>
            <Sections.HeaderItem text="Bruker" mode="subheading" />
            <Sections.LinkItem
              text="Logg ut"
              onPress={() => signOut()}
              disabled={!user}
            />
            <Sections.LinkItem
              text="Logg inn"
              onPress={() => signInAnonymously()}
              disabled={!!user}
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
}));
