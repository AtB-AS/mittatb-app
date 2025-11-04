import React from 'react';
import {View} from 'react-native';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {useNow} from '@atb/utils/use-now';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {
  getTripPatternBookingStatus,
  TripPatternBookingStatus,
} from '@atb/screen-components/travel-details-screens';
import type {TripPattern} from '@atb/api/types/trips';
import {StyleSheet} from '@atb/theme';
import {getTripPatternBookingText} from '../utils';
import {Tag} from '@atb/components/tag';

const ResultItemFooter: React.FC<{
  tripPattern: TripPattern;
  isInPast: boolean;
}> = ({tripPattern, isInPast}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const now = useNow(30000);
  const bookingStatus = getTripPatternBookingStatus(tripPattern, now);

  return (
    <View style={styles.resultFooter}>
      <View style={styles.infoTagContainer}>
        <InfoTag bookingStatus={bookingStatus} isInPast={isInPast} />
      </View>
      <View style={styles.detailsTextWrapper}>
        <ThemeText typography="body__s">
          {t(TripSearchTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} />
      </View>
    </View>
  );
};

function InfoTag({
  isInPast,
  bookingStatus,
}: {
  isInPast: boolean;
  bookingStatus: TripPatternBookingStatus;
}) {
  const {t} = useTranslation();

  if (isInPast) {
    return (
      <Tag
        labels={[t(TripSearchTexts.results.resultItem.passedTrip)]}
        tagType="warning"
        size="regular"
      />
    );
  }

  const bookingText = getTripPatternBookingText(bookingStatus, t);
  if (bookingText) {
    return <Tag labels={[bookingText]} tagType="warning" size="regular" />;
  }
}

export const MemoizedResultItemFooter = React.memo(ResultItemFooter);

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  infoTagContainer: {
    flex: 1,
  },
  detailsTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
