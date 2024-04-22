import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {ActivityIndicator, View} from 'react-native';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import React, {useEffect, useState} from 'react';
import {dictionary, useTranslation} from '@atb/translations';
import {EditProfileTexts} from '@atb/translations/screens/subscreens/EditProfileScreen';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useAuthState} from '@atb/auth';
import {Button} from '@atb/components/button';
import Delete from '@atb/assets/svg/mono-icons/actions/Delete';
import {MessageInfoBox} from '@atb/components/message-info-box';
import parsePhoneNumber from 'libphonenumber-js';
import {numberToAccessibilityString} from '@atb/utils/accessibility';
import {isValidEmail} from '@atb/utils/validation';
import {CustomerProfile} from '@atb/api/types/profile';
import {useProfileQuery, useProfileUpdateMutation} from '@atb/queries';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type EditProfileScreenProps = ProfileScreenProps<'Profile_EditProfileScreen'>;

export const Profile_EditProfileScreen = ({
  navigation,
}: EditProfileScreenProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    authenticationType,
    customerNumber,
    phoneNumber: authPhoneNumber,
  } = useAuthState();
  const {
    mutate: updateProfile,
    isLoading: isLoadingUpdateProfile,
    isError: isErrorUpdateProfile,
    isSuccess: isSuccessUpdateProfile,
    error: errorUpdate,
  } = useProfileUpdateMutation();
  const {
    data: customerProfile,
    isLoading: isLoadingGetProfile,
    isError: isErrorGetProfile,
    refetch: refetchProfile,
    isRefetching: isRefetchingProfile,
  } = useProfileQuery();
  const {disable_email_field_in_profile_page} = useRemoteConfig();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const isLoadingOrSubmittingProfile =
    isLoadingUpdateProfile || isLoadingGetProfile;

  const phoneNumber = parsePhoneNumber(
    authPhoneNumber ?? '',
  )?.formatInternational();

  const onSubmit = async () => {
    if (isValidEmail(email) || email === '') {
      updateProfile({firstName, surname, email});
    } else {
      setInvalidEmail(true);
    }
  };

  const getEmailErrorText = (
    invalidEmail: boolean,
    errorOnUpdate: any,
  ): string | undefined => {
    if (errorOnUpdate?.status === 602) {
      return t(EditProfileTexts.personalDetails.email.unavailableError);
    } else if (invalidEmail) {
      return t(EditProfileTexts.personalDetails.email.formattingError);
    }
  };

  useEffect(() => {
    if (customerProfile) {
      const profile: CustomerProfile = customerProfile;

      // Receiving "_" from Entur when firstName or surname are not set on user profile, instead setting them to ""
      const nonUnderscoreString = (str: string) => (str === '_' ? '' : str);
      setFirstName(nonUnderscoreString(profile.firstName));
      setSurname(nonUnderscoreString(profile.surname));
      setEmail(profile.email);
    }
  }, [customerProfile]);

  return (
    <FullScreenView
      headerProps={{
        title: t(EditProfileTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <View style={styles.parallaxContent} ref={focusRef} accessible={true}>
          <ThemeText
            type="heading--medium"
            color="background_accent_0"
            style={{flexShrink: 1}}
          >
            {t(EditProfileTexts.header.title)}
          </ThemeText>
        </View>
      )}
    >
      {authenticationType !== 'phone' ? (
        <View style={styles.noAccount}>
          <MessageInfoBox
            type="error"
            message={t(EditProfileTexts.noProfile)}
          />
        </View>
      ) : (
        <>
          <View style={styles.personalDetails}>
            <ThemeText accessibilityRole="header" color="secondary">
              {t(EditProfileTexts.personalDetails.header)}
            </ThemeText>
            {(isLoadingGetProfile || isRefetchingProfile) && (
              <ActivityIndicator size="large" />
            )}
          </View>
          {isErrorGetProfile ? (
            <View style={styles.profileError}>
              <MessageInfoBox
                type="error"
                message={t(EditProfileTexts.personalDetails.error)}
                onPressConfig={{
                  action: () => refetchProfile(),
                  text: t(dictionary.retry),
                }}
              />
            </View>
          ) : (
            <>
              <Section style={styles.section}>
                <TextInputSectionItem
                  editable={!isLoadingOrSubmittingProfile}
                  value={firstName}
                  onChangeText={setFirstName}
                  label={t(EditProfileTexts.personalDetails.firstName.label)}
                  placeholder={t(
                    EditProfileTexts.personalDetails.firstName.placeholder,
                  )}
                  showClear={!isLoadingOrSubmittingProfile}
                  inlineLabel={false}
                  autoCapitalize="words"
                />
              </Section>
              <Section style={styles.section}>
                <TextInputSectionItem
                  editable={!isLoadingOrSubmittingProfile}
                  value={surname}
                  onChangeText={setSurname}
                  label={t(EditProfileTexts.personalDetails.surname.label)}
                  placeholder={t(
                    EditProfileTexts.personalDetails.surname.placeholder,
                  )}
                  showClear={!isLoadingOrSubmittingProfile}
                  inlineLabel={false}
                  autoCapitalize="words"
                />
              </Section>
              {disable_email_field_in_profile_page ? (
                <View style={styles.phone}>
                  <ThemeText>
                    {t(EditProfileTexts.personalDetails.email.label)}
                  </ThemeText>
                  <ThemeText type="body__secondary" color="secondary">
                    {t(
                      EditProfileTexts.personalDetails.email
                        .disabledWithRemoteConfig,
                    )}
                  </ThemeText>
                </View>
              ) : (
                <Section style={[styles.section, styles.sectionBottomPadding]}>
                  <TextInputSectionItem
                    editable={!isLoadingOrSubmittingProfile}
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      setInvalidEmail(false);
                    }}
                    label={t(EditProfileTexts.personalDetails.email.label)}
                    placeholder={t(
                      EditProfileTexts.personalDetails.email.placeholder,
                    )}
                    keyboardType="email-address"
                    autoComplete="email"
                    showClear={!isLoadingOrSubmittingProfile}
                    errorText={getEmailErrorText(invalidEmail, errorUpdate)}
                    inlineLabel={false}
                    autoCapitalize="none"
                  />
                </Section>
              )}
              <View style={styles.phone}>
                <ThemeText>
                  {t(EditProfileTexts.personalDetails.phone.header)}
                </ThemeText>
                <ThemeText type="body__secondary" color="secondary">
                  {t(
                    EditProfileTexts.personalDetails.phone.loggedIn(
                      phoneNumber,
                    ),
                  )}
                </ThemeText>
              </View>

              <View style={styles.submitSection}>
                <Button
                  mode="primary"
                  text={t(EditProfileTexts.button.save)}
                  onPress={onSubmit}
                  style={styles.submitContent}
                  disabled={isLoadingOrSubmittingProfile}
                  loading={isLoadingUpdateProfile}
                />
                {isSuccessUpdateProfile && (
                  <MessageInfoBox
                    type="valid"
                    message={t(EditProfileTexts.profileUpdate.success)}
                    style={styles.submitContent}
                  />
                )}
                {isErrorUpdateProfile && (
                  <MessageInfoBox
                    style={styles.submitContent}
                    type="error"
                    message={t(EditProfileTexts.profileUpdate.error)}
                  />
                )}
              </View>
            </>
          )}
          <View style={styles.profileContainer}>
            <ThemeText color="secondary" style={styles.profileItem}>
              {t(EditProfileTexts.profileInfo.profile)}
            </ThemeText>
            <ThemeText>
              {t(EditProfileTexts.profileInfo.loginProvider)}
            </ThemeText>
            <ThemeText
              type="body__secondary"
              color="secondary"
              style={styles.profileItem}
            >
              {t(EditProfileTexts.profileInfo.otp(phoneNumber))}
            </ThemeText>
            {customerNumber && (
              <>
                <ThemeText>
                  {t(EditProfileTexts.profileInfo.customerNumber)}
                </ThemeText>
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  accessibilityLabel={numberToAccessibilityString(
                    customerNumber,
                  )}
                  style={styles.profileItem}
                >
                  {customerNumber}
                </ThemeText>
              </>
            )}
          </View>
          <View style={styles.deleteProfile}>
            <Button
              mode="primary"
              interactiveColor="interactive_destructive"
              leftIcon={{svg: Delete}}
              text={t(EditProfileTexts.button.deleteProfile)}
              onPress={() => navigation.navigate('Profile_DeleteProfileScreen')}
            />
          </View>
        </>
      )}
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  personalDetails: {
    marginHorizontal: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
    marginTop: theme.spacings.xLarge,
  },
  noAccount: {
    marginHorizontal: theme.spacings.medium,
    marginVertical: theme.spacings.xLarge,
  },
  parallaxContent: {marginHorizontal: theme.spacings.medium},
  profileError: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  phone: {
    marginHorizontal: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
  },
  submitSection: {
    margin: theme.spacings.medium,
  },
  submitContent: {
    marginBottom: theme.spacings.medium,
  },
  section: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
  },
  sectionBottomPadding: {
    marginBottom: theme.spacings.large,
  },
  profileContainer: {
    marginHorizontal: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
  },
  profileItem: {marginBottom: theme.spacings.large},
  deleteProfile: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
  },
}));
