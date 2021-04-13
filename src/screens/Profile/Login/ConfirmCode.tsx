import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {LoginRootParams} from './';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import {
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
} from '@atb/auth/AuthContext';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@atb/navigation';
import {AfterLoginParams} from '@atb/screens/Profile/Login/PhoneInput';

export type ConfirmCodeRouteParams = {
  phoneNumber: string;
  afterLogin: AfterLoginParams;
};

type ConfirmCodeRouteProps = RouteProp<LoginRootParams, 'ConfirmCode'>;

export type ConfirmCodeProps = {
  navigation: StackNavigationProp<RootStackParamList>;
  route: ConfirmCodeRouteProps;
};

export default function ConfirmCode({navigation, route}: ConfirmCodeProps) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {
    authenticationType,
    confirmCode,
    signInWithPhoneNumber,
  } = useAuthState();
  const [code, setCode] = useState('');
  const [error, setError] = useState<
    ConfirmationErrorCode | PhoneSignInErrorCode
  >();
  const [isLoading, setIsLoading] = useState(false);
  const {phoneNumber, afterLogin} = route.params;

  const onLogin = async () => {
    setIsLoading(true);
    const errorCode = await confirmCode(code);
    if (!errorCode) {
      navigation.navigate(afterLogin.routeName as any, afterLogin.routeParams);
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

  // User might be automatically logged in with Firebase auth, but only on Android
  // Check authentication from state and see if it is updated while we wait
  useEffect(() => {
    if (authenticationType === 'phone') {
      navigation.navigate(afterLogin.routeName as any, afterLogin.routeParams);
    }
  }, [authenticationType]);

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
            value={code}
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
              <TouchableOpacity
                style={styles.resendButton}
                onPress={onResendCode}
              >
                <ThemeText
                  style={styles.resendButtonText}
                  type="body__primary--underline"
                >
                  {t(LoginTexts.confirmCode.resendButton)}
                </ThemeText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_2.backgroundColor,
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
  resendButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  resendButtonText: {textAlign: 'center'},
}));
