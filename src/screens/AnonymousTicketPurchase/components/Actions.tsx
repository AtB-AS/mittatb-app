import Button from '@atb/components/button';
import AnonymousTicketPurchases from '@atb/translations/screens/subscreens/AnonymousTicketPurchases';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';

const Actions = ({
  primaryAction,
  secondaryAction,
}: {
  primaryAction: any;
  secondaryAction: any;
}) => {
  const {t} = useTranslation();
  const styles = useStyle();

  return (
    <>
      <Button
        interactiveColor="interactive_0"
        mode="primary"
        onPress={primaryAction}
        style={styles.primaryButton}
        text={t(AnonymousTicketPurchases.consequences.button.login.label)}
        accessibilityHint={t(
          AnonymousTicketPurchases.consequences.button.login.a11yHint,
        )}
        testID="loginButton"
      />
      <Button
        interactiveColor="interactive_1"
        mode="secondary"
        onPress={secondaryAction}
        text={t(AnonymousTicketPurchases.consequences.button.accept.label)}
        accessibilityHint={t(
          AnonymousTicketPurchases.consequences.button.accept.a11yHint,
        )}
        testID="acceptRestrictionsButton"
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
