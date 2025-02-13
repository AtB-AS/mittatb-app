import {
  authorizeUser,
  getOrCreateVippsUserCustomToken,
  VIPPS_CALLBACK_URL,
} from '@atb/api/vipps-login/api';
import {useAuthContext, VippsSignInErrorCode} from '@atb/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {VippsLoginButton} from '@atb/components/vipps-login-button';
import {storage} from '@atb/storage';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {
  getTextForLanguage,
  LoginTexts,
  useTranslation,
} from '@atb/translations';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Linking, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import queryString from 'query-string';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {Button} from '@atb/components/button';
import {ArrowRight, ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {TransitionPresets} from '@react-navigation/stack';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useOnboardingContext} from '@atb/onboarding';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {closeInAppBrowseriOS, openInAppBrowser} from '@atb/in-app-browser';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_LoginOptionsScreen'>;

export const Root_LoginOptionsScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const showGoBack = params?.showGoBack;
  const transitionPreset = params?.transitionPreset;

  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {signInWithCustomToken} = useAuthContext();
  const [error, setError] = useState<VippsSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const appStatus = useAppStateStatus();
  const [authorizationCode, setAuthorizationCode] = useState<
    string | undefined
  >(undefined);
  const {configurableLinks} = useFirestoreConfigurationContext();
  const {completeOnboardingSection} = useOnboardingContext();

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
    completeOnboardingSection('userCreation');
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
        closeInAppBrowseriOS();
        setIsLoading(true);
        const code = queryString.parseUrl(event.url).query.code;
        if (code) {
          const state = queryString.parseUrl(event.url).query.state;
          const initialState = await storage.get('vipps_state');
          if (initialState?.toString() !== state?.toString()) {
            setError('unknown_error');
            setIsLoading(false);
          } else {
            setAuthorizationCode(code.toString());
          }
        } else {
          const error = queryString.parseUrl(event.url).query.error;
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

  const termsInfoUrl = getTextForLanguage(
    configurableLinks?.termsInfo,
    language,
  );

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
        globalMessageContext={GlobalMessageContextEnum.appLogin}
      />
      <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
        <View accessible={true} accessibilityRole="header">
          <ThemeText
            typography="body__primary--jumbo--bold"
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

        <View style={styles.buttonContainer}>
          <VippsLoginButton
            onPress={authenticateUserByVipps}
            disabled={isLoading}
          />
          <Button
            expanded={true}
            interactiveColor={theme.color.interactive[0]}
            mode="primary"
            onPress={() => navigation.navigate('Root_LoginPhoneInputScreen')}
            text={t(LoginTexts.logInOptions.options.phoneAndCode.label)}
            accessibilityHint={t(
              LoginTexts.logInOptions.options.phoneAndCode.a11yLabel,
            )}
            disabled={isLoading}
            rightIcon={{svg: ArrowRight}}
            testID="chooseLoginPhoneButton"
          />
          <Button
            expanded={true}
            mode="secondary"
            backgroundColor={themeColor}
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
            testID="useAppAnonymouslyButton"
          />
        </View>
        {termsInfoUrl && (
          <View style={styles.termsOfUseLinkContainer}>
            <Button
              expanded={true}
              backgroundColor={themeColor}
              mode="tertiary"
              rightIcon={{svg: ExternalLink}}
              onPress={() => openInAppBrowser(termsInfoUrl, 'done')}
              text={t(LoginTexts.logInOptions.termsOfUse)}
              accessibilityRole="link"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: getThemeColor(theme).background,
      flex: 1,
    },
    mainView: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xLarge,
      paddingBottom: safeAreaBottom,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
    },
    description: {
      marginVertical: theme.spacing.large,
      textAlign: 'center',
    },
    activityIndicator: {
      marginVertical: theme.spacing.large,
    },
    errorMessage: {
      marginBottom: theme.spacing.medium,
    },
    buttonContainer: {
      gap: theme.spacing.medium,
    },
    termsOfUseLinkContainer: {
      marginVertical: theme.spacing.xLarge - theme.spacing.medium,
    },
    termsOfUseButtonContainer: {
      marginVertical: theme.spacing.xLarge - theme.spacing.medium,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    termsOfUseText: {
      padding: theme.spacing.medium / 2,
    },
  };
});
