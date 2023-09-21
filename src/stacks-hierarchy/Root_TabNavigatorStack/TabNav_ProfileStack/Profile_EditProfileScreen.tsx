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
import firestore from '@react-native-firebase/firestore';

export type CustomerProfile = {
  email?: string;
  firstName?: string;
  id?: string;
  surname?: string;
  phone?: string;
  debug?: boolean;
  enableMobileToken?: boolean;
  subAccountUids?: string[];
};
type EditProfileScreenProps = ProfileScreenProps<'Profile_EditProfileScreen'>;
export const Profile_EditProfileScreen = ({
  navigation,
}: EditProfileScreenProps) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {authenticationType, user, customerNumber, abtCustomerId} =
    useAuthState();
  // const [customerProfile, setCustomerProfile] = useState<CustomerProfile>();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    firestore()
      .collection('customers')
      .doc(abtCustomerId)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
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
        setEmail(data?.email);
        setFirstName(data?.firstName);
      });
  }, []);

  const phoneNumber = parsePhoneNumber(
    user?.phoneNumber ?? '', // from firebase or authState?
  )?.formatInternational();

  const onSubmit = () => {
    if (isValidEmail(email)) {
      setSubmitted(true);
    } else {
      setInvalidEmail(true);
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
          <Text>{'Looks like you are not logged in'}</Text>
        </View>
      ) : (
        <>
          <Text accessibilityRole="header">
            {t(EditProfileTexts.personalia.header)}
          </Text>

          <Section withPadding withTopPadding>
            <TextInputSectionItem
              value={firstName}
              onChangeText={setFirstName}
              label={t(EditProfileTexts.personalia.firstName.label)}
              placeholder={t(EditProfileTexts.personalia.firstName.placeholder)}
              keyboardType="phone-pad"
              showClear
              inlineLabel={false}
              autoCapitalize={'words'}
            />
          </Section>
          <Section withPadding>
            <TextInputSectionItem
              label={t(EditProfileTexts.personalia.surname.label)}
              placeholder={t(EditProfileTexts.personalia.surname.placeholder)}
              keyboardType="phone-pad"
              showClear
              inlineLabel={false}
            />
          </Section>
          <Section withPadding>
            <TextInputSectionItem
              value={email}
              onChangeText={setEmail}
              label={t(EditProfileTexts.personalia.email.label)}
              placeholder={t(EditProfileTexts.personalia.email.placeholder)}
              keyboardType="email-address"
              showClear
              errorText={
                'Her har det skjedd noe kjemperart kjemperart kjemperart'
              }
              inlineLabel={false}
            />
          </Section>

          <View>
            <ThemeText>{t(EditProfileTexts.personalia.phone.header)}</ThemeText>
            <ThemeText>
              {t(EditProfileTexts.personalia.phone.loggedIn(phoneNumber))}
            </ThemeText>
          </View>
          {submitted && (
            <>
              <Text>{firstName}</Text>
              <Text>{email}</Text>
            </>
          )}
          <Section withPadding withTopPadding>
            <Button
              mode="primary"
              text={t(EditProfileTexts.save)}
              onPress={onSubmit}
            />
          </Section>
          <View>
            <ThemeText>{'About profile'}</ThemeText>
            <ThemeText>{'Log in provider'}</ThemeText>
            <ThemeText>{t(EditProfileTexts.otp(phoneNumber))}</ThemeText>
          </View>
          <View>
            <ThemeText>{t(EditProfileTexts.customerNumber)}</ThemeText>
            <ThemeText>{customerNumber}</ThemeText>
          </View>

          <Section withPadding withTopPadding>
            <Button
              mode="primary"
              interactiveColor={'interactive_destructive'}
              leftIcon={{svg: Delete}}
              text={t(EditProfileTexts.deleteProfile)}
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
