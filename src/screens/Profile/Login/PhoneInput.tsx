import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {LoginRootParams} from './';
import * as Sections from '@atb/components/sections';
import Button from '@atb/components/button';
import {useAuthState} from '@atb/auth';
import ThemeText from '@atb/components/text';
import {PhoneSignInErrorCode} from '@atb/auth/AuthContext';
import MessageBox from '@atb/components/message-box';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export type AfterLoginParams = {
  routeName: string;
  routeParams?: object;
};

export type PhoneInputRouteParams = {
  /**
   * An optional message to the user why the login is necessary
   */
  loginReason?: string;
  afterLogin: AfterLoginParams;
};

type PhoneInputRouteProps = RouteProp<LoginRootParams, 'PhoneInput'>;

export type PhoneInputProps = {
  navigation: StackNavigationProp<LoginRootParams>;
  route: PhoneInputRouteProps;
};

export default function PhoneInput({navigation, route}: PhoneInputProps) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useThemeStyles();
  const {signInWithPhoneNumber} = useAuthState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();
  const {loginReason, afterLogin} = route.params;

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
      setError(undefined);
      navigation.navigate('ConfirmCode', {afterLogin, phoneNumber});
    } else {
      setIsSubmitting(false);
      setError(errorCode);
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LoginTexts.phoneInput.title)}
        leftButton={{type: 'cancel'}}
      />

      <View style={styles.mainView}>
        {loginReason && (
          <MessageBox
            containerStyle={styles.loginReasonMessage}
            message={loginReason}
          />
        )}
        <Sections.Section>
          <Sections.GenericItem>
            <ThemeText>{t(LoginTexts.phoneInput.description)}</ThemeText>
          </Sections.GenericItem>
          <Sections.TextInput
            label={t(LoginTexts.phoneInput.input.label)}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            showClear={true}
            keyboardType="phone-pad"
            placeholder={t(LoginTexts.phoneInput.input.placeholder)}
          />
        </Sections.Section>
        <View style={styles.buttonView}>
          {isSubmitting && (
            <ActivityIndicator color={theme.text.colors.primary} size="large" />
          )}

          {error && !isSubmitting && (
            <MessageBox
              containerStyle={styles.errorMessage}
              type="error"
              message={t(LoginTexts.phoneInput.errors[error])}
            />
          )}

          {!isSubmitting && (
            <Button
              color={'primary_2'}
              onPress={onNext}
              text={t(LoginTexts.phoneInput.mainButton)}
              disabled={phoneNumber.length !== 8}
            />
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
  loginReasonMessage: {
    marginBottom: theme.spacings.medium,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
}));
