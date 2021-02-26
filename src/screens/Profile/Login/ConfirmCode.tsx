import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
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
      <FullScreenHeader
        title={t(LoginTexts.confirmCode.title)}
        leftButton={{type: 'back'}}
      />

      <View style={styles.mainView}>
        <Sections.Section>
          <Sections.GenericItem>
            <ThemeText>
              {t(LoginTexts.confirmCode.description(phoneNumber))}
            </ThemeText>
          </Sections.GenericItem>
          <Sections.TextInput
            label={t(LoginTexts.confirmCode.input.label)}
            placeholder={t(LoginTexts.confirmCode.input.placeholder)}
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
              containerStyle={styles.messageBox}
              type="error"
              message={t(LoginTexts.confirmCode.errors[error])}
            />
          )}

          {!isLoading && (
            <>
              <Button
                color={'primary_2'}
                onPress={onLogin}
                text={t(LoginTexts.confirmCode.mainButton)}
                disabled={!code}
              />
              <Button
                color={'primary_2'}
                mode={'tertiary'}
                textType="body"
                onPress={onResendCode}
                text={t(LoginTexts.confirmCode.resendButton)}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
  },
  mainView: {
    margin: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
}));
