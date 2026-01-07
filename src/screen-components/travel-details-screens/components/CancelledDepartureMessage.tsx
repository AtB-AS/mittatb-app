import {MessageInfoBox} from '@atb/components/message-info-box';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {CancelledDepartureTexts, useTranslation} from '@atb/translations';
import type {A11yLiveRegion} from '@atb/components/screen-reader-announcement';
import {MessageSectionItem} from '@atb/components/sections';

export const CancelledDepartureMessage = ({
  someDeparturesCancelled = false,
  isInSection = false,
  a11yLiveRegion,
}: {
  someDeparturesCancelled?: boolean;
  isInSection?: boolean;
  a11yLiveRegion?: A11yLiveRegion;
}) => {
  const styles = useStopsStyle();
  const {t} = useTranslation();

  const message = someDeparturesCancelled
    ? t(CancelledDepartureTexts.someDeparturesCancelled)
    : t(CancelledDepartureTexts.message);

  return isInSection ? (
    <MessageSectionItem messageType="error" message={message} />
  ) : (
    <MessageInfoBox
      type="error"
      style={styles.cancellationContainer}
      message={message}
      a11yLiveRegion={a11yLiveRegion}
    />
  );
};

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  cancellationContainer: {
    marginBottom: theme.spacing.small,
  },
}));
