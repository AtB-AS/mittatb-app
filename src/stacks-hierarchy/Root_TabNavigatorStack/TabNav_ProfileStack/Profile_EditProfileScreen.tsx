import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {ActivityIndicator, View} from 'react-native';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from '@atb/translations';
import {EditProfileTexts} from '@atb/translations/screens/subscreens/EditProfileScreen';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useAuthState} from '@atb/auth';
import {Button} from '@atb/components/button';
import Delete from '@atb/assets/svg/mono-icons/actions/Delete';
import {MessageBox} from '@atb/components/message-box';
import {emailAvailable, getProfile, updateProfile} from '@atb/api';
import parsePhoneNumber from 'libphonenumber-js';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {CustomerProfile} from '@atb/api/types/profile';
import {numberToAccessibilityString} from '@atb/utils/accessibility';

type EditProfileScreenProps = ProfileScreenProps<'Profile_EditProfileScreen'>;
type SubmissionStatus =
  | 'loading'
  | 'invalid-email'
  | 'unavailable-email'
  | 'submitted'
  | 'submission-error';
type ProfileState = 'loading' | 'success' | 'error';

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

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<
    SubmissionStatus | undefined
  >(undefined);
  const [profileState, setProfileState] = useState<ProfileState>();

  const isLoadingOrSubmittingProfile =
    submissionStatus === 'loading' || profileState === 'loading';

  const phoneNumber = parsePhoneNumber(
    authPhoneNumber ?? '',
  )?.formatInternational();

  const onSubmit = async () => {
    setSubmissionStatus('loading');

    if (isValidEmail(email)) {
      const {available} = await emailAvailable(email);
      if (available || customerProfile?.email === email) {
        try {
          await updateProfile({
            firstName,
            surname,
            email,
          });
          await fetchProfile();
          setSubmissionStatus('submitted');
        } catch {
          setSubmissionStatus('submission-error');
        }
      } else {
        setSubmissionStatus('unavailable-email');
      }
    } else {
      setSubmissionStatus('invalid-email');
    }
  };

  const getEmailErrorText = (
    status: SubmissionStatus | undefined,
  ): string | undefined => {
    switch (status) {
      case 'invalid-email':
        return t(EditProfileTexts.personalDetails.email.formattingError);
      case 'unavailable-email':
        return t(EditProfileTexts.personalDetails.email.unavailableError);
    }
  };

  const prefillPersonalia = (
    response: string,
    set: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    // Receiving "_" from Entur when firstName or surname are not set on user profile, instead setting them to ""
    if (response === '_') {
      set('');
    } else if (response) {
      set(response);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      setCustomerProfile(response);

      prefillPersonalia(response.email, setEmail);
      prefillPersonalia(response.firstName, setFirstName);
      prefillPersonalia(response.surname, setSurname);

      setProfileState('success');
    } catch {
      setProfileState('error');
    }
  }, []);

  useEffect(() => {
    const getProfileData = async () => {
      setProfileState('loading');
      await fetchProfile();
    };
    getProfileData();
  }, [fetchProfile]);

  return (
    <FullScreenView
      headerProps={{
        title: t(EditProfileTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={() => (
        <View style={styles.parallaxContent}>
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
          <ThemeText>{t(EditProfileTexts.notProfile)}</ThemeText>
        </View>
      ) : (
        <>
          <View style={styles.personalDetails}>
            {profileState === 'loading' && <ActivityIndicator size="large" />}
            <ThemeText accessibilityRole="header" color="secondary">
              {t(EditProfileTexts.personalDetails.header)}
            </ThemeText>
          </View>
          {profileState === 'error' ? (
            <MessageBox
              type="error"
              message={t(EditProfileTexts.personalDetails.error)}
            />
          ) : (
            <>
              <Section withPadding>
                <TextInputSectionItem
                  editable={!isLoadingOrSubmittingProfile}
                  value={firstName}
                  onChangeText={setFirstName}
                  label={t(EditProfileTexts.personalDetails.firstName.label)}
                  placeholder={t(
                    EditProfileTexts.personalDetails.firstName.placeholder,
                  )}
                  showClear
                  inlineLabel={false}
                  autoCapitalize="words"
                />
              </Section>
              <Section withPadding>
                <TextInputSectionItem
                  editable={!isLoadingOrSubmittingProfile}
                  value={surname}
                  onChangeText={setSurname}
                  label={t(EditProfileTexts.personalDetails.surname.label)}
                  placeholder={t(
                    EditProfileTexts.personalDetails.surname.placeholder,
                  )}
                  showClear
                  inlineLabel={false}
                  autoCapitalize="words"
                />
              </Section>
              <Section withPadding>
                <TextInputSectionItem
                  editable={!isLoadingOrSubmittingProfile}
                  value={email}
                  onChangeText={setEmail}
                  label={t(EditProfileTexts.personalDetails.email.label)}
                  placeholder={t(
                    EditProfileTexts.personalDetails.email.placeholder,
                  )}
                  keyboardType="email-address"
                  showClear
                  errorText={getEmailErrorText(submissionStatus)}
                  inlineLabel={false}
                />
              </Section>

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

              <Section withPadding withTopPadding>
                <Button
                  mode="primary"
                  text={t(EditProfileTexts.button.save)}
                  onPress={onSubmit}
                  style={styles.submit}
                  disabled={isLoadingOrSubmittingProfile}
                  rightIcon={
                    submissionStatus === 'loading'
                      ? {
                          svg: ArrowRight,
                          loading: submissionStatus === 'loading',
                        }
                      : undefined
                  }
                />
                {submissionStatus === 'submitted' && (
                  <MessageBox
                    type="valid"
                    message={t(EditProfileTexts.profileUpdate.success)}
                  />
                )}
                {submissionStatus === 'submission-error' && (
                  <MessageBox
                    type="error"
                    message={t(EditProfileTexts.profileUpdate.error)}
                  />
                )}
              </Section>
              <View style={styles.profileContainer}>
                <ThemeText style={styles.profileText} color="secondary">
                  {t(EditProfileTexts.profileInfo.profile)}
                </ThemeText>
                <ThemeText>
                  {t(EditProfileTexts.profileInfo.loginProvider)}
                </ThemeText>
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.profilePhone}
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
                    >
                      {customerNumber}
                    </ThemeText>
                  </>
                )}
              </View>
            </>
          )}
          <Section withPadding withTopPadding withBottomPadding>
            <Button
              mode="primary"
              interactiveColor="interactive_destructive"
              leftIcon={{svg: Delete}}
              text={t(EditProfileTexts.button.deleteProfile)}
              onPress={() => navigation.navigate('Profile_DeleteProfileScreen')}
            />
          </Section>
        </>
      )}
    </FullScreenView>
  );
};

function isValidEmail(email: string) {
  // Just a really simple check to avoid the most obvious wrong ones.
  // More validation is done on the server
  return /^\S+@\S+\.\S+$/.test(email);
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  personalDetails: {
    marginHorizontal: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
    marginTop: theme.spacings.xLarge,
  },
  noAccount: {
    margin: theme.spacings.xLarge,
  },
  parallaxContent: {marginHorizontal: theme.spacings.medium},
  phone: {
    marginHorizontal: theme.spacings.xLarge,
    marginTop: theme.spacings.medium,
  },
  submit: {
    marginBottom: theme.spacings.medium,
  },
  profileContainer: {marginHorizontal: theme.spacings.xLarge},
  profileText: {marginVertical: theme.spacings.large},
  profilePhone: {marginBottom: theme.spacings.large},
}));
