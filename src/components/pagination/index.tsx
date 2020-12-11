import React from 'react';
import ThemeText from '../text';
import {View, ViewProps} from 'react-native';
import Button from '../button';
import {StyleSheet} from '../../theme';
import {ArrowLeft, ArrowRight} from '../../assets/svg/icons/navigation';

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
        onPress={() => onNavigate(--page)}
        text="Forrige"
      ></Button>

      <ThemeText>
        {page} av {totalPages}
      </ThemeText>
      <Button
        type="compact"
        mode="tertiary"
        disabled={!hasNext}
        iconPosition="right"
        icon={ArrowRight}
        onPress={() => onNavigate(++page)}
        text="Neste"
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
