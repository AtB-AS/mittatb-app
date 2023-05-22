import {Button} from '@atb/components/button';
import React from 'react';
import {AnonymousPurchasesTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';

export const Actions = ({
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
        text={t(AnonymousPurchasesTexts.consequences.button.login.label)}
        accessibilityHint={t(
          AnonymousPurchasesTexts.consequences.button.login.a11yHint,
        )}
        testID="loginButton"
      />
      <Button
        interactiveColor="interactive_0"
        mode="secondary"
        onPress={secondaryAction}
        text={t(AnonymousPurchasesTexts.consequences.button.accept.label)}
        accessibilityHint={t(
          AnonymousPurchasesTexts.consequences.button.accept.a11yHint,
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
