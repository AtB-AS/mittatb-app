import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {LogIn, LogOut} from '@atb/assets/svg/mono-icons/profile';
import {useAuthState} from '@atb/auth';
import {ActivityIndicatorOverlay} from '@atb/components/activity-indicator-overlay';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {SelectFavouritesBottomSheet} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/SelectFavouritesBottomSheet';
import {useSearchHistory} from '@atb/search-history';
import {StyleSheet, Theme} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {
  getTextForLanguage,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {useLocalConfig} from '@atb/utils/use-local-config';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG, IS_QA_ENV} from '@env';
import parsePhoneNumber from 'libphonenumber-js';
import React from 'react';
import {Linking, View} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from './navigation-types';
import {destructiveAlert} from './utils';
import {useIsLoading} from '@atb/utils/use-is-loading';
import {SectionHeading} from '@atb/components/section-heading';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {ClickableCopy} from './components/ClickableCopy';
import {usePushNotificationsEnabled} from '@atb/notifications';
import {useAnalytics} from '@atb/analytics';
import {useTimeContextState} from '@atb/time';
import {useStorybookContext} from '@atb/storybook/StorybookContext';

const buildNumber = getBuildNumber();
const version = getVersion();

type ProfileProps = ProfileScreenProps<'Profile_RootScreen'>;

