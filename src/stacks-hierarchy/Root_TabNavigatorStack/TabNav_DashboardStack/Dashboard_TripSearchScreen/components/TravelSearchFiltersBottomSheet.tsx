import {ScrollView, TouchableOpacity} from 'react-native';
import React, {forwardRef, useState} from 'react';
import {
  getTextForLanguage,
  ScreenHeaderTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {StyleSheet} from '@atb/theme';
import type {
  TransportModeFilterOptionWithSelectionType,
  TravelSearchFiltersSelectionType,
} from '../../types';
import {useFilters} from '@atb/travel-search-filters';
import {ThemeText} from '@atb/components/text';
import {SavedCheckbox} from '@atb/components/checkbox/Checkbox';

export const TravelSearchFiltersBottomSheet = forwardRef<
  any,
  {
    close: () => void;
    filtersSelection: TravelSearchFiltersSelectionType;
    onSave: (t: TravelSearchFiltersSelectionType) => void;
  }
>(({close, filtersSelection, onSave}, focusRef) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const {setFilters} = useFilters();
  const [saveFilters, setSaveFilters] = useState(false);

  const [selectedModes, setSelectedModes] = useState<
    TransportModeFilterOptionWithSelectionType[] | undefined
  >(filtersSelection.transportModes);

  const save = () => {
    onSave({
      transportModes: selectedModes,
    });
    if (saveFilters) {
      setFilters(selectedModes);
    }
    close();
  };

  const allModesSelected = selectedModes?.every((m) => m.selected);

  return (
    <BottomSheetContainer maxHeightValue={0.9}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'cancel',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
          testID: 'cancelButton',
        }}
        title={t(TripSearchTexts.filters.bottomSheet.heading)}
        color="background_1"
        setFocusOnLoad={false}
      />
      <ScrollView style={styles.filtersContainer} ref={focusRef}>
        <Sections.Section>
          <Sections.HeaderSectionItem
            text={t(TripSearchTexts.filters.bottomSheet.modes.heading)}
          />
          <Sections.ToggleSectionItem
            text={t(TripSearchTexts.filters.bottomSheet.modes.all)}
            value={allModesSelected}
            onValueChange={(checked) => {
              setSelectedModes(
                filtersSelection.transportModes?.map((m) => ({
                  ...m,
                  selected: checked,
                })),
              );
            }}
          />
          {filtersSelection.transportModes?.map((option) => {
            const text = getTextForLanguage(option.text, language);
            const description = getTextForLanguage(
              option.description,
              language,
            );
            return text ? (
              <Sections.ToggleSectionItem
                key={option.id}
                text={text}
                leftIcon={getTransportModeSvg(
                  option.icon?.transportMode,
                  option.icon?.transportSubMode,
                )}
                subtext={description}
                value={
                  selectedModes?.find(({id}) => id === option.id)?.selected
                }
                onValueChange={(checked) => {
                  setSelectedModes(
                    selectedModes?.map((m) =>
                      m.id === option.id ? {...m, selected: checked} : m,
                    ),
                  );
                }}
              />
            ) : null;
          })}
        </Sections.Section>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          setSaveFilters(!saveFilters);
        }}
        style={[styles.saveOptionSection, styles.filtersContainer]}
        accessibilityHint={t(
          saveFilters
            ? TripSearchTexts.filters.bottomSheet.saveFilters.a11yHint.notSave
            : TripSearchTexts.filters.bottomSheet.saveFilters.a11yHint.save,
        )}
        accessibilityRole="checkbox"
        accessibilityState={{selected: saveFilters}}
      >
        <SavedCheckbox checked={saveFilters} />
        <ThemeText type={'body__secondary'} color={'secondary'}>
          {t(TripSearchTexts.filters.bottomSheet.saveFilters.text)}
        </ThemeText>
      </TouchableOpacity>
      <FullScreenFooter>
        <Button
          text={t(TripSearchTexts.filters.bottomSheet.use)}
          onPress={save}
          rightIcon={{svg: Confirm}}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  filtersContainer: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  saveOptionSection: {
    backgroundColor: theme.interactive.interactive_2.default.background,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.medium,
  },
}));
