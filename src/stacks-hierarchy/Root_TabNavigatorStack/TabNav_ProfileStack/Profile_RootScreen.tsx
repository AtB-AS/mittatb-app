import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {LogIn, LogOut} from '@atb/assets/svg/mono-icons/profile';
import {useAuthState} from '@atb/auth';
import {updateMetadata} from '@atb/chat/metadata';
import {ActivityIndicatorOverlay} from '@atb/components/activity-indicator-overlay';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import * as Sections from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {LoginInAppStackParams} from '@atb/login/types';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {usePreferences} from '@atb/preferences';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import SelectFavouritesBottomSheet from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/SelectFavouritesBottomSheet';
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
import DeleteProfileTexts from '@atb/translations/screens/subscreens/DeleteProfile';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import useCopyWithOpacityFade from '@atb/utils/use-copy-with-countdown';
import useLocalConfig from '@atb/utils/use-local-config';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG, IS_QA_ENV} from '@env';
import parsePhoneNumber from 'libphonenumber-js';
import React from 'react';
import {Linking, View} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from './navigation-types';
import {destructiveAlert} from './utils';
import useIsLoading from '@atb/utils/use-is-loading';
import {useDeparturesV2Enabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';

const buildNumber = getBuildNumber();
const version = getVersion();

type ProfileProps = ProfileScreenProps<'Profile_RootScreen'>;

export const Profile_RootScreen = ({navigation}: ProfileProps) => {
  const {enable_i18n, privacy_policy_url, enable_ticketing, enable_login} =
    useRemoteConfig();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {wipeToken} = useMobileTokenContextState();
  const style = useProfileHomeStyle();
  const {clearHistory} = useSearchHistory();
  const {t, language} = useTranslation();
  const {authenticationType, signOut, user, customerNumber} = useAuthState();
  const config = useLocalConfig();

  const {fareContracts, customerProfile} = useTicketingState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts);
  const hasActiveFareContracts = activeFareContracts.length > 0;

  const {
    setClipboard,
    isAnimating: fadeIsAnimating,
    FadeContainer: ClipboardFadeContainer,
  } = useCopyWithOpacityFade(1500);

  const {setPreference} = usePreferences();
  const isDeparturesV2Enabled = useDeparturesV2Enabled();

  const {configurableLinks} = useFirestoreConfiguration();
  const ticketingInfo = configurableLinks?.ticketingInfo
    ? configurableLinks?.ticketingInfo
    : undefined;
  const termsInfo = configurableLinks?.termsInfo
    ? configurableLinks?.termsInfo
    : undefined;
  const inspectionInfo = configurableLinks?.inspectionInfo
    ? configurableLinks?.inspectionInfo
    : undefined;
  const ticketingInfoUrl = getTextForLanguage(ticketingInfo, language);
  const termsInfoUrl = getTextForLanguage(termsInfo, language);
  const inspectionInfoUrl = getTextForLanguage(inspectionInfo, language);

  const {enable_departures_v2_as_default} = useRemoteConfig();
  const setDeparturesV2Enabled = (value: boolean) => {
    if (enable_departures_v2_as_default) {
      updateMetadata({
        'AtB-Departures-V2': value ? 'enabled' : 'disabled',
      });
      setPreference({departuresV2: value});
    } else {
      updateMetadata({
        'AtB-Beta-Departures': value ? 'enabled' : 'disabled',
      });
      setPreference({newDepartures: value});
    }
  };

  function copyInstallId() {
    if (config?.installId) setClipboard(config.installId);
  }
  const [isLoading, setIsLoading] = useIsLoading(false);

  const phoneNumber = parsePhoneNumber(user?.phoneNumber ?? '');
  const {enable_vipps_login} = useRemoteConfig();

  const {open: openBottomSheet} = useBottomSheet();
  async function selectFavourites() {
    openBottomSheet((close) => {
      return (
        <SelectFavouritesBottomSheet
          close={close}
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

      <ScrollView
        contentContainerStyle={style.scrollView}
        testID="profileHomeScrollView"
      >
        {enable_login ? (
          <Sections.Section withPadding>
            <Sections.HeaderSectionItem
              text={t(ProfileTexts.sections.account.heading)}
            />
            {authenticationType === 'phone' && (
              <Sections.GenericSectionItem>
                <ThemeText style={style.customerNumberHeading}>
                  {t(ProfileTexts.sections.account.infoItems.phoneNumber)}
                </ThemeText>
                <ThemeText type="body__secondary" color="secondary">
                  {phoneNumber?.formatInternational()}
                </ThemeText>
              </Sections.GenericSectionItem>
            )}
            {customerNumber && (
              <Sections.GenericSectionItem>
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
              </Sections.GenericSectionItem>
            )}

            {authenticationType == 'phone' && (
              <Sections.LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.paymentOptions
                    .label,
                )}
                onPress={() =>
                  navigation.navigate('Profile_PaymentOptionsScreen')
                }
              ></Sections.LinkSectionItem>
            )}

            <Sections.LinkSectionItem
              text={t(
                ProfileTexts.sections.account.linkSectionItems.ticketHistory
                  .label,
              )}
              onPress={() => navigation.navigate('Profile_TicketHistoryScreen')}
              testID="ticketHistoryButton"
            />
            {authenticationType !== 'phone' && (
              <Sections.LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.login.label,
                )}
                onPress={() => {
                  let screen: keyof LoginInAppStackParams = 'PhoneInputInApp';
                  if (hasActiveFareContracts) {
                    screen = 'ActiveFareContractPromptInApp';
                  } else if (enable_vipps_login) {
                    screen = 'LoginOptionsScreen';
                  }

                  return navigation.navigate('LoginInApp', {
                    screen,
                    params: {
                      afterLogin: {
                        screen: 'Root_TabNavigatorStack',
                        params: {
                          screen: 'TabNav_ProfileStack',
                          params: {screen: 'Profile_RootScreen'},
                        },
                      },
                    },
                  });
                }}
                icon={<ThemeIcon svg={LogIn} />}
                testID="loginButton"
              />
            )}
            {authenticationType === 'phone' && (
              <Sections.LinkSectionItem
                text={t(DeleteProfileTexts.header.title)}
                onPress={() =>
                  navigation.navigate('Profile_DeleteProfileScreen')
                }
              />
            )}
            {authenticationType === 'phone' && (
              <Sections.LinkSectionItem
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
          </Sections.Section>
        ) : null}
        <Sections.Section withPadding>
          <Sections.HeaderSectionItem
            text={t(ProfileTexts.sections.settings.heading)}
          />
          {enable_ticketing ? (
            <Sections.LinkSectionItem
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

          {authenticationType === 'phone' && hasEnabledMobileToken && (
            <Sections.LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.travelToken
                  .label,
              )}
              flag={t(
                ProfileTexts.sections.settings.linkSectionItems.travelToken
                  .flag,
              )}
              onPress={() => navigation.navigate('Profile_TravelTokenScreen')}
              testID="travelTokenButton"
            />
          )}
          <Sections.LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.appearance.label,
            )}
            onPress={() => navigation.navigate('Profile_AppearanceScreen')}
            testID="appearanceButton"
          />
          <Sections.LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.startScreen.label,
            )}
            onPress={() =>
              navigation.navigate('Profile_SelectStartScreenScreen')
            }
            testID="startScreenButton"
          />
          {enable_i18n && (
            <Sections.LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.language.label,
              )}
              onPress={() => navigation.navigate('Profile_LanguageScreen')}
              testID="languageButton"
            />
          )}
        </Sections.Section>
        <Sections.Section withPadding>
          <Sections.GenericSectionItem>
            <View style={style.betaSectionHeader}>
              <ThemeText type="heading__component">
                {t(ProfileTexts.sections.newFeatures.heading)}
              </ThemeText>
              <View style={style.betaLabel}>
                <ThemeText
                  color="background_accent_3"
                  style={style.betaLabelText}
                >
                  BETA
                </ThemeText>
              </View>
            </View>
          </Sections.GenericSectionItem>
          <Sections.ToggleSectionItem
            text={t(ProfileTexts.sections.newFeatures.departures)}
            value={isDeparturesV2Enabled}
            onValueChange={setDeparturesV2Enabled}
            testID="newDeparturesToggle"
          />

          <Sections.LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.enrollment.label,
            )}
            onPress={() => navigation.navigate('Profile_EnrollmentScreen')}
            testID="invitationCodeButton"
          />
        </Sections.Section>
        <Sections.Section withPadding>
          <Sections.HeaderSectionItem
            text={t(ProfileTexts.sections.favorites.heading)}
          />
          <Sections.LinkSectionItem
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
          <Sections.LinkSectionItem
            text={t(
              ProfileTexts.sections.favorites.linkSectionItems.departures.label,
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
        </Sections.Section>
        <Sections.Section withPadding>
          <Sections.HeaderSectionItem
            text={t(ProfileTexts.sections.privacy.heading)}
          />
          <Sections.LinkSectionItem
            text={t(
              ProfileTexts.sections.privacy.linkSectionItems.privacy.label,
            )}
            icon={'external-link'}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.privacy.linkSectionItems.privacy.a11yHint,
              ),
            }}
            testID="privacyButton"
            onPress={() => Linking.openURL(privacy_policy_url)}
          />
          <Sections.LinkSectionItem
            text={t(
              ProfileTexts.sections.privacy.linkSectionItems.clearHistory.label,
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
        </Sections.Section>
        {enable_ticketing && (
          <Sections.Section withPadding>
            <Sections.HeaderSectionItem
              text={t(ProfileTexts.sections.information.heading)}
            />
            {ticketingInfoUrl ? (
              <Sections.LinkSectionItem
                icon={<ThemeIcon svg={ExternalLink} />}
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.ticketing
                    .label,
                )}
                testID="ticketingInfoButton"
                onPress={() => Linking.openURL(ticketingInfoUrl)}
              />
            ) : (
              <Sections.LinkSectionItem
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.ticketing
                    .label,
                )}
                testID="ticketingInfoButton"
                onPress={() =>
                  navigation.navigate(
                    APP_ORG === 'atb'
                      ? 'Profile_TicketingInformationScreen'
                      : 'Profile_GenericWebsiteInformationScreen',
                  )
                }
              />
            )}
            {termsInfoUrl ? (
              <Sections.LinkSectionItem
                icon={<ThemeIcon svg={ExternalLink} />}
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.terms
                    .label,
                )}
                testID="termsInfoButton"
                onPress={() => Linking.openURL(termsInfoUrl)}
              />
            ) : (
              <Sections.LinkSectionItem
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.terms
                    .label,
                )}
                testID="termsInfoButton"
                onPress={() =>
                  navigation.navigate(
                    APP_ORG === 'atb'
                      ? 'Profile_TermsInformationScreen'
                      : 'Profile_GenericWebsiteInformationScreen',
                  )
                }
              />
            )}

            {inspectionInfoUrl ? (
              <Sections.LinkSectionItem
                icon={<ThemeIcon svg={ExternalLink} />}
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.inspection
                    .label,
                )}
                testID="inspectionInfoButton"
                onPress={() => Linking.openURL(inspectionInfoUrl)}
              />
            ) : (
              <Sections.LinkSectionItem
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.inspection
                    .label,
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
            )}
          </Sections.Section>
        )}
        {(!!JSON.parse(IS_QA_ENV || 'false') ||
          __DEV__ ||
          customerProfile?.debug) && (
          <Sections.Section withPadding>
            <Sections.HeaderSectionItem text="Developer menu" />
            <Sections.LinkSectionItem
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
            <Sections.LinkSectionItem
              text="Design system"
              testID="designSystemButton"
              onPress={() => navigation.navigate('Profile_DesignSystemScreen')}
            />
            <Sections.LinkSectionItem
              text="Debug"
              testID="debugButton"
              onPress={() => navigation.navigate('Profile_DebugInfoScreen')}
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
      {isLoading && <ActivityIndicatorOverlay />}
    </View>
  );
};

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
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
    backgroundColor: theme.static.background.background_accent_3.background,
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
