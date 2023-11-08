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
import {MessageBox} from '@atb/components/message-box';
import {SectionHeading} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/SectionHeading';

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
  const {authenticationType, customerNumber, abtCustomerId} = useAuthState();
  // const [customerProfile, setCustomerProfile] = useState<CustomerProfile>();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surName, setSurName] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    firestore()
      .collection('customers')
      .doc(abtCustomerId)
      .onSnapshot((snapshot) => {
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
      });
  }, []);

  const phoneNumber = parsePhoneNumber(
    '+4700000000',
    // user?.phoneNumber ?? '', // from firebase or authState?
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
          <SectionHeading>
            {t(EditProfileTexts.personalia.header)}
          </SectionHeading>
          <ThemeText accessibilityRole="header">
            {t(EditProfileTexts.personalia.header)}
          </ThemeText>

          <Section withPadding withTopPadding>
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
              onChangeText={setEmail}
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

          <View>
            <ThemeText>{t(EditProfileTexts.personalia.phone.header)}</ThemeText>
            <ThemeText>
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
          <View>
            <ThemeText>{t(EditProfileTexts.profileInfo.profile)}</ThemeText>
            <ThemeText>
              {t(EditProfileTexts.profileInfo.loginProvider)}
            </ThemeText>
            <ThemeText>
              {t(EditProfileTexts.profileInfo.otp(phoneNumber))}
            </ThemeText>
          </View>
          <View>
            <ThemeText>
              {t(EditProfileTexts.profileInfo.customerNumber)}
            </ThemeText>
            <ThemeText>{customerNumber}</ThemeText>
          </View>

          <Section withPadding withTopPadding>
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
