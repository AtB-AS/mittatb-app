import {MessageInfoBox} from '@atb/components/message-info-box';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {CancelledDepartureTexts, useTranslation} from '@atb/translations';
import type {A11yLiveRegion} from '@atb/components/screen-reader-announcement';

export const CancelledDepartureMessage = ({
  a11yLiveRegion,
}: {
  a11yLiveRegion?: A11yLiveRegion;
}) => {
  const styles = useStopsStyle();
  const {t} = useTranslation();

  return (
    <MessageInfoBox
      type="error"
      style={styles.cancellationContainer}
      message={t(CancelledDepartureTexts.message)}
      a11yLiveRegion={a11yLiveRegion}
    />
  );
};

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  cancellationContainer: {
    marginBottom: theme.spacing.small,
  },
}));
