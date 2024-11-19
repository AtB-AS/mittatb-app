import {MessageInfoBox} from '@atb/components/message-info-box';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {CancelledDepartureTexts, useTranslation} from '@atb/translations';

export const CancelledDepartureMessage = ({
  a11yAnnounce,
}: {
  a11yAnnounce?: boolean;
}) => {
  const styles = useStopsStyle();
  const {t} = useTranslation();

  return (
    <MessageInfoBox
      type="error"
      style={styles.cancellationContainer}
      message={t(CancelledDepartureTexts.message)}
      a11yAnnounce={a11yAnnounce}
    />
  );
};

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  cancellationContainer: {
    marginBottom: theme.spacing.small,
  },
}));
