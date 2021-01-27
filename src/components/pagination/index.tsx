import React from 'react';
import {View, ViewProps} from 'react-native';
import {ArrowLeft, ArrowRight} from '../../assets/svg/icons/navigation';
import {StyleSheet} from '../../theme';
import {PaginationTexts, useTranslation} from '../../translations';
import {fullDateTime} from '../../utils/date';
import Button from '../button';
import ThemeText from '../text';

type PaginationProps = ViewProps & {
  page: number;
  totalPages: number;
  onNavigate(newPage: number): void;
  currentDate?: string | Date;
};
const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onNavigate,
  style,
  currentDate,
}) => {
  const styles = usePaginateStyles();
  const {t, language} = useTranslation();
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <View style={style}>
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
            accessibilityHint={t(PaginationTexts.previous.a11yHint)}
          />
        </View>

        <ThemeText
          accessible={true}
          accessibilityLabel={t(
            PaginationTexts.current.a11yLabel(page, totalPages),
          )}
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
            accessibilityHint={t(PaginationTexts.next.a11yHint)}
          />
        </View>
      </View>
      {currentDate && (
        <View style={styles.subline}>
          <ThemeText
            accessible={true}
            accessibilityLabel={t(
              PaginationTexts.date.a11yLabel(
                fullDateTime(currentDate, language),
              ),
            )}
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
  },
}));
export default Pagination;
