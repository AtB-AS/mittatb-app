import {
  authorizeUser,
  getOrCreateVippsUserCustomToken,
  VIPPS_CALLBACK_URL,
} from '@atb/api/vipps-login/api';
import {useAuthState, VippsSignInErrorCode} from '@atb/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
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

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {TransitionPresets} from '@react-navigation/stack';
import {useAppState} from '@atb/AppContext';
import {useQueryClient} from '@tanstack/react-query';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginOptionsScreen'>;

export const Root_LoginOptionsScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const showGoBack = params?.showGoBack;
  const transitionPreset = params?.transitionPreset;

  const {t} = useTranslation();
  const styles = useStyles();
  const {signInWithCustomToken} = useAuthState();
  const [error, setError] = useState<VippsSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const appStatus = useAppStateStatus();
  const [authorizationCode, setAuthorizationCode] = useState<
    string | undefined
  >(undefined);
  const {completeOnboarding} = useAppState();
  const queryClient = useQueryClient();

  const authenticateUserByVipps = async () => {
    setIsLoading(true);
    try {
      await authorizeUser(setIsLoading);
    } catch (err) {
      setError('unknown_error');
      setIsLoading(false);
    }
    queryClient.invalidateQueries();
  };

  useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsLoading(false);
      }),
    [navigation],
  );

  const signInUsingCustomToken = async (token: string) => {
    completeOnboarding();
    const errorCode = await signInWithCustomToken(token);
    if (errorCode) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setFocusOnLoad={false}
        leftButton={
          showGoBack
            ? {
                type:
                  transitionPreset === TransitionPresets.ModalSlideFromBottomIOS
                    ? 'close'
                    : 'back',
              }
            : undefined
        }
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
          <MessageInfoBox
            style={styles.errorMessage}
            type="error"
            message={t(LoginTexts.vipps.errors[error])}
          />
        )}
        <ThemeText style={styles.description} color={themeColor}>
          {t(LoginTexts.logInOptions.selectLoginMethod)}
        </ThemeText>
        <Button
          interactiveColor="interactive_0"
          mode="primary"
          style={styles.loginOptionButton}
          onPress={() => navigation.navigate('Root_LoginPhoneInputScreen')}
          text={t(LoginTexts.logInOptions.options.phoneAndCode.label)}
          accessibilityHint={t(
            LoginTexts.logInOptions.options.phoneAndCode.a11yLabel,
          )}
          disabled={isLoading}
          rightIcon={{svg: ArrowRight}}
          testID="chooseLoginPhone"
        />
        <VippsLoginButton
          onPress={authenticateUserByVipps}
          disabled={isLoading}
          style={styles.loginOptionButton}
        />
        <Button
          interactiveColor="interactive_0"
          mode="secondary"
          style={styles.loginOptionButton}
          onPress={() =>
            navigation.push('Root_PurchaseAsAnonymousConsequencesScreen', {
              showLoginButton: false,
            })
          }
          text={t(LoginTexts.logInOptions.options.anonymous.label)}
          accessibilityHint={t(
            LoginTexts.logInOptions.options.anonymous.a11yLabel,
          )}
          disabled={isLoading}
          rightIcon={{svg: ArrowRight}}
          testID="useAppAnonymously"
        />

        <View style={styles.termsOfUseContainer}>
          <PressableOpacity
            onPress={() => navigation.navigate('Root_TermsInformationScreen')}
            role="button"
          >
            <ThemeText color={themeColor} style={styles.termsOfUseText}>
              {t(LoginTexts.logInOptions.termsOfUse)}
            </ThemeText>
          </PressableOpacity>
        </View>
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
    loginOptionButton: {
      marginVertical: theme.spacings.medium / 2,
    },
    termsOfUseContainer: {
      marginVertical: theme.spacings.xLarge - theme.spacings.medium,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    termsOfUseText: {
      padding: theme.spacings.medium / 2,
    },
  };
});
