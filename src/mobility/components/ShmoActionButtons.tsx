import {useAuthContext} from '@atb/auth';
import {Button} from '@atb/components/button';
import {MessageInfoText} from '@atb/components/message-info-text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';

export const ShmoActionButtons = () => {
  const styles = useStyles();
  const {authenticationType} = useAuthContext();
  const {theme} = useThemeContext();

  const {blockers} = useShmoRequirements();

  const {t} = useTranslation();

  if (authenticationType != 'phone') {
    return (
      <>
        <MessageInfoText
          type="warning"
          message={t(MobilityTexts.loginBlockerInfoMessage)}
          style={styles.warning}
        />
        <Button
          mode="primary"
          active={false}
          interactiveColor={theme.color.interactive[0]}
          expanded={true}
          type="large"
          accessibilityRole="button"
          onPress={() => {
            console.log('Button pressed');
          }}
          text={t(MobilityTexts.loginBlocker)}
        />
      </>
    );
  }

  // check if a user has any blockers for shmo
  if (blockers.some((blocker) => blocker.isBlocking)) {
    return (
      <>
        <MessageInfoText
          type="warning"
          message={t(MobilityTexts.shmoBlockersInfoMessage)}
          style={styles.warning}
        />
        <Button
          mode="primary"
          active={false}
          interactiveColor={theme.color.interactive[0]}
          expanded={true}
          type="large"
          accessibilityRole="button"
          onPress={() => {
            console.log('Button pressed');
          }}
          text={t(MobilityTexts.shmoBlockers)}
        />
      </>
    );
  }

  return null;
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      flex: 1,
    },
    warning: {
      paddingBottom: theme.spacing.medium,
    },
  };
});
