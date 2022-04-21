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
import {IS_QA_ENV} from '@env';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Alert, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ProfileStackParams} from '..';
import useCopyWithOpacityFade from '@atb/utils/use-copy-with-countdown';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketState,
} from '@atb/tickets';
import {usePreferences} from '@atb/preferences';
import analytics from '@react-native-firebase/analytics';
import {updateMetadata} from '@atb/chat/metadata';
import parsePhoneNumber from 'libphonenumber-js';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {utils} from '@react-native-firebase/app';

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
  const {enable_i18n, privacy_policy_url, enable_ticketing} = useRemoteConfig();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const style = useProfileHomeStyle();
  const {clearHistory} = useSearchHistory();
  const {t} = useTranslation();
  const {authenticationType, signOut, user, customerNumber} = useAuthState();
  const config = useLocalConfig();

  const {fareContracts, customerProfile} = useTicketState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts);
  const hasActiveFareContracts = activeFareContracts.length > 0;

  const {
    setClipboard,
    isAnimating: fadeIsAnimating,
    FadeContainer: ClipboardFadeContainer,
  } = useCopyWithOpacityFade(1500);

  const {
    setPreference,
    preferences: {newDepartures},
  } = usePreferences();

  function copyInstallId() {
    if (config?.installId) setClipboard(config.installId);
  }

  const phoneNumber = parsePhoneNumber(user?.phoneNumber ?? '');

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.header.title)}
        rightButton={{type: 'chat'}}
      />

      <ScrollView
        contentContainerStyle={style.scrollView}
        testID="profileHomeScrollView"
      >
        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.account.heading)}
          />
          {authenticationType === 'phone' && (
            <Sections.GenericItem>
              <ThemeText style={style.customerNumberHeading}>
                {t(ProfileTexts.sections.account.infoItems.phoneNumber)}
              </ThemeText>
              <ThemeText type="body__secondary" color="secondary">
                {phoneNumber?.formatInternational()}
              </ThemeText>
            </Sections.GenericItem>
          )}
          {customerNumber && (
            <Sections.GenericItem>
              <ThemeText style={style.customerNumberHeading}>
                {t(ProfileTexts.sections.account.infoItems.customerNumber)}
              </ThemeText>
              <ThemeText
                type="body__secondary"
                color="secondary"
                accessibilityLabel={numberToAccessibilityString(customerNumber)}
              >
                {customerNumber}
              </ThemeText>
            </Sections.GenericItem>
          )}
          {authenticationType !== 'phone' && (
            <Sections.LinkItem
              text={t(ProfileTexts.sections.account.linkItems.login.label)}
              onPress={() =>
                navigation.navigate('LoginInApp', {
                  screen: hasActiveFareContracts
                    ? 'ActiveTicketPromptInApp'
                    : 'PhoneInputInApp',
                  params: {
                    afterLogin: {routeName: 'ProfileHome'},
                  },
                })
              }
              testID="loginButton"
            />
          )}
          {authenticationType === 'phone' && (
            <Sections.LinkItem
              text={t(ProfileTexts.sections.account.linkItems.logout.label)}
              onPress={signOut}
              testID="logoutButton"
            />
          )}
          <Sections.LinkItem
            text={t(
              ProfileTexts.sections.account.linkItems.expiredTickets.label,
            )}
            onPress={() => navigation.navigate('ExpiredTickets')}
            testID="expiredTicketsButton"
          />
        </Sections.Section>

        <Sections.Section withPadding>
          <Sections.HeaderItem
            text={t(ProfileTexts.sections.settings.heading)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.userProfile.label)}
            onPress={() => navigation.navigate('DefaultUserProfile')}
            testID="defaultTravellerButton"
          />
          {authenticationType === 'phone' && hasEnabledMobileToken && (
            <Sections.LinkItem
              text={t(
                ProfileTexts.sections.settings.linkItems.travelToken.label,
              )}
              flag={t(
                ProfileTexts.sections.settings.linkItems.travelToken.flag,
              )}
              onPress={() => navigation.navigate('TravelToken')}
              testID="travelTokenButton"
            />
          )}
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.appearance.label)}
            onPress={() => navigation.navigate('Appearance')}
            testID="appearanceButton"
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.startScreen.label)}
            onPress={() => navigation.navigate('SelectStartScreen')}
            testID="startScreenButton"
          />
          {enable_i18n && (
            <Sections.LinkItem
              text={t(ProfileTexts.sections.settings.linkItems.language.label)}
              onPress={() => navigation.navigate('Language')}
              testID="languageButton"
            />
          )}
        </Sections.Section>
        <Sections.Section withPadding>
          <Sections.GenericItem>
            <View style={style.betaSectionHeader}>
              <ThemeText type="heading__component">
                {t(ProfileTexts.sections.newFeatures.heading)}
              </ThemeText>
              <View style={style.betaLabel}>
                <ThemeText color="primary_2" style={style.betaLabelText}>
                  BETA
                </ThemeText>
              </View>
            </View>
          </Sections.GenericItem>
          <Sections.ActionItem
            mode="toggle"
            text={t(ProfileTexts.sections.newFeatures.departures)}
            checked={newDepartures}
            testID="newDeparturesToggle"
            onPress={(newDepartures) => {
              analytics().logEvent('toggle_beta_departures', {
                toggle: newDepartures ? 'enable' : 'disable',
              });
              updateMetadata({
                'AtB-Beta-Departures': newDepartures ? 'enabled' : 'disabled',
              });
              setPreference({newDepartures});
            }}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.settings.linkItems.enrollment.label)}
            onPress={() => navigation.navigate('Enrollment')}
            testID="invitationCodeButton"
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
            testID="favoriteLocationsButton"
            onPress={() => navigation.navigate('FavoriteList')}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.favorites.linkItems.departures.label)}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.favorites.linkItems.departures.a11yHint,
              ),
            }}
            testID="favoriteDeparturesButton"
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
            testID="privacyButton"
            onPress={() => Linking.openURL(privacy_policy_url)}
          />
          <Sections.LinkItem
            text={t(ProfileTexts.sections.privacy.linkItems.clearHistory.label)}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.privacy.linkItems.clearHistory.a11yHint,
              ),
            }}
            testID="clearHistoryButton"
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

        {enable_ticketing && (
          <Sections.Section withPadding>
            <Sections.HeaderItem
              text={t(ProfileTexts.sections.information.heading)}
            />
            <Sections.LinkItem
              text={t(
                ProfileTexts.sections.information.linkItems.ticketing.label,
              )}
              testID="ticketingInfoButton"
              onPress={() => navigation.navigate('TicketingInformation')}
            />
            <Sections.LinkItem
              text={t(
                ProfileTexts.sections.information.linkItems.payment.label,
              )}
              testID="paymentInfoButton"
              onPress={() => navigation.navigate('PaymentInformation')}
            />
            <Sections.LinkItem
              text={t(ProfileTexts.sections.information.linkItems.terms.label)}
              testID="termsInfoButton"
              onPress={() => navigation.navigate('TermsInformation')}
            />
            <Sections.LinkItem
              text={t(
                ProfileTexts.sections.information.linkItems.inspection.label,
              )}
              testID="inspectionInfoButton"
              onPress={() => navigation.navigate('TicketInspectionInformation')}
            />
          </Sections.Section>
        )}

        {(!!JSON.parse(IS_QA_ENV || 'false') ||
          __DEV__ ||
          customerProfile?.debug) && (
          <Sections.Section withPadding>
            <Sections.HeaderItem text="Developer menu" />
            <Sections.LinkItem
              text="Design system"
              testID="designSystemButton"
              onPress={() => navigation.navigate('DesignSystem')}
            />
            <Sections.LinkItem
              text="Debug"
              testID="debugButton"
              onPress={() => navigation.navigate('DebugInfo')}
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
  customerNumberHeading: {
    marginBottom: theme.spacings.xSmall,
  },
  scrollView: {
    paddingVertical: theme.spacings.medium,
  },
  debugInfoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacings.medium,
  },
  betaSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  betaLabel: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
    marginHorizontal: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
  },
  betaLabelText: {
    fontSize: 8,
    lineHeight: 9,
  },
}));
