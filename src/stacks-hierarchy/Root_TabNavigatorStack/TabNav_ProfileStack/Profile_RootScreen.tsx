import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {LogIn, LogOut} from '@atb/assets/svg/mono-icons/profile';
import {useAuthState} from '@atb/auth';
import {ActivityIndicatorOverlay} from '@atb/components/activity-indicator-overlay';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, Theme} from '@atb/theme';
import {
  useTicketingState,
  useHasReservationOrActiveFareContract,
} from '@atb/ticketing';
import {
  dictionary,
  getTextForLanguage,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {useLocalConfig} from '@atb/utils/use-local-config';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG_NUMBER, IS_QA_ENV} from '@env';
import React from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ProfileScreenProps} from './navigation-types';
import {destructiveAlert} from './utils';
import {useIsLoading} from '@atb/utils/use-is-loading';
import {
  GenericSectionItem,
  LinkSectionItem,
  MessageSectionItem,
  Section,
} from '@atb/components/sections';

import {ClickableCopy} from './components/ClickableCopy';
import {useAnalytics} from '@atb/analytics';
import {useStorybookContext} from '@atb/storybook/StorybookContext';
import {ContentHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {TransitionPresets} from '@react-navigation/stack';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils.ts';
import {useFeatureToggles} from '@atb/feature-toggles';

const buildNumber = getBuildNumber();
const version = getVersion();

type ProfileProps = ProfileScreenProps<'Profile_RootScreen'>;

export const Profile_RootScreen = ({navigation}: ProfileProps) => {
  const {enable_ticketing, enable_vipps_login} = useRemoteConfig();
  const {clearTokenAtLogout} = useMobileTokenContextState();
  const style = useProfileHomeStyle();
  const {t, language} = useTranslation();
  const analytics = useAnalytics();
  const {
    authenticationType,
    signOut,
    phoneNumber: authPhoneNumber,
    customerNumber,
    retryAuth,
    authStatus,
  } = useAuthState();
  const config = useLocalConfig();
  const {customerProfile} = useTicketingState();
  const hasReservationOrActiveFareContract =
    useHasReservationOrActiveFareContract();
  const {setEnabled: setStorybookEnabled} = useStorybookContext();

  const {configurableLinks} = useFirestoreConfiguration();
  const ticketingInfo = configurableLinks?.ticketingInfo;
  const termsInfo = configurableLinks?.termsInfo;
  const inspectionInfo = configurableLinks?.inspectionInfo;
  const refundInfo = configurableLinks?.refundInfo;
  const a11yStatement = configurableLinks?.appA11yStatement;
  const ticketingInfoUrl = getTextForLanguage(ticketingInfo, language);
  const termsInfoUrl = getTextForLanguage(termsInfo, language);
  const inspectionInfoUrl = getTextForLanguage(inspectionInfo, language);
  const refundInfoUrl = getTextForLanguage(refundInfo, language);
  const a11yStatementUrl = getTextForLanguage(a11yStatement, language);

  const {disable_travelcard} = useRemoteConfig();

  const [isLoading, setIsLoading] = useIsLoading(false);

  const phoneNumber = authPhoneNumber && formatPhoneNumber(authPhoneNumber);
  const {isPushNotificationsEnabled, isTravelAidEnabled} = useFeatureToggles();

  const {logEvent} = useAnalytics();

  return (
    <>
      <FullScreenView
        headerProps={{
          title: t(ProfileTexts.header.title),
          rightButton: {type: 'chat'},
        }}
      >
        <View
          testID="profileHomeScrollView"
          importantForAccessibility="no"
          style={style.contentContainer}
        >
          <ContentHeading text={t(ProfileTexts.sections.account.heading)} />
          <Section>
            {authenticationType === 'phone' && (
              <GenericSectionItem>
                <ThemeText style={style.customerNumberHeading}>
                  {t(ProfileTexts.sections.account.infoItems.phoneNumber)}
                </ThemeText>
                {phoneNumber && (
                  <ThemeText typography="body__secondary" color="secondary">
                    {phoneNumber}
                  </ThemeText>
                )}
              </GenericSectionItem>
            )}
            {customerNumber && (
              <GenericSectionItem>
                <ThemeText style={style.customerNumberHeading}>
                  {t(ProfileTexts.sections.account.infoItems.customerNumber)}
                </ThemeText>
                <ThemeText
                  typography="body__secondary"
                  color="secondary"
                  accessibilityLabel={numberToAccessibilityString(
                    customerNumber,
                  )}
                >
                  {customerNumber}
                </ThemeText>
              </GenericSectionItem>
            )}
            {authStatus === 'fetching-id-token' && (
              <GenericSectionItem
                style={{justifyContent: 'center', flexDirection: 'row'}}
              >
                <ActivityIndicator />
              </GenericSectionItem>
            )}
            {authStatus !== 'authenticated' && (
              <MessageSectionItem
                message={t(ProfileTexts.sections.account.infoItems.claimsError)}
                messageType="error"
                onPressConfig={{
                  action: () => {
                    logEvent('Profile', 'Retry auth');
                    retryAuth();
                  },
                  text: t(dictionary.retry),
                }}
              />
            )}

            {authenticationType == 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.paymentMethods
                    .label,
                )}
                onPress={() =>
                  navigation.navigate('Profile_PaymentMethodsScreen')
                }
              />
            )}

            <LinkSectionItem
              text={t(
                ProfileTexts.sections.account.linkSectionItems.ticketHistory
                  .label,
              )}
              onPress={() =>
                navigation.navigate('Profile_TicketHistorySelectionScreen')
              }
              testID="ticketHistoryButton"
            />
            {authenticationType !== 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.login.label,
                )}
                onPress={() => {
                  if (hasReservationOrActiveFareContract) {
                    navigation.navigate(
                      'Root_LoginActiveFareContractWarningScreen',
                      {},
                    );
                  } else if (enable_vipps_login) {
                    navigation.navigate('Root_LoginOptionsScreen', {
                      showGoBack: true,
                      transitionPreset:
                        TransitionPresets.ModalSlideFromBottomIOS,
                    });
                  } else {
                    navigation.navigate('Root_LoginPhoneInputScreen', {});
                  }
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
                        await clearTokenAtLogout();
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

          <ContentHeading text={t(ProfileTexts.sections.settings.heading)} />
          <Section>
            {isTravelAidEnabled ? (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.settings.linkSectionItems.travelAid
                    .label,
                )}
                onPress={() => navigation.navigate('Profile_TravelAidScreen')}
                testID="travelAidButton"
              />
            ) : null}

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
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.privacy.label,
              )}
              onPress={() => navigation.navigate('Profile_PrivacyScreen')}
              testID="privacyButton"
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

          <ContentHeading text={t(ProfileTexts.sections.newFeatures.heading)} />
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

          <ContentHeading text={t(ProfileTexts.sections.favorites.heading)} />
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
          {enable_ticketing && (
            <>
              <ContentHeading
                text={t(ProfileTexts.sections.information.heading)}
              />
              <Section>
                {ticketingInfoUrl && (
                  <LinkSectionItem
                    icon={<ThemeIcon svg={ExternalLink} />}
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems
                        .ticketing.label,
                    )}
                    testID="ticketingInfoButton"
                    onPress={() => Linking.openURL(ticketingInfoUrl)}
                    accessibility={{
                      accessibilityHint: t(
                        ProfileTexts.sections.information.linkSectionItems
                          .ticketing.a11yLabel,
                      ),
                      accessibilityRole: 'link',
                    }}
                  />
                )}
                {termsInfoUrl && (
                  <LinkSectionItem
                    icon={<ThemeIcon svg={ExternalLink} />}
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems.terms
                        .label,
                    )}
                    testID="termsInfoButton"
                    onPress={() => Linking.openURL(termsInfoUrl)}
                    accessibility={{
                      accessibilityHint: t(
                        ProfileTexts.sections.information.linkSectionItems.terms
                          .a11yLabel,
                      ),
                      accessibilityRole: 'link',
                    }}
                  />
                )}

                {inspectionInfoUrl && (
                  <LinkSectionItem
                    icon={<ThemeIcon svg={ExternalLink} />}
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems
                        .inspection.label,
                    )}
                    testID="inspectionInfoButton"
                    onPress={() => Linking.openURL(inspectionInfoUrl)}
                    accessibility={{
                      accessibilityHint: t(
                        ProfileTexts.sections.information.linkSectionItems
                          .inspection.a11yLabel,
                      ),
                      accessibilityRole: 'link',
                    }}
                  />
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
                    accessibility={{
                      accessibilityHint: t(
                        ProfileTexts.sections.information.linkSectionItems
                          .refund.a11yLabel,
                      ),
                      accessibilityRole: 'link',
                    }}
                  />
                )}
                {a11yStatementUrl && (
                  <LinkSectionItem
                    icon={<ThemeIcon svg={ExternalLink} />}
                    text={t(
                      ProfileTexts.sections.information.linkSectionItems
                        .accessibilityStatement.label,
                    )}
                    testID="a11yStatementButton"
                    onPress={() => Linking.openURL(a11yStatementUrl)}
                    accessibility={{
                      accessibilityHint: t(
                        ProfileTexts.sections.information.linkSectionItems
                          .accessibilityStatement.a11yLabel,
                      ),
                      accessibilityRole: 'link',
                    }}
                  />
                )}
              </Section>
            </>
          )}
          {(!!JSON.parse(IS_QA_ENV || 'false') ||
            __DEV__ ||
            customerProfile?.debug) && (
            <>
              <ContentHeading text="Developer menu" />
              <Section>
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
            <ThemeText typography="body__secondary" color="secondary">
              v{version} ({buildNumber})
            </ThemeText>
            {config?.installId && (
              <ClickableCopy
                successElement={
                  <>
                    <ScreenReaderAnnouncement
                      message={t(ProfileTexts.installId.wasCopiedAlert)}
                    />
                    <ThemeText typography="body__secondary" color="secondary">
                      ✅ {t(ProfileTexts.installId.wasCopiedAlert)}
                    </ThemeText>
                  </>
                }
                copyContent={config.installId}
                accessibilityLabel={t(
                  ProfileTexts.installId.a11yLabel(config.installId),
                )}
                accessibilityHint={t(ProfileTexts.installId.a11yHint)}
              >
                <ThemeText typography="body__secondary" color="secondary">
                  {t(ProfileTexts.installId.label(config.installId))}
                </ThemeText>
              </ClickableCopy>
            )}
            <ThemeText
              typography="body__secondary"
              color="secondary"
              accessibilityLabel={t(
                ProfileTexts.orgNumberA11yLabel(APP_ORG_NUMBER),
              )}
            >
              {t(ProfileTexts.orgNumber(APP_ORG_NUMBER))}
            </ThemeText>
          </View>
        </View>
      </FullScreenView>
      {isLoading && <ActivityIndicatorOverlay />}
    </>
  );
};

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  contentContainer: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
  customerNumberHeading: {
    marginBottom: theme.spacing.xSmall,
  },
  debugInfoContainer: {
    alignItems: 'center',
  },
  betaSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
