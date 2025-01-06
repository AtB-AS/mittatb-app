import {Button} from '@atb/components/button';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {View} from 'react-native';
import React from 'react';
import {TravelSearchFiltersSelectionType} from '@atb/travel-search-filters';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {areDefaultFiltersSelected} from '../utils';

type Props = {
  filtersSelection: TravelSearchFiltersSelectionType;
  resetTransportModes: () => void;
};

export const SelectedFiltersButtons = ({
  filtersSelection,
  resetTransportModes,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  if (!filtersSelection.transportModes) return null;

  if (areDefaultFiltersSelected(filtersSelection?.transportModes)) return null;

  const selectedModesCount = filtersSelection.transportModes.filter(
    (m) => m.selected,
  ).length;
  const allModesCount = filtersSelection.transportModes.length;

  const text = t(
    TripSearchTexts.filters.selection.transportModes(
      selectedModesCount,
      allModesCount,
    ),
  );

  return (
    <View style={styles.container}>
      <Button
        type="small"
        accessibilityLabel={
          t(TripSearchTexts.filters.selection.a11yLabelPrefix) + text
        }
        text={text}
        accessibilityHint={t(TripSearchTexts.filters.selection.a11yHint)}
        onPress={resetTransportModes}
        interactiveColor={theme.color.interactive[0]}
        active={true}
        leftIcon={{svg: Bus}}
        rightIcon={{svg: Close}}
        testID="selectedFilterButton"
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
}));
