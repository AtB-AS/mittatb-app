import {ArrowLeft, ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {StyleSheet} from '@atb/theme';
import {PaginationTexts, useTranslation} from '@atb/translations';
import {fullDateTime} from '@atb/utils/date';
import React from 'react';
import {View, ViewProps} from 'react-native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';

type PaginatedDetailsHeader = ViewProps & {
  page: number;
  totalPages: number;
  onNavigate(newPage: number): void;
  showPagination?: boolean;
  currentDate?: string | Date;
};
const PaginatedDetailsHeader: React.FC<PaginatedDetailsHeader> = ({
  page,
  totalPages,
  onNavigate,
  style,
  currentDate,
  showPagination = true,
}) => {
  const styles = usePaginateStyles();
  const {t, language} = useTranslation();
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <View style={[styles.wrapper, style]}>
      {showPagination && (
        <View style={styles.container}>
          <View style={styles.buttonLeft}>
            <Button
              type="compact"
              mode="tertiary"
              disabled={!hasPrevious}
              iconPosition="left"
              icon={ArrowLeft}
              onPress={() => onNavigate(page - 1)}
              text={t(PaginationTexts.previous.label)}
              testID="previousTripButton"
              accessibilityHint={t(PaginationTexts.previous.a11yHint)}
            />
          </View>

          <ThemeText
            accessible={true}
            accessibilityLabel={t(
              PaginationTexts.current.a11yLabel(page, totalPages),
            )}
            testID="tripPagination"
          >
            {t(PaginationTexts.current.label(page, totalPages))}
          </ThemeText>
          <View style={styles.buttonRight}>
            <Button
              type="compact"
              mode="tertiary"
              disabled={!hasNext}
              iconPosition="right"
              icon={ArrowRight}
              onPress={() => onNavigate(page + 1)}
              text={t(PaginationTexts.next.label)}
              testID="nextTripButton"
              accessibilityHint={t(PaginationTexts.next.a11yHint)}
            />
          </View>
        </View>
      )}
      {currentDate && (
        <View style={styles.subline}>
          <ThemeText
            accessible={true}
            accessibilityLabel={t(
              PaginationTexts.date.a11yLabel(
                fullDateTime(currentDate, language),
              ),
            )}
            testID="tripStartTime"
          >
            {fullDateTime(currentDate, language)}
          </ThemeText>
        </View>
      )}
    </View>
  );
};
const usePaginateStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacings.medium,
  },
  wrapper: {
    borderBottomWidth: theme.border.width.slim,
    borderColor: theme.colors.background_1.backgroundColor,
  },
  buttonLeft: {
    position: 'absolute',
    zIndex: 2,
    elevated: 1,
    left: 1,
  },
  buttonRight: {
    position: 'absolute',
    zIndex: 2,
    elevated: 1,
    right: 0,
  },
  subline: {
    alignItems: 'center',
    paddingBottom: theme.spacings.medium,
  },
}));
export default PaginatedDetailsHeader;
