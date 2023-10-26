import {
  authorizeUser,
  getOrCreateVippsUserCustomToken,
  VIPPS_CALLBACK_URL,
} from '@atb/api/vipps-login/api';
import {useAuthState} from '@atb/auth';
import {VippsSignInErrorCode} from '@atb/auth';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {VippsLoginButton} from '@atb/components/vipps-login-button';
import {storage} from '@atb/storage';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {LoginTexts, useTranslation} from '@atb/translations';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Linking, ScrollView, View} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {parseUrl} from 'query-string/base';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginOptionsScreen'>;

export const Root_LoginOptionsScreen = ({
  navigation,
  route: {
    params: {afterLogin},
  },
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {signInWithCustomToken} = useAuthState();
  const [error, setError] = useState<VippsSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const appStatus = useAppStateStatus();
  const [authorizationCode, setAuthorizationCode] = useState<
    string | undefined
  >(undefined);

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
    const errorCode = await signInWithCustomToken(token);
    if (!errorCode) {
      navigation.popToTop();
      if (afterLogin) {
        navigation.navigate(afterLogin.screen, afterLogin.params as any);
      }
    } else {
      setError(errorCode);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const signInVippsUser = async (authorizationCode: string) => {
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
      signInVippsUser(authorizationCode);
    }
  }, [authorizationCode]);

  useEffect(() => {
    const vippsCallbackHandler = async (event: any) => {
      if (event.url.includes(VIPPS_CALLBACK_URL)) {
        InAppBrowser.close();
        setIsLoading(true);
        const code = parseUrl(event.url).query.code;
        if (code) {
          const state = parseUrl(event.url).query.state;
          const initialState = await storage.get('vipps_state');
          if (initialState?.toString() !== state?.toString()) {
            setError('unknown_error');
            setIsLoading(false);
          } else {
            setAuthorizationCode(code.toString());
          }
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
      <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
        <View accessible={true} accessibilityRole="header">
          <ThemeText
            type="body__primary--jumbo--bold"
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
            style={styles.errorMessage}
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
        <Section>
          <LinkSectionItem
            text={t(LoginTexts.logInOptions.options.phoneAndCode)}
            onPress={() => {
              navigation.navigate('Root_LoginPhoneInputScreen', {
                afterLogin: afterLogin,
              });
            }}
            disabled={isLoading}
            testID="chooseLoginPhone"
          />
        </Section>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: theme.static.background[themeColor].background,
      flex: 1,
    },
    mainView: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacings.xLarge,
      paddingBottom: safeAreaBottom,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacings.medium,
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
  };
});
