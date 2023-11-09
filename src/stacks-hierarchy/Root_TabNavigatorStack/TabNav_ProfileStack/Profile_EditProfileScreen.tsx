import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {Text, View} from 'react-native';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import React, {useEffect, useState} from 'react';
import {useTranslation} from '@atb/translations';
import {EditProfileTexts} from '@atb/translations/screens/subscreens/EditProfileScreen';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {useTheme} from '@atb/theme';
import {useAuthState} from '@atb/auth';
import {Button} from '@atb/components/button';
import Delete from '@atb/assets/svg/mono-icons/actions/Delete';
import parsePhoneNumber from 'libphonenumber-js';
import {MessageBox} from '@atb/components/message-box';

type EditProfileScreenProps = ProfileScreenProps<'Profile_EditProfileScreen'>;
export const Profile_EditProfileScreen = ({
  navigation,
}: EditProfileScreenProps) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {authenticationType, customerNumber} = useAuthState();
  // const [customerProfile, setCustomerProfile] = useState<CustomerProfile>();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surName, setSurName] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    // No need to talk to firestore, instead we call get endpoint from back-end where we get: firstName, surName, email, phone
    // firestore()
    //   .collection('customers')
    //   .doc(abtCustomerId)
    //   .onSnapshot((snapshot) => {
    // const data = snapshot.data();
    // console.log('data: ' + data);
    // const profile: CustomerProfile = data
    //   ? {
    //       email: data.email,
    //       firstName: data.firstName,
    //       surname: data.surname,
    //       id: data.id,
    //       phone: data.phone,
    //       debug: data.debug,
    //       enableMobileToken: data.enableMobileToken,
    //       subAccountUids: data.subAccountUids,
    //     }
    //   : {};
    // setCustomerProfile(profile);
    // setEmail(data?.email);
    // setFirstName(data?.firstName);
    // });
  }, []);

  const phoneNumber = parsePhoneNumber(
    '+4700000000',
    // user?.phoneNumber ?? '', // from get endpoint
  )?.formatInternational();

  const onSubmit = () => {
    if (isValidEmail(email)) {
      setSubmitted(true);
      setInvalidEmail(false);
    } else {
      setInvalidEmail(true);
      setSubmitted(false);
    }
  };

  return (
    <FullScreenView
      headerProps={{
        title: t(EditProfileTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={() => (
        <View style={{marginHorizontal: theme.spacings.medium}}>
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
        <View>
          <ThemeText>{t(EditProfileTexts.notProfile)}</ThemeText>
        </View>
      ) : (
        <>
          <View
            style={{
              marginHorizontal: theme.spacings.xLarge,
              marginBottom: theme.spacings.medium,
              marginTop: theme.spacings.xLarge,
            }}
          >
            <ThemeText accessibilityRole="header" color="secondary">
              {t(EditProfileTexts.personalia.header)}
            </ThemeText>
          </View>

          <Section withPadding>
            <TextInputSectionItem
              value={firstName}
              onChangeText={setFirstName}
              label={t(EditProfileTexts.personalia.firstName.label)}
              placeholder={t(EditProfileTexts.personalia.firstName.placeholder)}
              showClear
              inlineLabel={false}
              autoCapitalize="words"
            />
          </Section>
          <Section withPadding>
            <TextInputSectionItem
              value={surName}
              onChangeText={setSurName}
              label={t(EditProfileTexts.personalia.surname.label)}
              placeholder={t(EditProfileTexts.personalia.surname.placeholder)}
              showClear
              inlineLabel={false}
              autoCapitalize="words"
            />
          </Section>
          <Section withPadding>
            <TextInputSectionItem
              value={email}
              onChangeText={setEmail} // we can call an endpoint to check whether the email is associated to another account :) With debounce
              label={t(EditProfileTexts.personalia.email.label)}
              placeholder={t(EditProfileTexts.personalia.email.placeholder)}
              keyboardType="email-address"
              showClear
              errorText={
                invalidEmail
                  ? t(EditProfileTexts.personalia.email.formattingError)
                  : undefined
              }
              inlineLabel={false}
            />
          </Section>

          <View
            style={{
              marginHorizontal: theme.spacings.xLarge,
              marginTop: theme.spacings.medium,
            }}
          >
            <ThemeText>{t(EditProfileTexts.personalia.phone.header)}</ThemeText>
            <ThemeText type="body__secondary" color="secondary">
              {t(EditProfileTexts.personalia.phone.loggedIn(phoneNumber))}
            </ThemeText>
          </View>

          <Section withPadding withTopPadding>
            <Button
              mode="primary"
              text={t(EditProfileTexts.button.save)}
              onPress={onSubmit}
            />
            {submitted && (
              <>
                <MessageBox
                  type="valid"
                  message={t(EditProfileTexts.profileUpdateSuccess)}
                />
                <Text>{firstName}</Text>
                <Text>{surName}</Text>
                <Text>{email}</Text>
              </>
            )}
          </Section>
          <View style={{marginHorizontal: theme.spacings.xLarge}}>
            <ThemeText
              style={{marginVertical: theme.spacings.large}}
              color="secondary"
            >
              {t(EditProfileTexts.profileInfo.profile)}
            </ThemeText>
            <ThemeText>
              {t(EditProfileTexts.profileInfo.loginProvider)}
            </ThemeText>
            <ThemeText
              type="body__secondary"
              color="secondary"
              style={{marginBottom: theme.spacings.large}}
            >
              {t(EditProfileTexts.profileInfo.otp(phoneNumber))}
            </ThemeText>
            <ThemeText>
              {t(EditProfileTexts.profileInfo.customerNumber)}
            </ThemeText>
            <ThemeText type="body__secondary" color="secondary">
              {customerNumber}
            </ThemeText>
          </View>

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
