import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {LoginNavigationProp} from './';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import ThemeText from '@atb/components/text';
import {PhoneSignInErrorCode} from '@atb/auth/AuthContext';
import MessageBox from '@atb/message-box';

export type PhoneInputProps = {
  navigation: LoginNavigationProp;
};

export default function PhoneInput({navigation}: PhoneInputProps) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsSubmitting(false);
      }),
    [navigation],
  );

  const onNext = async () => {
    setIsSubmitting(true);
    const errorCode = await signInWithPhoneNumber(phoneNumber);
    if (!errorCode) {
      navigation.navigate('ConfirmCode', {phoneNumber});
    } else {
      setIsSubmitting(false);
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader title={'Logg Inn'} leftButton={{type: 'cancel'}} />

      <View style={styles.mainView}>
        <Sections.Section>
          <Sections.GenericItem>
            <ThemeText>Telefonnummer</ThemeText>
          </Sections.GenericItem>
          <Sections.TextInput
            label={'+ 47'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            showClear={true}
            keyboardType="phone-pad"
            placeholder={'Telefonnummer'}
          />
        </Sections.Section>
        <View style={styles.buttonView}>
          {isSubmitting && (
            <ActivityIndicator color={theme.text.colors.primary} size="large" />
          )}

          {error && !isSubmitting && (
            <MessageBox
              containerStyle={{marginBottom: 12}}
              type="error"
              message={translateError(error)}
            />
          )}

          {!isSubmitting && (
            <Button
              color={'primary_2'}
              onPress={onNext}
              text={'Neste'}
              disabled={phoneNumber.length !== 8}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const translateError = (error: PhoneSignInErrorCode) => {
  switch (error) {
    case 'invalid_phone':
      return 'Er du sikker på at telefonnummeret er korrekt?';
    default:
      return 'Oops - noe gikk galt. Supert om du prøver på nytt 🤞';
  }
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
  },
  mainView: {
    margin: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
}));
