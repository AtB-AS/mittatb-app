import React from 'react';
import ThemeText from '../text';
import {View, ViewProps} from 'react-native';
import Button from '../button';
import {StyleSheet} from '../../theme';
import {ArrowLeft, ArrowRight} from '../../assets/svg/icons/navigation';
import {PaginationTexts, useTranslation} from '../../translations';

type PaginationProps = ViewProps & {
  page: number;
  totalPages: number;
  onNavigate(newPage: number): void;
};
const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onNavigate,
  style,
}) => {
  const styles = usePaginateStyles();
  const {t} = useTranslation();
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <View style={[styles.container, style]}>
      <Button
        type="compact"
        mode="tertiary"
        disabled={!hasPrevious}
        iconPosition="left"
        icon={ArrowLeft}
        onPress={() => onNavigate(page - 1)}
        text={t(PaginationTexts.previous.label)}
        accessibilityHint={t(PaginationTexts.previous.a11yHint)}
      ></Button>

      <ThemeText
        accessible={true}
        accessibilityLabel={t(
          PaginationTexts.current.a11yLabel(page, totalPages),
        )}
      >
        {t(PaginationTexts.current.label(page, totalPages))}
      </ThemeText>
      <Button
        type="compact"
        mode="tertiary"
        disabled={!hasNext}
        iconPosition="right"
        icon={ArrowRight}
        onPress={() => onNavigate(page + 1)}
        text={t(PaginationTexts.next.label)}
        accessibilityHint={t(PaginationTexts.next.a11yHint)}
      ></Button>
    </View>
  );
};
const usePaginateStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
export default Pagination;
