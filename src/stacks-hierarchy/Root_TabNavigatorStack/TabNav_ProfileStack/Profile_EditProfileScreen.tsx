import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {Text, View} from 'react-native';
import {
  PhoneInputSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {EditProfileTexts} from '@atb/translations/screens/subscreens/EditProfileScreen';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {useTheme} from '@atb/theme';
import {useAuthState} from '@atb/auth';
import {Button} from '@atb/components/button';
import Delete from '@atb/assets/svg/mono-icons/actions/Delete';
import parsePhoneNumber from 'libphonenumber-js';

type EditProfileScreenProps = ProfileScreenProps<'Profile_EditProfileScreen'>;
export const Profile_EditProfileScreen = ({
  navigation,
}: EditProfileScreenProps) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {authenticationType, user, customerNumber} = useAuthState();
  const phoneNumber = parsePhoneNumber(
    user?.phoneNumber ?? '',
  )?.formatInternational();

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
      <>
        <Text accessibilityRole="header">
          {t(EditProfileTexts.personalia.header)}
        </Text>

        <Section withPadding withTopPadding>
          <TextInputSectionItem
            label={t(EditProfileTexts.personalia.firstName.label)}
            placeholder={t(EditProfileTexts.personalia.firstName.placeholder)}
            keyboardType="phone-pad"
            showClear
            inlineLabel={false}
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
            label={'E-mail address'}
            placeholder={'Add e-mail address'}
            keyboardType="email-address"
            showClear
            inlineLabel={false}
          />
        </Section>
        {authenticationType !== 'phone' ? (
          <Section withPadding>
            <PhoneInputSectionItem
              label={t(EditProfileTexts.personalia.phone.header)}
              prefix={'47'}
              onChangePrefix={() => {}}
              showClear
            />
          </Section>
        ) : (
          <View>
            <ThemeText>{t(EditProfileTexts.personalia.phone.header)}</ThemeText>
            <ThemeText>
              {t(EditProfileTexts.personalia.phone.loggedIn(phoneNumber))}
            </ThemeText>
          </View>
        )}
        <Section withPadding withTopPadding>
          <Button
            mode="primary"
            text={t(EditProfileTexts.save)}
            onPress={() => {}}
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
    </FullScreenView>
  );
};
