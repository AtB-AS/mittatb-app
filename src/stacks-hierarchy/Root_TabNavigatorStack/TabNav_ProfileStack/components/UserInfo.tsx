import {LogIn, LogOut} from '@atb/assets/svg/mono-icons/profile';
import {
  GenericSectionItem,
  LinkSectionItem,
  MessageSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';
import {StyleSheet, Theme} from '@atb/theme';
import {dictionary, ProfileTexts, useTranslation} from '@atb/translations';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {ActivityIndicator} from 'react-native';
import {destructiveAlert} from '../utils';
import Bugsnag from '@bugsnag/react-native';
import {useMobileTokenContext} from '@atb/modules/mobile-token';

type UserInfoProps = {
  setShowLoadingOverlay: (isLoading: boolean) => void;
  navigateToLoginavailableFareContractWarningScreen: () => void;
  navigateToLoginOptionsScreen: () => void;
  navigateToLoginPhoneInputScreen: () => void;
};
export const UserInfo = ({
  setShowLoadingOverlay,
  navigateToLoginavailableFareContractWarningScreen,
  navigateToLoginOptionsScreen,
  navigateToLoginPhoneInputScreen,
}: UserInfoProps) => {
  const {
    authenticationType,
    signOut,
    phoneNumber: authPhoneNumber,
    customerNumber,
    retryAuth,
    authStatus,
  } = useAuthContext();
  const phoneNumber = authPhoneNumber && formatPhoneNumber(authPhoneNumber);
  const styles = useStyles();
  const {t} = useTranslation();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const {enable_vipps_login} = useRemoteConfigContext();
  const analytics = useAnalyticsContext();
  const {clearTokenAtLogout} = useMobileTokenContext();

  return (
    <Section>
      {authenticationType === 'phone' && (
        <GenericSectionItem>
          <ThemeText style={styles.customerNumberHeading}>
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
          <ThemeText style={styles.customerNumberHeading}>
            {t(ProfileTexts.sections.account.infoItems.customerNumber)}
          </ThemeText>
          <ThemeText
            typography="body__secondary"
            color="secondary"
            accessibilityLabel={numberToAccessibilityString(customerNumber)}
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
              analytics.logEvent('Profile', 'Retry auth');
              retryAuth();
            },
            text: t(dictionary.retry),
          }}
        />
      )}
      {authenticationType !== 'phone' && (
        <LinkSectionItem
          text={t(ProfileTexts.sections.account.linkSectionItems.login.label)}
          onPress={() => {
            if (hasReservationOrAvailableFareContract) {
              navigateToLoginavailableFareContractWarningScreen();
            } else if (enable_vipps_login) {
              navigateToLoginOptionsScreen();
            } else {
              navigateToLoginPhoneInputScreen();
            }
          }}
          icon={<ThemeIcon svg={LogIn} />}
          testID="loginButton"
        />
      )}
      {authenticationType === 'phone' && (
        <LinkSectionItem
          text={t(ProfileTexts.sections.account.linkSectionItems.logout.label)}
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
                setShowLoadingOverlay(true);
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
                  setShowLoadingOverlay(false);
                }
              },
            })
          }
          testID="logoutButton"
        />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
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
}));
