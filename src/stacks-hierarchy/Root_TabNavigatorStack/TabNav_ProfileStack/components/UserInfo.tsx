import {
  GenericSectionItem,
  MessageSectionItem,
  Section,
  useSectionItem,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useAuthContext, isLoggedInAuthenticationType} from '@atb/modules/auth';
import {StyleSheet, Theme} from '@atb/theme';
import {dictionary, ProfileTexts, useTranslation} from '@atb/translations';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {View} from 'react-native';
import {NativeTouchable} from '@atb/components/native-touchable';
import {forwardRef} from 'react';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {
  ThemedProfileCardLoggedIn,
  ThemedProfileCardLoggedOut,
} from '@atb/theme/ThemedAssets';
import {Loading} from '@atb/components/loading';

type UserInfoProps = {
  navigateToEditProfileScreen: () => void;
};
export const UserInfo = ({navigateToEditProfileScreen}: UserInfoProps) => {
  const {authenticationType, retryAuth, authStatus} = useAuthContext();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  return (
    <Section>
      {isLoggedInAuthenticationType(authenticationType) && (
        <LoggedInInfoSectionItem onPress={navigateToEditProfileScreen} />
      )}
      {authenticationType === 'anonymous' && <LoggedOutInfoSectionItem />}
      {authStatus === 'fetching-id-token' && (
        <GenericSectionItem
          style={{justifyContent: 'center', flexDirection: 'row'}}
        >
          <Loading />
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
    </Section>
  );
};

type LoggedInInfoSectionItemProps = {
  onPress: () => void;
};
const LoggedInInfoSectionItem = forwardRef<any, LoggedInInfoSectionItemProps>(
  ({onPress, ...props}, focusRef) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const {phoneNumber, email, customerNumber} = useAuthContext();
    const loggedInWith =
      (phoneNumber && formatPhoneNumber(phoneNumber)) || email;
    const {topContainer} = useSectionItem(props);

    return (
      <NativeTouchable
        variant="block"
        {...props}
        ref={focusRef}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={[
          t(ProfileTexts.sections.account.infoItems.heading),
          loggedInWith
            ? t(
                ProfileTexts.sections.account.infoItems.loggedInWith(
                  loggedInWith,
                ),
              )
            : '',
          customerNumber
            ? t(
                ProfileTexts.sections.account.infoItems.customerNumber(
                  numberToAccessibilityString(customerNumber),
                ),
              )
            : '',
        ].join(', ')}
      >
        <View style={[styles.sectionItemContainer, topContainer]}>
          <ThemedProfileCardLoggedIn width={66} height={52} />
          <View style={styles.infoContainer}>
            <ThemeText typography="body__m__strong">
              {t(ProfileTexts.sections.account.infoItems.heading)}
            </ThemeText>
            <View>
              {loggedInWith && (
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  testID="loggedInWith"
                >
                  {t(
                    ProfileTexts.sections.account.infoItems.loggedInWith(
                      loggedInWith,
                    ),
                  )}
                </ThemeText>
              )}
              {customerNumber !== undefined && (
                <ThemeText typography="body__s" type="secondary">
                  {t(
                    ProfileTexts.sections.account.infoItems.customerNumber(
                      customerNumber,
                    ),
                  )}
                </ThemeText>
              )}
            </View>
          </View>
          <ThemeIcon svg={ChevronRight} />
        </View>
      </NativeTouchable>
    );
  },
);

const LoggedOutInfoSectionItem = ({...props}) => {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles();
  const {t} = useTranslation();
  const {customerNumber} = useAuthContext();

  return (
    <View style={[styles.sectionItemContainer, topContainer]}>
      <View style={styles.infoContainer}>
        <ThemeText typography="body__m__strong">
          {t(ProfileTexts.sections.account.infoItems.notLoggedInHeading)}
        </ThemeText>
        {customerNumber !== undefined && (
          <ThemeText typography="body__s" type="secondary">
            {t(
              ProfileTexts.sections.account.infoItems.customerNumber(
                customerNumber,
              ),
            )}
          </ThemeText>
        )}
      </View>
      <ThemedProfileCardLoggedOut width={47} height={64} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  sectionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  infoContainer: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
