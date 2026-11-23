import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {VippsLoginButton} from '@atb/components/vipps-login-button';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {
  getTextForLanguage,
  LoginTexts,
  useTranslation,
} from '@atb/translations';
import React, {useCallback} from 'react';
import {ScrollView, View} from 'react-native';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {Button} from '@atb/components/button';
import {
  ChevronRight,
  ExternalLink,
} from '@atb/assets/svg/mono-icons/navigation';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {Loading} from '@atb/components/loading';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {NativeTouchable} from '@atb/components/native-touchable';
import {useVippsLogin} from './use-vipps-login';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

type Props = RootStackScreenProps<'Root_LoginOptionsScreen'>;

export const Root_LoginOptionsScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const showGoBack = params?.showGoBack;
  const transitionPreset = params?.transitionOverride;

  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {configurableLinks} = useFirestoreConfigurationContext();
  const {isEmailLoginEnabled} = useFeatureTogglesContext();
  const {enable_vipps_login} = useRemoteConfigContext();
  const subscribeToFocus = useCallback(
    (callback: () => void) => navigation.addListener('focus', callback),
    [navigation],
  );
  const {authVipps, error, isLoading} = useVippsLogin(subscribeToFocus);

  const phoneButton = (
    <Button
      surfaceColor="accent"
      expanded={true}
      mode="primary"
      onPress={() => navigation.navigate('Root_LoginPhoneInputScreen')}
      text={t(LoginTexts.logInOptions.options.phoneAndCode.label)}
      accessibilityHint={t(
        LoginTexts.logInOptions.options.phoneAndCode.a11yLabel,
      )}
      disabled={isLoading}
      rightIcon={{svg: ChevronRight}}
      testID="chooseLoginPhoneButton"
    />
  );

  const termsInfoUrl = getTextForLanguage(
    configurableLinks?.termsInfo,
    language,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        showBorder={false}
        leftButton={
          showGoBack && transitionPreset !== 'slide-from-bottom'
            ? {type: 'back'}
            : undefined
        }
        rightButton={
          showGoBack && transitionPreset === 'slide-from-bottom'
            ? {type: 'close'}
            : undefined
        }
        // The large title below names the screen when e-mail login is on
        title={
          isEmailLoginEnabled ? undefined : t(LoginTexts.logInOptions.title)
        }
        globalMessageContext={GlobalMessageContextEnum.appLogin}
      />
      <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
        <View accessible={true} accessibilityRole="header">
          <ThemeText
            typography="heading__3xl"
            style={styles.title}
            color={themeColor}
          >
            {t(LoginTexts.logInOptions.title)}
          </ThemeText>
        </View>
        {isLoading && <Loading style={styles.loading} size="large" />}
        {error && error !== 'access_denied' && (
          <MessageInfoBox
            style={styles.errorMessage}
            type="error"
            message={t(LoginTexts.vipps.errors[error])}
          />
        )}
        {!isEmailLoginEnabled && (
          <ThemeText style={styles.description} color={themeColor}>
            {t(LoginTexts.logInOptions.selectLoginMethod)}
          </ThemeText>
        )}

        <View style={styles.buttonContainer}>
          {isEmailLoginEnabled ? (
            <>
              <Button
                surfaceColor="accent"
                expanded={true}
                mode="primary"
                onPress={() =>
                  navigation.navigate('Root_LoginEmailInputScreen', {})
                }
                text={t(LoginTexts.logInOptions.options.email.label)}
                accessibilityHint={t(
                  LoginTexts.logInOptions.options.email.a11yLabel,
                )}
                disabled={isLoading}
                testID="chooseLoginEmailButton"
              />
              <NativeTouchable
                variant="borderless"
                style={styles.otherMethods}
                onPress={() =>
                  navigation.navigate('Root_LoginOtherMethodsScreen')
                }
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={t(
                  enable_vipps_login
                    ? LoginTexts.logInOptions.options.otherMethods.a11yLabel
                        .withVipps
                    : LoginTexts.logInOptions.options.otherMethods.a11yLabel
                        .phoneOnly,
                )}
                testID="otherLoginMethodsButton"
              >
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.centeredText}
                  color={themeColor}
                >
                  {t(
                    enable_vipps_login
                      ? LoginTexts.logInOptions.options.otherMethods.hint
                          .withVipps
                      : LoginTexts.logInOptions.options.otherMethods.hint
                          .phoneOnly,
                  )}
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  style={[styles.centeredText, styles.underline]}
                  color={themeColor}
                >
                  {t(
                    enable_vipps_login
                      ? LoginTexts.logInOptions.options.otherMethods.link
                          .withVipps
                      : LoginTexts.logInOptions.options.otherMethods.link
                          .phoneOnly,
                  )}
                </ThemeText>
              </NativeTouchable>
            </>
          ) : (
            <>
              <VippsLoginButton onPress={authVipps} disabled={isLoading} />
              {phoneButton}
            </>
          )}
          <Button
            surfaceColor="accent"
            expanded={true}
            mode="secondary"
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
            rightIcon={isEmailLoginEnabled ? undefined : {svg: ChevronRight}}
            testID="useAppAnonymouslyButton"
          />
        </View>
        {termsInfoUrl && isEmailLoginEnabled && (
          <ThemeText
            typography="body__xs"
            type="secondary"
            style={[styles.centeredText, styles.termsConsent]}
            color={themeColor}
          >
            {t(LoginTexts.logInOptions.termsConsent.prefix)}
            <ThemeText
              typography="body__xs"
              type="secondary"
              style={styles.underline}
              color={themeColor}
              accessibilityRole="link"
              onPress={() =>
                openInAppBrowser(termsInfoUrl, {dismissButtonStyle: 'done'})
              }
            >
              {t(LoginTexts.logInOptions.termsConsent.link)}
            </ThemeText>
            {t(LoginTexts.logInOptions.termsConsent.suffix)}
          </ThemeText>
        )}
        {termsInfoUrl && !isEmailLoginEnabled && (
          <View style={styles.termsOfUseLinkContainer}>
            <Button
              surfaceColor="accent"
              expanded={true}
              mode="tertiary"
              rightIcon={{svg: ExternalLink}}
              onPress={() =>
                openInAppBrowser(termsInfoUrl, {dismissButtonStyle: 'done'})
              }
              text={t(LoginTexts.logInOptions.termsOfUse)}
              accessibilityRole="link"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, {bottom}) => {
  return {
    container: {
      flex: 1,
    },
    mainView: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xLarge,
      paddingBottom: bottom,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
    },
    description: {
      marginVertical: theme.spacing.large,
      textAlign: 'center',
    },
    loading: {
      marginVertical: theme.spacing.large,
    },
    errorMessage: {
      marginBottom: theme.spacing.medium,
    },
    buttonContainer: {
      gap: theme.spacing.medium,
    },
    otherMethods: {
      paddingVertical: theme.spacing.small,
      gap: theme.spacing.xSmall,
    },
    centeredText: {
      textAlign: 'center',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    termsConsent: {
      marginTop: theme.spacing.xLarge,
    },
    termsOfUseLinkContainer: {
      marginVertical: theme.spacing.xLarge - theme.spacing.medium,
    },
  };
});
