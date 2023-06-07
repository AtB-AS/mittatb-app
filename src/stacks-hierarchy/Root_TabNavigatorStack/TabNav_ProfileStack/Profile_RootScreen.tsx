import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {LogIn, LogOut} from '@atb/assets/svg/mono-icons/profile';
import {useAuthState} from '@atb/auth';
import {updateMetadata} from '@atb/chat/metadata';
import {ActivityIndicatorOverlay} from '@atb/components/activity-indicator-overlay';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
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
import DeleteProfileTexts from '@atb/translations/screens/subscreens/DeleteProfile';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {useCopyWithOpacityFade} from '@atb/utils/use-copy-with-countdown';
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
import {useDeparturesV2Enabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';
import {
  GenericSectionItem,
  HeaderSectionItem,
  LinkSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {BetaTag} from '@atb/components/beta-tag';

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
  const refundInfo = configurableLinks?.refundInfo
    ? configurableLinks?.refundInfo
    : undefined;
  const ticketingInfoUrl = getTextForLanguage(ticketingInfo, language);
  const termsInfoUrl = getTextForLanguage(termsInfo, language);
  const inspectionInfoUrl = getTextForLanguage(inspectionInfo, language);
  const refundInfoUrl = getTextForLanguage(refundInfo, language);

  const {enable_departures_v2_as_default, disable_travelcard} =
    useRemoteConfig();
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
          <Section withPadding>
            <HeaderSectionItem
              text={t(ProfileTexts.sections.account.heading)}
            />
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
              <LinkSectionItem
                text={t(DeleteProfileTexts.header.title)}
                onPress={() =>
                  navigation.navigate('Profile_DeleteProfileScreen')
                }
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
        ) : null}
        <Section withPadding>
          <HeaderSectionItem text={t(ProfileTexts.sections.settings.heading)} />
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

          {authenticationType === 'phone' && hasEnabledMobileToken && (
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
              label={'new'}
              onPress={() => navigation.navigate('Profile_TravelTokenScreen')}
              testID="travelTokenButton"
            />
          )}
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.appearance.label,
            )}
            onPress={() => navigation.navigate('Profile_AppearanceScreen')}
            testID="appearanceButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.startScreen.label,
            )}
            onPress={() =>
              navigation.navigate('Profile_SelectStartScreenScreen')
            }
            testID="startScreenButton"
          />
          {enable_i18n && (
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.language.label,
              )}
              onPress={() => navigation.navigate('Profile_LanguageScreen')}
              testID="languageButton"
            />
          )}
        </Section>
        <Section withPadding>
          <GenericSectionItem>
            <View style={style.betaSectionHeader}>
              <ThemeText type="heading__component">
                {t(ProfileTexts.sections.newFeatures.heading)}
              </ThemeText>
              <BetaTag style={style.betaTag} />
            </View>
          </GenericSectionItem>
          <ToggleSectionItem
            text={t(ProfileTexts.sections.newFeatures.departures)}
            value={isDeparturesV2Enabled}
            onValueChange={setDeparturesV2Enabled}
            testID="newDeparturesToggle"
          />

          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.enrollment.label,
            )}
            onPress={() => navigation.navigate('Profile_EnrollmentScreen')}
            testID="invitationCodeButton"
          />
        </Section>
        <Section withPadding>
          <HeaderSectionItem
            text={t(ProfileTexts.sections.favorites.heading)}
          />
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
        </Section>
        <Section withPadding>
          <HeaderSectionItem text={t(ProfileTexts.sections.privacy.heading)} />
          <LinkSectionItem
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
          <LinkSectionItem
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
        </Section>
        {enable_ticketing && (
          <Section withPadding>
            <HeaderSectionItem
              text={t(ProfileTexts.sections.information.heading)}
            />
            {APP_ORG === 'atb' ? (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.information.linkSectionItems.ticketing
                    .label,
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
                    ProfileTexts.sections.information.linkSectionItems.ticketing
                      .label,
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
        )}
        {(!!JSON.parse(IS_QA_ENV || 'false') ||
          __DEV__ ||
          customerProfile?.debug) && (
          <Section withPadding>
            <HeaderSectionItem text="Developer menu" />
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
              onPress={() => navigation.navigate('Profile_DesignSystemScreen')}
            />
            <LinkSectionItem
              text="Debug"
              testID="debugButton"
              onPress={() => navigation.navigate('Profile_DebugInfoScreen')}
            />
          </Section>
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
  betaTag: {
    marginHorizontal: theme.spacings.small,
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
}));
