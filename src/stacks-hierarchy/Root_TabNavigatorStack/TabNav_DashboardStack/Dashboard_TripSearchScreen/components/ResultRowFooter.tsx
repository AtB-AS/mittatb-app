import React from 'react';
import {View} from 'react-native';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {useNow} from '@atb/utils/use-now';
import {MessageInfoText} from '@atb/components/message-info-text';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {getTripPatternBookingStatus} from '@atb/screen-components/travel-details-screens';
import type {TripPattern} from '@atb/api/types/trips';
import {StyleSheet} from '@atb/theme';
import {getTripPatternBookingText} from '../utils';

const ResultItemFooter: React.FC<{
  tripPattern: TripPattern;
  isInPast: boolean;
}> = ({tripPattern, isInPast}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const now = useNow(30000);
  const tripPatternBookingStatus = getTripPatternBookingStatus(
    tripPattern,
    now,
  );
  const bookingText = getTripPatternBookingText(tripPatternBookingStatus, t);

  return (
    <View style={[styles.resultFooter, isInPast && styles.resultInPast]}>
      <View style={styles.footerNotice}>
        {bookingText && (
          <MessageInfoText
            message={bookingText}
            type={tripPatternBookingStatus === 'late' ? 'error' : 'warning'}
          />
        )}
      </View>
      <View style={styles.detailsTextWrapper}>
        <ThemeText typography="body__secondary">
          {t(TripSearchTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} style={styles.detailsIcon} />
      </View>
    </View>
  );
};

export const MemoizedResultItemFooter = React.memo(ResultItemFooter);

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  resultFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: theme.color.border.primary.background,
    borderTopWidth: theme.border.width.slim,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  resultInPast: {
    borderTopColor: theme.color.background.neutral['0'].background,
  },
  footerNotice: {flex: 1},
  detailsTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.medium,
  },
  detailsIcon: {
    marginLeft: theme.spacing.xSmall,
  },
}));
