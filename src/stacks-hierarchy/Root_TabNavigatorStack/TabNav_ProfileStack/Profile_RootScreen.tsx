import {
  LogIn,
  LogOut,
  NewConcept,
  Settings,
} from '@atb/assets/svg/mono-icons/profile';
import {ActivityIndicatorOverlay} from '@atb/components/activity-indicator-overlay';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useAuthContext} from '@atb/modules/auth';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import {useIsLoading} from '@atb/utils/use-is-loading';
import {useLocalConfig} from '@atb/utils/use-local-config';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG_NUMBER, IS_QA_ENV} from '@env';
import React, {useState} from 'react';
import {View} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ProfileScreenProps} from './navigation-types';
import {destructiveAlert} from './utils';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useStorybookContext} from '@atb/modules/storybook';
import {
  useGetHasReservationOrAvailableFareContract,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {ClickableCopy} from './components/ClickableCopy';
import {UserInfo} from './components/UserInfo';
import {Button} from '@atb/components/button';
import {Card, Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import {Star} from '@atb/assets/svg/mono-icons/bonus';
import {Favorite, Parking} from '@atb/assets/svg/mono-icons/places';
import {Info, Unknown} from '@atb/assets/svg/mono-icons/status';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {useChatUnreadCount} from '@atb/modules/chat';
import Intercom, {Space} from '@intercom/intercom-react-native';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {NativePaymentHandler} from '@atb/specs/NativePaymentHandler';
import {MessageInfoBox} from '@atb/components/message-info-box';

const buildNumber = getBuildNumber();
const version = getVersion();

type ProfileProps = ProfileScreenProps<'Profile_RootScreen'>;

export const Profile_RootScreen = ({navigation}: ProfileProps) => {
  const {enable_ticketing, enable_vipps_login} = useRemoteConfigContext();
  const {clearTokenAtLogout} = useMobileTokenContext();
  const style = useProfileHomeStyle();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const {authenticationType, signOut} = useAuthContext();
  const config = useLocalConfig();
  const {customerProfile} = useTicketingContext();
  const getHasReservationOrAvailableFareContract =
    useGetHasReservationOrAvailableFareContract();
  const {setEnabled: setStorybookEnabled} = useStorybookContext();
  const [isLoading, setIsLoading] = useIsLoading(false);
  const {
    isBonusProgramEnabled,
    isSmartParkAndRideEnabled,
    isEventStreamEnabled,
    isEventStreamFareContractsEnabled,
  } = useFeatureTogglesContext();
  const unreadCount = useChatUnreadCount();
  const {theme} = useThemeContext();
  const {enable_intercom} = useRemoteConfigContext();
  const neutralContrastColor = theme.color.background.neutral[1];

  const focusRef = useFocusOnLoad(navigation);

  const [applePayResult, setApplePayResult] = useState<boolean | null>(null);

  return (
    <>
      <FullScreenView
        focusRef={focusRef}
        headerProps={{
          title: t(ProfileTexts.header.title),
          color: neutralContrastColor,
        }}
        parallaxContent={(focusRef) => (
          <ScreenHeading
            ref={focusRef}
            text={t(ProfileTexts.header.title)}
            isLarge={true}
          />
        )}
      >
        <View
          testID="profileHomeScrollView"
          importantForAccessibility="no"
          style={style.contentContainer}
        >
          <View style={style.mediumGap}>
            <Button
              expanded={true}
              text="Apple pay!"
              onPress={() => {
                NativePaymentHandler.startPayment(100, (paymentData) => {
                  console.log('Payment data:', paymentData);
                  setApplePayResult(paymentData !== null);
                });
              }}
            />
            {applePayResult !== null && (
              <MessageInfoBox
                type={applePayResult ? 'valid' : 'error'}
                message={
                  applePayResult
                    ? 'You did the apple pay! 🍎'
                    : ':( no apple pay'
                }
              />
            )}
            <GlobalMessage
              style={style.globalMessage}
              globalMessageContext={GlobalMessageContextEnum.appProfile}
              textColor={neutralContrastColor}
            />
            <UserInfo
              navigateToEditProfileScreen={() =>
                navigation.navigate('Profile_EditProfileScreen')
              }
            />
            {authenticationType === 'anonymous' && (
              <Button
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.login.label,
                )}
                mode="primary"
                expanded={true}
                onPress={() => {
                  if (getHasReservationOrAvailableFareContract()) {
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
                rightIcon={{svg: LogIn}}
                testID="loginButton"
              />
            )}

            <Section>
              <LinkSectionItem
                text={t(ProfileTexts.sections.settings.heading)}
                leftIcon={{svg: Settings}}
                onPress={() => navigation.navigate('Profile_SettingsScreen')}
                testID="settingsButton"
              />
            </Section>
            {isBonusProgramEnabled && (
              <Section>
                <LinkSectionItem
                  text={t(
                    ProfileTexts.sections.account.linkSectionItems.bonus.label,
                  )}
                  leftIcon={{svg: Star}}
                  onPress={() => navigation.navigate('Profile_BonusScreen')}
                  testID="BonusButton"
                  label="new"
                />
              </Section>
            )}
          </View>

          <ContentHeading
            text={t(ProfileTexts.sections.travelAndPurchases.heading)}
          />
          <Section>
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.account.linkSectionItems.purchaseHistory
                  .label,
              )}
              leftIcon={{svg: Receipt}}
              onPress={() =>
                navigation.navigate('Profile_PurchaseHistoryScreen')
              }
              testID="ticketHistoryButton"
            />
            {authenticationType == 'phone' && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems.paymentMethods
                    .label,
                )}
                leftIcon={{svg: Card}}
                onPress={() =>
                  navigation.navigate('Profile_PaymentMethodsScreen')
                }
              />
            )}
            <LinkSectionItem
              text={t(ProfileTexts.sections.favorites.heading)}
              leftIcon={{svg: Favorite}}
              onPress={() => navigation.navigate('Profile_FavoriteScreen')}
              testID="favoriteButton"
            />
          </Section>

          <ContentHeading text={t(ProfileTexts.sections.newFeatures.heading)} />
          <Section>
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.enrollment
                  .label,
              )}
              leftIcon={{svg: NewConcept}}
              onPress={() => navigation.navigate('Profile_EnrollmentScreen')}
              testID="invitationCodeButton"
            />
            {isSmartParkAndRideEnabled && (
              <LinkSectionItem
                text={t(
                  ProfileTexts.sections.account.linkSectionItems
                    .smartParkAndRide.label,
                )}
                leftIcon={{svg: Parking}}
                onPress={() => {
                  analytics.logEvent(
                    'Smart Park & Ride',
                    'Profile button clicked',
                  );
                  navigation.navigate('Profile_SmartParkAndRideScreen', {});
                }}
                label="new"
                testID="smartParkAndRideButton"
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
                  leftIcon={{svg: Info}}
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
              leftIcon={{svg: Unknown}}
              text={t(ProfileTexts.sections.contact.helpAndContact)}
              onPress={() =>
                navigation.navigate('Profile_HelpAndContactScreen')
              }
              testID="contactButton"
            />
            {enable_intercom && (
              <LinkSectionItem
                leftIcon={{
                  svg: Chat,
                  notificationColor: unreadCount
                    ? theme.color.status.error.primary
                    : undefined,
                }}
                text={t(ProfileTexts.sections.contact.chat)}
                onPress={() => {
                  unreadCount
                    ? Intercom.presentSpace(Space.messages)
                    : Intercom.presentSpace(Space.home);
                  analytics.logEvent(
                    'Contact',
                    'Send Intercom message clicked',
                  );
                }}
              />
            )}
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
          {authenticationType === 'phone' && (
            <Button
              text={t(
                ProfileTexts.sections.account.linkSectionItems.logout.label,
              )}
              rightIcon={{svg: LogOut}}
              expanded={true}
              style={style.logoutButton}
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
                    ProfileTexts.sections.account.linkSectionItems.logout.alert
                      .cancel,
                  ),
                  confirmAlertString: t(
                    ProfileTexts.sections.account.linkSectionItems.logout.alert
                      .confirm,
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
          <View style={style.debugInfoContainer}>
            <ThemeText typography="body__s" color="secondary">
              v{version} ({buildNumber}){' '}
              {isEventStreamEnabled && isEventStreamFareContractsEnabled && 'S'}
            </ThemeText>
            {config?.installId && (
              <ClickableCopy
                successElement={
                  <>
                    <ScreenReaderAnnouncement
                      message={t(ProfileTexts.installId.wasCopiedAlert)}
                    />
                    <ThemeText typography="body__s" color="secondary">
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
                <ThemeText typography="body__s" color="secondary">
                  {t(ProfileTexts.installId.label(config.installId))}
                </ThemeText>
              </ClickableCopy>
            )}
            <ThemeText
              typography="body__s"
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
  mediumGap: {
    rowGap: theme.spacing.medium,
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
  logoutButton: {
    marginVertical: theme.spacing.large,
  },
  globalMessage: {
    marginVertical: theme.spacing.xSmall,
  },
}));
