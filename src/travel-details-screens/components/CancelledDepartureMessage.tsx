import {MessageInfoBox} from '@atb/components/message-info-box';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {CancelledDepartureTexts, useTranslation} from '@atb/translations';

export const CancelledDepartureMessage = () => {
  const styles = useStopsStyle();
  const {t} = useTranslation();

  return (
    <MessageInfoBox
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
