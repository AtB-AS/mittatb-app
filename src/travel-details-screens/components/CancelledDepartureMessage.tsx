import {MessageBox} from '@atb/components/message-box';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {CancelledDepartureTexts, useTranslation} from '@atb/translations';

const CancelledDepartureMessage = () => {
  const styles = useStopsStyle();
  const {t} = useTranslation();

  return (
    <MessageBox
      type="error"
      style={styles.cancellationContainer}
      message={t(CancelledDepartureTexts.message)}
    />
  );
};

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  cancellationContainer: {
    marginBottom: theme.spacings.small,
  },
}));

export default CancelledDepartureMessage;