export const Profile_RootScreen = ({navigation}: ProfileProps) => {
  const {privacy_policy_url, enable_ticketing} = useRemoteConfig();
  const {wipeToken} = useMobileTokenContextState();
  const style = useProfileHomeStyle();
  const {clearHistory} = useSearchHistory();
  const {t, language} = useTranslation();
  const analytics = useAnalytics();
  const {
    authenticationType,
    signOut,
    phoneNumber: authPhoneNumber,
    customerNumber,
  } = useAuthState();
  const config = useLocalConfig();

  const {fareContracts, customerProfile} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const {setEnabled: setStorybookEnabled} = useStorybookContext();

  const hasActiveFareContracts = activeFareContracts.length > 0;

  const {configurableLinks} = useFirestoreConfiguration();
  const ticketingInfo = configurableLinks?.ticketingInfo;
  const termsInfo = configurableLinks?.termsInfo;
  const inspectionInfo = configurableLinks?.inspectionInfo;
  const refundInfo = configurableLinks?.refundInfo;
  const ticketingInfoUrl = getTextForLanguage(ticketingInfo, language);
  const termsInfoUrl = getTextForLanguage(termsInfo, language);
  const inspectionInfoUrl = getTextForLanguage(inspectionInfo, language);
  const refundInfoUrl = getTextForLanguage(refundInfo, language);

  const {disable_travelcard} = useRemoteConfig();

  const [isLoading, setIsLoading] = useIsLoading(false);

  const phoneNumber = parsePhoneNumber(authPhoneNumber ?? '');
  const {enable_vipps_login} = useRemoteConfig();
  const isPushNotificationsEnabled = usePushNotificationsEnabled();

  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  async function selectFavourites() {
    openBottomSheet(() => {
      return (
        <SelectFavouritesBottomSheet
          close={closeBottomSheet}
          onEditFavouriteDeparture={() =>
            navigation.navigate('Profile_FavoriteDeparturesScreen')
          }
        />
      );
    });
  }

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.header.title)}
        rightButton={{type: 'chat'}}
      />

      <ScrollView testID="profileHomeScrollView">
        <View style={style.contentContainer}>
          <SectionHeading text={t(ProfileTexts.sections.account.heading)} />
          <Section>
            {authenticationType === 'phone' && (
              <GenericSectionItem>
                <ThemeText style={style.customerNumberHeading}>
                  {t(ProfileTexts.sections.account.infoItems.phoneNumber)}
                </ThemeText>
                <ThemeText type="body__secondary" color="secondary">
                  {phoneNumber?.formatInternational()}
                </ThemeText>
              </GenericSectionItem>
            )}
            {customerNumber && (
              <GenericSectionItem>
                <ThemeText style={style.customerNumberHeading}>
                  {t(ProfileTexts.sections.account.infoItems.customerNumber)}
                </ThemeText>
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  accessibilityLabel={numberToAccessibilityString(
                    customerNumber,
                  )}
                >
                  {customerNumber}
                </ThemeText>
              </GenericSectionItem>
            )}

            {authenticationType == 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.paymentOptions
                    .label,
                )}
                onPress={() =>
                  navigation.navigate('Profile_PaymentOptionsScreen')
                }
              />
            )}

            <LinkSectionItem
              text={t(
                ProfileTexts.sections.account.linkSectionItems.ticketHistory
                  .label,
              )}
              onPress={() => navigation.navigate('Profile_TicketHistoryScreen')}
              testID="ticketHistoryButton"
            />
            {authenticationType !== 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.login.label,
                )}
                onPress={() => {
                  let screen: keyof RootStackParamList =
                    'Root_LoginPhoneInputScreen';
                  if (hasActiveFareContracts) {
                    screen = 'Root_LoginActiveFareContractWarningScreen';
                  } else if (enable_vipps_login) {
                    screen = 'Root_LoginOptionsScreen';
                  }

                  return navigation.navigate(screen, {});
                }}
                icon={<ThemeIcon svg={LogIn} />}
                testID="loginButton"
              />
            )}
            {authenticationType === 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.editProfile
                    .label,
                )}
                onPress={() => navigation.navigate('Profile_EditProfileScreen')}
              />
            )}
            {authenticationType === 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.logout.label,
                )}
                icon={<ThemeIcon svg={LogOut} />}
                onPress={() =>
                  destructiveAlert({
                    alertTitleString: t(
                      ProfileTexts.sections.account.linkSectionItems.logout
                        .confirmTitle,
                    ),
                    alertMessageString: t(
                      ProfileTexts.sections.account.linkSectionItems.logout
                        .confirmMessage,
                    ),
                    cancelAlertString: t(
                      ProfileTexts.sections.account.linkSectionItems.logout
                        .alert.cancel,
                    ),
                    confirmAlertString: t(
                      ProfileTexts.sections.account.linkSectionItems.logout
                        .alert.confirm,
                    ),
                    destructiveArrowFunction: async () => {
                      Bugsnag.leaveBreadcrumb('User logging out');
                      analytics.logEvent('Profile', 'User logging out');
                      setIsLoading(true);
                      try {
                        // On logout we delete the user's token
                        await wipeToken();
                      } catch (err: any) {
                        Bugsnag.notify(err);
                      }

                      try {
                        await signOut();
                      } catch (err: any) {
                        Bugsnag.notify(err);
                      } finally {
                        setIsLoading(false);
                      }
                    },
                  })
                }
                testID="logoutButton"
              />
            )}
          </Section>

          <SectionHeading text={t(ProfileTexts.sections.settings.heading)} />
          <Section>
            {enable_ticketing ? (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.settings.linkSectionItems.userProfile
                    .label,
                )}
                onPress={() =>
                  navigation.navigate('Profile_DefaultUserProfileScreen')
                }
                testID="defaultTravellerButton"
              />
            ) : null}

            {authenticationType === 'phone' && (
              <LinkSectionItem
                text={
                  disable_travelcard
                    ? t(
                        ProfileTexts.sections.settings.linkSectionItems
                          .travelToken.labelWithoutTravelcard,
                      )
                    : t(
                        ProfileTexts.sections.settings.linkSectionItems
                          .travelToken.label,
                      )
                }
                onPress={() => navigation.navigate('Profile_TravelTokenScreen')}
                testID="travelTokenButton"
              />
            )}
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.appearance
                  .label,
              )}
              onPress={() => navigation.navigate('Profile_AppearanceScreen')}
              testID="appearanceButton"
            />
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.startScreen
                  .label,
              )}
              onPress={() =>
                navigation.navigate('Profile_SelectStartScreenScreen')
              }
              testID="startScreenButton"
            />
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.language.label,
              )}
              onPress={() => navigation.navigate('Profile_LanguageScreen')}
              testID="languageButton"
            />
            {isPushNotificationsEnabled && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .label,
                )}
                onPress={() =>
                  navigation.navigate('Profile_NotificationsScreen')
                }
                testID="notificationsButton"
              />
            )}
          </Section>

          <SectionHeading text={t(ProfileTexts.sections.newFeatures.heading)} />
          <Section>
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.enrollment
                  .label,
              )}
              onPress={() => navigation.navigate('Profile_EnrollmentScreen')}
              testID="invitationCodeButton"
            />
          </Section>
          <SectionHeading text={t(ProfileTexts.sections.favorites.heading)} />
          <Section>
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.favorites.linkSectionItems.places.label,
              )}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.favorites.linkSectionItems.places
                    .a11yHint,
                ),
              }}
              testID="favoriteLocationsButton"
              onPress={() => navigation.navigate('Profile_FavoriteListScreen')}
            />
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.favorites.linkSectionItems.departures
                  .label,
              )}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.favorites.linkSectionItems.departures
                    .a11yHint,
                ),
              }}
              testID="favoriteDeparturesButton"
              onPress={() =>
                navigation.navigate('Profile_FavoriteDeparturesScreen')
              }
            />
          </Section>

          <SectionHeading text={t(ProfileTexts.sections.privacy.heading)} />
          <Section>
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.privacy.linkSectionItems.privacy.label,
              )}
              icon="external-link"
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.privacy.linkSectionItems.privacy
                    .a11yHint,
                ),
              }}
              testID="privacyButton"
              onPress={() => Linking.openURL(privacy_policy_url)}
            />
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                  .label,
              )}
              icon={<ThemeIcon svg={Delete} />}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                    .a11yHint,
                ),
              }}
              testID="clearHistoryButton"
              onPress={() =>
                destructiveAlert({
                  alertTitleString: t(
                    ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                      .confirmTitle,
                  ),
                  cancelAlertString: t(
                    ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                      .alert.cancel,
                  ),
                  confirmAlertString: t(
                    ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                      .alert.confirm,
                  ),
                  destructiveArrowFunction: async () => {
                    await clearHistory();
                  },
                })
              }
            />
          </Section>

          {enable_ticketing && (
            <>
              <SectionHeading
                text={t(ProfileTexts.sections.information.heading)}
              />
              <Section>
                {APP_ORG === 'atb' ? (
                  <LinkSectionItem
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems
                        .ticketing.label,
                    )}
                    testID="ticketingInfoButton"
                    onPress={() =>
                      navigation.navigate('Profile_TicketingInformationScreen')
                    }
                  />
                ) : (
                  ticketingInfoUrl && (
                    <LinkSectionItem
                      icon={<ThemeIcon svg={ExternalLink} />}
                      text={t(
                        ProfileTexts.sections.information.linkSectionItems
                          .ticketing.label,
                      )}
                      testID="ticketingInfoButton"
                      onPress={() => Linking.openURL(ticketingInfoUrl)}
                    />
                  )
                )}

                {APP_ORG === 'atb' ? (
                  <LinkSectionItem
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems.terms
                        .label,
                    )}
                    testID="termsInfoButton"
                    onPress={() =>
                      navigation.navigate('Profile_TermsInformationScreen')
                    }
                  />
                ) : (
                  termsInfoUrl && (
                    <LinkSectionItem
                      icon={<ThemeIcon svg={ExternalLink} />}
                      text={t(
                        ProfileTexts.sections.information.linkSectionItems.terms
                          .label,
                      )}
                      testID="termsInfoButton"
                      onPress={() => Linking.openURL(termsInfoUrl)}
                    />
                  )
                )}

                {APP_ORG === 'atb' ? (
                  <LinkSectionItem
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems
                        .inspection.label,
                    )}
                    testID="inspectionInfoButton"
                    onPress={() =>
                      navigation.navigate(
                        APP_ORG === 'atb'
                          ? 'Profile_TicketInspectionInformationScreen'
                          : 'Profile_GenericWebsiteInformationScreen',
                      )
                    }
                  />
                ) : (
                  inspectionInfoUrl && (
                    <LinkSectionItem
                      icon={<ThemeIcon svg={ExternalLink} />}
                      text={t(
                        ProfileTexts.sections.information.linkSectionItems
                          .inspection.label,
                      )}
                      testID="inspectionInfoButton"
                      onPress={() => Linking.openURL(inspectionInfoUrl)}
                    />
                  )
                )}

                {refundInfoUrl && (
                  <LinkSectionItem
                    icon={<ThemeIcon svg={ExternalLink} />}
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems.refund
                        .label,
                    )}
                    testID="refundInfoButton"
                    onPress={() => Linking.openURL(refundInfoUrl)}
                  />
                )}
              </Section>
            </>
          )}
          {(!!JSON.parse(IS_QA_ENV || 'false') ||
            __DEV__ ||
            customerProfile?.debug) && (
            <>
              <SectionHeading text="Developer menu" />
              <Section>
                <LinkSectionItem
                  text={t(
                    ProfileTexts.sections.favorites.linkSectionItems
                      .frontpageFavourites.label,
                  )}
                  accessibility={{
                    accessibilityHint: t(
                      ProfileTexts.sections.favorites.linkSectionItems
                        .frontpageFavourites.a11yHint,
                    ),
                  }}
                  testID="favoriteDeparturesButton"
                  onPress={selectFavourites}
                />
                <LinkSectionItem
                  text="Design system"
                  testID="designSystemButton"
                  onPress={() =>
                    navigation.navigate('Profile_DesignSystemScreen')
                  }
                />
                <LinkSectionItem
                  text="Storybook"
                  onPress={() => setStorybookEnabled(true)}
                />
                <LinkSectionItem
                  text="Debug"
                  testID="debugButton"
                  onPress={() => navigation.navigate('Profile_DebugInfoScreen')}
                />
              </Section>
            </>
          )}
          <View style={style.debugInfoContainer}>
            <ThemeText type="body__secondary" color="secondary">
              v{version} ({buildNumber})
            </ThemeText>
            {config?.installId && (
              <ClickableCopy
                successElement={
                  <>
                    <ScreenReaderAnnouncement
                      message={t(ProfileTexts.installId.wasCopiedAlert)}
                    />
                    <ThemeText type="body__secondary" color="secondary">
                      ✅ {t(ProfileTexts.installId.wasCopiedAlert)}
                    </ThemeText>
                  </>
                }
                copyContent={config.installId}
              >
                <ThemeText
                  accessibilityHint={t(ProfileTexts.installId.a11yHint)}
                  type="body__secondary"
                  color="secondary"
                >
                  {t(ProfileTexts.installId.label)}: {config.installId}
                </ThemeText>
              </ClickableCopy>
            )}
          </View>
        </View>
      </ScrollView>
      {isLoading && <ActivityIndicatorOverlay />}
    </View>
  );
};

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  contentContainer: {
    rowGap: theme.spacings.small,
    margin: theme.spacings.medium,
  },
  customerNumberHeading: {
    marginBottom: theme.spacings.xSmall,
  },
  debugInfoContainer: {
    alignItems: 'center',
  },
  betaSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
