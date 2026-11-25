import {Button} from '@atb/components/button';
import {Loading} from '@atb/components/loading';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {VippsLoginButton} from '@atb/components/vipps-login-button';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {ScrollView, View} from 'react-native';
import {useVippsLogin} from './use-vipps-login';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

type Props = RootStackScreenProps<'Root_LoginOtherMethodsScreen'>;

/**
 * Vipps and phone login, reached from the login options screen when e-mail
 * login is the primary method.
 */
export const Root_LoginOtherMethodsScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {enable_vipps_login} = useRemoteConfigContext();
  const subscribeToFocus = useCallback(
    (callback: () => void) => navigation.addListener('focus', callback),
    [navigation],
  );
  const {authVipps, error, isLoading} = useVippsLogin(subscribeToFocus);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        showBorder={false}
        leftButton={{type: 'back'}}
        globalMessageContext={GlobalMessageContextEnum.appLogin}
      />
      <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
        <View accessible={true} accessibilityRole="header">
          <ThemeText
            typography="heading__3xl"
            style={styles.title}
            color={themeColor}
          >
            {t(LoginTexts.logInOtherMethods.title)}
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
        <ThemeText style={styles.description} color={themeColor}>
          {t(LoginTexts.logInOtherMethods.description)}
        </ThemeText>
        <View style={styles.buttonContainer}>
          {enable_vipps_login && (
            <VippsLoginButton onPress={authVipps} disabled={isLoading} />
          )}
          <Button
            surfaceColor="accent"
            expanded={true}
            mode={enable_vipps_login ? 'secondary' : 'primary'}
            onPress={() => navigation.navigate('Root_LoginPhoneInputScreen')}
            text={t(LoginTexts.logInOtherMethods.phone.label)}
            accessibilityHint={t(LoginTexts.logInOtherMethods.phone.a11yHint)}
            disabled={isLoading}
            testID="chooseLoginPhoneButton"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, {bottom}) => ({
  container: {
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
}));
