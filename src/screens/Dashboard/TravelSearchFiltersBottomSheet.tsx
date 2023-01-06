import {ScrollView} from 'react-native';
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
import {Add, Confirm} from '@atb/assets/svg/mono-icons/actions';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {StyleSheet} from '@atb/theme';
import type {
  TransportModeFilterOptionType,
  TravelSearchFiltersType,
} from './types';

export const TravelSearchFiltersBottomSheet = forwardRef<
  any,
  {
    close: () => void;
    filters: TravelSearchFiltersType;
    initialSelection: TravelSearchFiltersType;
    onSave: (t: TravelSearchFiltersType) => void;
  }
>(({close, filters, initialSelection, onSave}, focusRef) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const [selectedModes, setSelectedModes] = useState<
    TransportModeFilterOptionType[] | undefined
  >(initialSelection.transportModes);

  const save = () => {
    onSave({
      transportModes: selectedModes,
    });
    close();
  };

  const allModesSelected =
    (selectedModes?.length || 0) >= (filters.transportModes?.length || 0);

  return (
    <BottomSheetContainer maxHeightValue={0.9}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'cancel',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
          testID: 'cancelButton',
        }}
        title={t(TripSearchTexts.filters.heading)}
        color="background_1"
        setFocusOnLoad={false}
      />
      <ScrollView style={styles.filtersContainer} ref={focusRef}>
        <Sections.Section>
          <Sections.HeaderSectionItem
            text={t(TripSearchTexts.filters.modes.heading)}
          />
          <Sections.ActionSectionItem
            mode="toggle"
            text={t(TripSearchTexts.filters.modes.all)}
            checked={allModesSelected}
            onPress={(checked) => {
              setSelectedModes(checked ? filters.transportModes : []);
            }}
          />
          {filters.transportModes?.map((option) => {
            const text = getTextForLanguage(option.text, language);
            const description = getTextForLanguage(
              option.description,
              language,
            );
            return text ? (
              <Sections.ActionSectionItem
                key={option.id}
                mode="toggle"
                text={text}
                leftIcon={
                  getTransportModeSvg(
                    option.icon?.transportMode,
                    option.icon?.transportSubMode,
                  ) || Add
                }
                subtext={description}
                checked={selectedModes?.some(({id}) => id === option.id)}
                onPress={(checked) => {
                  setSelectedModes(
                    checked
                      ? selectedModes?.concat(option)
                      : selectedModes?.filter((m) => m.id !== option.id),
                  );
                }}
              />
            ) : null;
          })}
        </Sections.Section>
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(TripSearchTexts.filters.save)}
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
}));
