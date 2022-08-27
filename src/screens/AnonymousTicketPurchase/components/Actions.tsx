import Button from '@atb/components/button';
import AnonymousTicketPurchases from '@atb/translations/screens/subscreens/AnonymousTicketPurchases';
import React from 'react';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export type CallerRoute =
  | 'ConsequencesFromOnboarding'
  | 'ConsequencesFromTicketPurchase';

const Actions = ({
  callerRoute,
  navigation,
}: {
  callerRoute: CallerRoute;
  navigation: any;
}) => {
  const {t} = useTranslation();
  const finishOnboarding = useFinishOnboarding();
  const {enable_vipps_login} = useRemoteConfig();

  const navigateTologIn = async () => {
    navigation?.navigate('LoginInApp', {
      screen: enable_vipps_login ? 'LoginOptionsScreen' : 'PhoneInputInApp',
      params: {
        afterLogin: {
          routeName: 'TabNavigator',
          routeParams:
            callerRoute === 'ConsequencesFromTicketPurchase'
              ? {screen: 'Ticketing'}
              : {},
        },
      },
    });
  };

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
  return (
    <>
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
}));

export default Actions;
