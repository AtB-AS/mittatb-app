import {useAuthState} from '@atb/auth';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {RootStackParamList} from '@atb/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useSearchHistory} from '@atb/search-history';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import useLocalConfig from '@atb/utils/use-local-config';
import {PRIVACY_POLICY_URL} from '@env';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';
import useCopyWithOpacityFade from '@atb/utils/use-copy-with-countdown';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {Check} from '@atb/assets/svg/icons/status';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';

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
  const {clearHistory} = useSearchHistory();
  const {t} = useTranslation();
  const {authenticationType, signOut, user} = useAuthState();
  const config = useLocalConfig();

  const {
    setClipboard,
    isAnimating: fadeIsAnimating,
    FadeContainer: ClipboardFadeContainer,
  } = useCopyWithOpacityFade(1500);

  function copyInstallId() {
    if (config?.installId) setClipboard(config.installId);
  }

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.header.title)}
        leftButton={{type: 'home'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView contentContainerStyle={style.scrollView}>
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
                      await clearHistory();
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

        <View style={style.debugInfoContainer}>
          {config?.installId && (
            <View>
              {fadeIsAnimating && (
                <ClipboardFadeContainer>
                  <ScreenReaderAnnouncement
                    message={t(ProfileTexts.installId.wasCopiedAlert)}
                  />
                  <ThemeText>
                    ✅ {t(ProfileTexts.installId.wasCopiedAlert)}
                  </ThemeText>
                </ClipboardFadeContainer>
              )}
              <ThemeText
                accessibilityHint={t(ProfileTexts.installId.a11yHint)}
                style={style.debugInfo}
                onPress={copyInstallId}
              >
                {t(ProfileTexts.installId.label)}: {config.installId}
              </ThemeText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  scrollView: {
    marginTop: theme.spacings.medium,
  },
  debugInfoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacings.medium,
  },
  debugInfo: {
    color: theme.colors.background_1.color,
  },
}));
