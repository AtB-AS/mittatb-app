import {LogIn, LogOut} from '@atb/assets/svg/mono-icons/profile';
import {useAuthContext} from '@atb/modules/auth';
import {ActivityIndicatorOverlay} from '@atb/components/activity-indicator-overlay';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {StyleSheet, Theme} from '@atb/theme';
import {dictionary, ProfileTexts, useTranslation} from '@atb/translations';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {useLocalConfig} from '@atb/utils/use-local-config';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG_NUMBER, IS_QA_ENV} from '@env';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
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
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useStorybookContext} from '@atb/modules/storybook';
import {ContentHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  useHasReservationOrAvailableFareContract,
  useTicketingContext,
} from '@atb/modules/ticketing';

const buildNumber = getBuildNumber();
const version = getVersion();

type ProfileProps = ProfileScreenProps<'Profile_RootScreen'>;

export const Profile_RootScreen = ({navigation}: ProfileProps) => {
  const {enable_ticketing, enable_vipps_login} = useRemoteConfigContext();
  const {clearTokenAtLogout} = useMobileTokenContext();
  const style = useProfileHomeStyle();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const {
    authenticationType,
    signOut,
    phoneNumber: authPhoneNumber,
    customerNumber,
    retryAuth,
    authStatus,
  } = useAuthContext();
  const config = useLocalConfig();
  const {customerProfile} = useTicketingContext();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const {setEnabled: setStorybookEnabled} = useStorybookContext();

  const [isLoading, setIsLoading] = useIsLoading(false);

  const phoneNumber = authPhoneNumber && formatPhoneNumber(authPhoneNumber);
  const {isBonusProgramEnabled} = useFeatureTogglesContext();

  const {logEvent} = useAnalyticsContext();

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
            {!!customerNumber && (
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
            {authenticationType !== 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.login.label,
                )}
                onPress={() => {
                  if (hasReservationOrAvailableFareContract) {
                    navigation.navigate(
                      'Root_LoginAvailableFareContractWarningScreen',
                      {},
                    );
                  } else if (enable_vipps_login) {
                    navigation.navigate('Root_LoginOptionsScreen', {
                      showGoBack: true,
                      transitionOverride: 'slide-from-bottom',
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

          <Section>
            <LinkSectionItem
              text={t(ProfileTexts.sections.settings.heading)}
              onPress={() => navigation.navigate('Profile_SettingsScreen')}
              testID="settingsButton"
            />
          </Section>

          <ContentHeading
            text={t(ProfileTexts.sections.travelAndPurchases.heading)}
          />
          <Section>
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
              text={t(ProfileTexts.sections.favorites.heading)}
              onPress={() => navigation.navigate('Profile_SettingsScreen')}
              testID="settingsButton"
            />
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
            {isBonusProgramEnabled && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.bonus.label,
                )}
                onPress={() => navigation.navigate('Profile_BonusScreen')}
                testID="BonusButton"
              />
            )}
          </Section>
          {enable_ticketing && (
            <>
              <ContentHeading
                text={t(ProfileTexts.sections.information.heading)}
              />
              <Section>
                <LinkSectionItem
                  text={t(ProfileTexts.sections.information.label)}
                  onPress={() =>
                    navigation.navigate('Profile_InformationScreen')
                  }
                  testID="informationButton"
                />
              </Section>
            </>
          )}
          <ContentHeading text={t(ProfileTexts.sections.contact.heading)} />
          <Section>
            <LinkSectionItem
              text={t(ProfileTexts.sections.contact.helpAndContact)}
              onPress={() => {}}
              testID="contactHelpButton"
            />
            <LinkSectionItem
              text={t(ProfileTexts.sections.contact.feedback)}
              onPress={() => {}}
              testID="contactFeedbackButton"
            />
          </Section>
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
