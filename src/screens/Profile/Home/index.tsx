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
import React from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ProfileStackParams} from '..';
import useCopyWithOpacityFade from '@atb/utils/use-copy-with-countdown';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';

const buildNumber = getBuildNumber();
const version = getVersion();

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
        titleA11yLabel={t(ProfileTexts.header.title_a11y)}
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
                  navigation.navigate('LoginInApp', {
                    screen: 'PhoneInputInApp',
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
          </Sections.Section>
        )}

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.settings.heading)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.userProfile.label)}
            onPress={() => navigation.navigate('DefaultUserProfile')}
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
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.enrollment.label)}
            onPress={() => navigation.navigate('Enrollment')}
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.favorites.heading)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.favorites.linkItems.places.label)}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.favorites.linkItems.places.a11yHint,
              ),
            }}
            onPress={() => navigation.navigate('FavoriteList')}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.favorites.linkItems.departures.label)}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.favorites.linkItems.departures.a11yHint,
              ),
            }}
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

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.information.heading)}
          />
          <Sections.LinkItem
            text={t(
              ProfileTexts.sections.information.linkItems.ticketing.label,
            )}
            onPress={() => navigation.navigate('TicketingInformation')}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.information.linkItems.payment.label)}
            onPress={() => navigation.navigate('PaymentInformation')}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.information.linkItems.terms.label)}
            onPress={() => navigation.navigate('TermsInformation')}
          />
          <Sections.LinkItem
            text={t(
              ProfileTexts.sections.information.linkItems.inspection.label,
            )}
            onPress={() => navigation.navigate('TicketInspectionInformation')}
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
          <ThemeText>
            v{version} ({buildNumber})
          </ThemeText>
          {config?.installId &&
            (fadeIsAnimating ? (
              <ClipboardFadeContainer>
                <ScreenReaderAnnouncement
                  message={t(ProfileTexts.installId.wasCopiedAlert)}
                />
                <ThemeText>
                  ✅ {t(ProfileTexts.installId.wasCopiedAlert)}
                </ThemeText>
              </ClipboardFadeContainer>
            ) : (
              <ThemeText
                accessibilityHint={t(ProfileTexts.installId.a11yHint)}
                onPress={copyInstallId}
              >
                {t(ProfileTexts.installId.label)}: {config.installId}
              </ThemeText>
            ))}
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
    paddingVertical: theme.spacings.medium,
  },
  debugInfoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacings.medium,
  },
}));
