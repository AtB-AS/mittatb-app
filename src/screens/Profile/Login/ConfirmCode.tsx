import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {PaymentCreditCardTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {LoginNavigationProp, LoginRootParams} from './';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import {
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
} from '@atb/auth/AuthContext';
import MessageBox from '@atb/message-box';
import ThemeText from '@atb/components/text';
import {ErrorContext} from '@atb/screens/Ticketing/Purchase/Payment/CreditCard/use-terminal-state';
import {ErrorType} from '@atb/api/utils';
import {RouteProp} from '@react-navigation/core';

export type ConfirmCodeRouteParams = {
  phoneNumber: string;
};

type ConfirmCodeRouteProps = RouteProp<LoginRootParams, 'ConfirmCode'>;

export type ConfirmCodeProps = {
  navigation: LoginNavigationProp;
  route: ConfirmCodeRouteProps;
};

export default function ConfirmCode({navigation, route}: ConfirmCodeProps) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {confirmCode, signInWithPhoneNumber} = useAuthState();
  const [code, setCode] = useState('');
  const [error, setError] = useState<
    ConfirmationErrorCode | PhoneSignInErrorCode
  >();
  const [isLoading, setIsLoading] = useState(false);
  const {phoneNumber} = route.params;

  const onLogin = async () => {
    setIsLoading(true);
    const errorCode = await confirmCode(code);
    if (!errorCode) {
      navigation.navigate('ProfileHome');
    } else {
      setError(errorCode);
      setIsLoading(false);
    }
  };

  const onResendCode = async () => {
    setIsLoading(true);
    setError(undefined);
    setCode('');
    const errorCode = await signInWithPhoneNumber(phoneNumber);
    setIsLoading(false);
    if (errorCode) {
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader title={'Logg inn'} leftButton={{type: 'back'}} />

      <View style={styles.mainView}>
        <Sections.Section>
          <Sections.GenericItem>
            <ThemeText>
              Vi har sendt en engangskode på SMS til {phoneNumber}, vennligst
              skriv det inn nedenfor for å logge inn
            </ThemeText>
          </Sections.GenericItem>
          <Sections.TextInput
            label={'Engangskode'}
            placeholder="Skriv inn engangskoden fra SMS'en"
            onChangeText={setCode}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
          />
        </Sections.Section>
        <View style={styles.buttonView}>
          {isLoading && (
            <ActivityIndicator color={theme.text.colors.primary} size="large" />
          )}

          {error && !isLoading && (
            <MessageBox
              containerStyle={{marginBottom: 12}}
              type="error"
              message={translateError(error)}
            />
          )}

          {!isLoading && (
            <>
              <Button
                color={'primary_2'}
                onPress={onLogin}
                text={'Logg inn'}
                disabled={!code}
              />
              <Button
                color={'primary_2'}
                mode={'tertiary'}
                textType="body"
                onPress={onResendCode}
                text={'Send engangspassord på nytt'}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const translateError = (
  error: ConfirmationErrorCode | PhoneSignInErrorCode,
) => {
  switch (error) {
    case 'invalid_code':
      return 'Er du sikker på at engangspassordet er korrekt?';
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
