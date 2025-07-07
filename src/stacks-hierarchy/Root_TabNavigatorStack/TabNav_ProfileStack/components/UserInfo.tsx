import {
  GenericSectionItem,
  MessageSectionItem,
  Section,
  useSectionItem,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useAuthContext} from '@atb/modules/auth';
import {StyleSheet, Theme} from '@atb/theme';
import {dictionary, ProfileTexts, useTranslation} from '@atb/translations';
import {numberToAccessibilityString, spellOut} from '@atb/utils/accessibility';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {ActivityIndicator, View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {forwardRef} from 'react';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemedCrashSmall, ThemedHoldingHands} from '@atb/theme/ThemedAssets';

type UserInfoProps = {
  navigateToEditProfileScreen: () => void;
};
export const UserInfo = ({navigateToEditProfileScreen}: UserInfoProps) => {
  const {authenticationType, retryAuth, authStatus} = useAuthContext();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  return (
    <Section>
      {authenticationType === 'phone' && (
        <LoggedInInfoSectionItem onPress={navigateToEditProfileScreen} />
      )}
      {authenticationType === 'anonymous' && <LoggedOutInfoSectionItem />}
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
    const {phoneNumber, customerNumber} = useAuthContext();
    const formattedPhoneNumber = phoneNumber && formatPhoneNumber(phoneNumber);
    const {topContainer} = useSectionItem(props);

    return (
      <PressableOpacity
        {...props}
        ref={focusRef}
        onPress={onPress}
        accessibilityLabel={[
          t(ProfileTexts.sections.account.infoItems.heading),
          formattedPhoneNumber
            ? t(
                ProfileTexts.sections.account.infoItems.loggedInWith(
                  spellOut(formattedPhoneNumber),
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
          <ThemedHoldingHands width={66} height={52} />
          <View style={styles.infoContainer}>
            <ThemeText typography="body__primary--bold">
              {t(ProfileTexts.sections.account.infoItems.heading)}
            </ThemeText>
            <View>
              {formattedPhoneNumber && (
                <ThemeText typography="body__secondary" color="secondary">
                  {t(
                    ProfileTexts.sections.account.infoItems.loggedInWith(
                      formattedPhoneNumber,
                    ),
                  )}
                </ThemeText>
              )}
              {customerNumber !== undefined && (
                <ThemeText typography="body__secondary" color="secondary">
                  {t(
                    ProfileTexts.sections.account.infoItems.customerNumber(
                      customerNumber,
                    ),
                  )}
                </ThemeText>
              )}
            </View>
          </View>
          <ThemeIcon svg={ArrowRight} />
        </View>
      </PressableOpacity>
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
        <ThemeText typography="body__primary--bold">
          {t(ProfileTexts.sections.account.infoItems.notLoggedInHeading)}
        </ThemeText>
        {customerNumber !== undefined && (
          <ThemeText typography="body__secondary" color="secondary">
            {t(
              ProfileTexts.sections.account.infoItems.customerNumber(
                customerNumber,
              ),
            )}
          </ThemeText>
        )}
      </View>
      <ThemedCrashSmall width={47} height={64} />
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
