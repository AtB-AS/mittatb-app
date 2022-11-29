import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {CancelledDepartureTexts, useTranslation} from '@atb/translations';

const CancelledDepartureMessage = () => {
  const {theme} = useTheme();
  const styles = useStopsStyle();
  const {t} = useTranslation();

  return (
    <MessageBox type="warning" containerStyle={styles.cancellationContainer}>
      <ThemeText style={{color: theme.static.status.warning.text}}>
        {t(CancelledDepartureTexts.message)}
      </ThemeText>
    </MessageBox>
  );
};

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  cancellationContainer: {
    marginBottom: theme.spacings.small,
  },
}));

export default CancelledDepartureMessage;
