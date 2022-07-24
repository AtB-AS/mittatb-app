import Button from '@atb/components/button';
import AnonymousTicketPurchases from '@atb/translations/screens/subscreens/AnonymousTicketPurchases';
import React from 'react';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useTheme} from '@atb/theme';
import Bugsnag from '@bugsnag/react-native';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {useAuthState} from '@atb/auth';
import useIsLoading from '@atb/utils/use-is-loading';
import {ActivityIndicator, View} from 'react-native';

export type CallerRoute =
  | 'ConsequencesFromOnboarding'
  | 'ConsequencesFromLogout'
  | 'ConsequencesFromTicketPurchase'
  | 'ConsequencesFromLoginOnboarding';

const Actions = ({
  callerRoute,
  navigation,
}: {
  callerRoute: CallerRoute;
  navigation: any;
}) => {
  const {t} = useTranslation();
  const finishOnboarding = useFinishOnboarding();
  const {wipeToken} = useMobileTokenContextState();
  const {signOut} = useAuthState();
  const [isLoading, setIsLoading] = useIsLoading(false);

  const navigateToTickets = () => {
    navigation?.navigate('Ticketing');
  };

  const navigateTologIn = async () => {
    navigation?.navigate('LoginInApp', {
      screen: 'PhoneInputInApp',
      params: {
        afterLogin: {
          routeName: 'TabNavigator',
        },
      },
    });
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutAndWipeTokens();
    setIsLoading(false);
    navigation.goBack();
  };

  async function logoutAndWipeTokens() {
    try {
      // On logout we delete the user's token
      await wipeToken();
    } catch (err: any) {
      Bugsnag.notify(err);
    }
    return signOut();
  }

  switch (callerRoute) {
    case 'ConsequencesFromOnboarding':
      return (
        <Buttons
          primaryText={t(
            AnonymousTicketPurchases.consequences.button.accept.label,
          )}
          primaryAction={finishOnboarding}
          primaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.accept.a11yHint,
          )}
          secondaryText={t(
            AnonymousTicketPurchases.consequences.button.login.label,
          )}
          secondaryAction={navigateTologIn}
          secondaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.login.a11yHint,
          )}
        />
      );
    case 'ConsequencesFromLogout':
      return (
        <Buttons
          primaryText={t(
            AnonymousTicketPurchases.consequences.button.logout.label,
          )}
          primaryAction={logout}
          primaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.logout.a11yHint,
          )}
          secondaryText={t(
            AnonymousTicketPurchases.consequences.button.stayLoggedIn.label,
          )}
          secondaryAction={navigation.goBack}
          secondaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.stayLoggedIn.a11yHint,
          )}
          isLoading={isLoading}
        />
      );
    case 'ConsequencesFromTicketPurchase':
      return (
        <Buttons
          primaryText={t(
            AnonymousTicketPurchases.consequences.button.login.label,
          )}
          primaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.login.a11yHint,
          )}
          primaryAction={navigateTologIn}
          secondaryText={t(
            AnonymousTicketPurchases.consequences.button.cancel.label,
          )}
          secondaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.cancel.a11yHint,
          )}
          secondaryAction={navigation.goBack}
        />
      );
    case 'ConsequencesFromLoginOnboarding':
      return (
        <Buttons
          primaryText={t(
            AnonymousTicketPurchases.consequences.button.accept.label,
          )}
          primaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.accept.a11yHint,
          )}
          primaryAction={navigateToTickets}
          secondaryText={t(
            AnonymousTicketPurchases.consequences.button.cancel.label,
          )}
          secondaryTextAccessibilityHint={t(
            AnonymousTicketPurchases.consequences.button.cancel.a11yHint,
          )}
          secondaryAction={navigation.goBack}
        />
      );
  }
};

const Buttons = ({
  primaryText,
  primaryAction,
  primaryTextAccessibilityHint,
  secondaryText,
  secondaryAction,
  secondaryTextAccessibilityHint,
  isLoading,
}: {
  primaryText: string;
  primaryAction: () => void;
  primaryTextAccessibilityHint: string;
  secondaryText: string;
  secondaryAction: () => void;
  secondaryTextAccessibilityHint: string;
  isLoading?: boolean;
}) => {
  const styles = useStyle();
  const {theme} = useTheme();

  return (
    <>
      {isLoading && (
        <View>
          <ActivityIndicator
            color={theme.static.background.background_0.background}
            animating={true}
            style={styles.spinner}
            size="large"
          />
        </View>
      )}
      <Button
        interactiveColor="interactive_0"
        mode="primary"
        onPress={primaryAction}
        disabled={isLoading}
        text={primaryText}
        style={styles.primaryButton}
        accessibilityHint={primaryTextAccessibilityHint}
      />
      <Button
        interactiveColor="interactive_1"
        mode="secondary"
        disabled={isLoading}
        onPress={secondaryAction}
        text={secondaryText}
        accessibilityHint={secondaryTextAccessibilityHint}
      />
    </>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  primaryButton: {
    marginBottom: theme.spacings.medium,
  },
  buttons: {
    marginVertical: theme.spacings.large,
  },
  spinner: {
    paddingBottom: theme.spacings.medium,
  },
}));

export default Actions;
