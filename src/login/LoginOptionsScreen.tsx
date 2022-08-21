import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Linking, ScrollView, View} from 'react-native';
import {useAuthState} from '@atb/auth';
import ThemeText from '@atb/components/text';
import {VippsSignInErrorCode} from '@atb/auth/AuthContext';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StaticColorByType} from '@atb/theme/colors';
import {
  getOrCreateVippsUserCustomToken,
  authorizeUser,
} from '@atb/api/vipps-login/api';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {parseUrl} from 'query-string';
import storage from '@atb/storage';
import {LoginInAppStackParams} from '@atb/login/in-app/LoginInAppStack';
import {AfterLoginParams} from '@atb/login/types';
import {VippsLoginButton} from '@atb/components/vipps-login-button';
import MessageBox from '@atb/components/message-box';
import * as Sections from '@atb/components/sections';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type LoginOptionsRouteParams = {
  afterLogin: AfterLoginParams;
};

type LoginOptionsRouteProps = RouteProp<
  LoginInAppStackParams,
  'LoginOptionsScreen'
>;

type LoginOptionsProps = {
  route: LoginOptionsRouteProps;
};

export default function LoginOptionsScreen({
  route: {
    params: {afterLogin},
  },
}: LoginOptionsProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {signInWithCustomToken} = useAuthState();
  const [error, setError] = useState<VippsSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const appStatus = useAppStateStatus();
  const [authorizationCode, setAuthorizationCode] = useState('');

  const authenticateUserByVipps = async () => {
    setIsLoading(true);
    try {
      await authorizeUser(setIsLoading);
    } catch (err) {
      setError('unknown_error');
      setIsLoading(false);
    }
  };

  useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsLoading(false);
      }),
    [navigation],
  );

  const signInUsingCustomToken = async (token: string) => {
    const response = await signInWithCustomToken(token);
    if (!response.error) {
      navigation.navigate('Profile');
    } else {
      setError(response.error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const signInVippsUser = async () => {
      try {
        const customToken = await getOrCreateVippsUserCustomToken(
          authorizationCode,
        );
        await signInUsingCustomToken(customToken.data as string);
        await storage.set('vipps_state', '');
        await storage.set('vipps_nonce', '');
      } catch (err) {
        setError('unknown_error');
        setIsLoading(false);
      }
    };
    if (authorizationCode) {
      signInVippsUser();
    }
  }, [authorizationCode]);

  useEffect(() => {
    const vippsCallbackHandler = async (event: any) => {
      if (event.url.includes('atb://auth/vipps')) {
        setIsLoading(true);
        const code = parseUrl(event.url).query.code;
        if (code) {
          const state = parseUrl(event.url).query.state;
          const initialState = await storage.get('vipps_state');
          if (initialState?.toString() !== state?.toString()) {
            setError('unknown_error');
            setIsLoading(false);
          }
          setAuthorizationCode(code.toString());
        } else {
          const error = parseUrl(event.url).query.error;
          if (error) {
            if (error === 'outdated_app_version' || error === 'access_denied') {
              setError(error);
            } else {
              setError('unknown_error');
            }
            setIsLoading(false);
          }
        }
      }
    };
    const eventSubscription = Linking.addEventListener(
      'url',
      vippsCallbackHandler,
    );
    return () => eventSubscription.remove();
  }, [appStatus]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(LoginTexts.logInOptions.title)}
      />
      <View style={styles.mainView}>
        <ScrollView
          centerContent={true}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View accessible={true} accessibilityRole="header">
            <ThemeText
              type={'body__primary--jumbo--bold'}
              style={styles.title}
              color={themeColor}
            >
              {t(LoginTexts.logInOptions.title)}
            </ThemeText>
          </View>
          {isLoading && (
            <ActivityIndicator style={styles.activityIndicator} size="large" />
          )}
          {error && error !== 'access_denied' && (
            <MessageBox
              containerStyle={styles.errorMessage}
              type="error"
              message={t(LoginTexts.vipps.errors[error])}
            />
          )}
          <ThemeText style={styles.description} color={themeColor}>
            {t(LoginTexts.logInOptions.selectLoginMethod)}
          </ThemeText>
          <VippsLoginButton
            onPress={authenticateUserByVipps}
            disabled={isLoading}
          />
          <ThemeText style={styles.description} color={themeColor}>
            {t(LoginTexts.logInOptions.or)}
          </ThemeText>
          <Sections.Section>
            <Sections.LinkItem
              text={t(LoginTexts.logInOptions.options.phoneAndCode)}
              onPress={() => {
                navigation.navigate('LoginInApp', {
                  screen: 'PhoneInputInApp',
                  params: {afterLogin: afterLogin},
                });
              }}
              disabled={isLoading}
            />
          </Sections.Section>
        </ScrollView>
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: theme.spacings.xLarge,
  },
  contentContainerStyle: {
    paddingHorizontal: theme.spacings.large,
    flexDirection: 'column',
    paddingBottom: theme.spacings.xLarge,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
  },
  activityIndicator: {
    marginVertical: theme.spacings.large,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
}));
