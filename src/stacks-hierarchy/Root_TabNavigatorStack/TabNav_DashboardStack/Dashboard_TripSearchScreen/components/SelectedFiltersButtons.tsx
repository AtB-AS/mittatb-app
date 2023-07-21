import {Button} from '@atb/components/button';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {View} from 'react-native';
import React from 'react';
import {TravelSearchFiltersSelectionType} from '@atb/travel-search-filters';
import {StyleSheet} from '@atb/theme';
import {TripSearchTexts, useTranslation} from '@atb/translations';

type Props = {
  filtersSelection: TravelSearchFiltersSelectionType;
  resetTransportModes: () => void;
  includeMarginBottom: boolean;
};

export const SelectedFiltersButtons = ({
  filtersSelection,
  resetTransportModes,
  includeMarginBottom,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  if (!filtersSelection.transportModes) return null;

  const selectedModesCount = filtersSelection.transportModes.filter(
    (m) => m.selected,
  ).length;
  const allModesCount = filtersSelection.transportModes.length;
  if (selectedModesCount === allModesCount) return null;

  const text = t(
    TripSearchTexts.filters.selection.transportModes(
      selectedModesCount,
      allModesCount,
    ),
  );
  if (!includeMarginBottom) {
    styles.container.marginBottom = 0;
  }
  return (
    <View style={styles.container}>
      <Button
        type="pill"
        accessibilityLabel={
          t(TripSearchTexts.filters.selection.a11yLabelPrefix) + text
        }
        text={text}
        accessibilityHint={t(TripSearchTexts.filters.selection.a11yHint)}
        onPress={resetTransportModes}
        interactiveColor="interactive_0"
        active={true}
        leftIcon={{svg: Bus}}
        rightIcon={{svg: Close}}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.xSmall,
    marginHorizontal: theme.spacings.medium,
  },
}));
