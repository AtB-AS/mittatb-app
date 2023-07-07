import {ScrollView, View} from 'react-native';
import React, {forwardRef, useState} from 'react';
import {
  getTextForLanguage,
  ScreenHeaderTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {StyleSheet} from '@atb/theme';
import {useFilters} from '@atb/travel-search-filters';
import {ThemeText} from '@atb/components/text';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  HeaderSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {useFlexibleTransportEnabled} from '../use-flexible-transport-enabled';
import {
  FlexibleTransportOptionTypeWithSelectionType,
  TransportModeFilterOptionWithSelectionType,
  TravelSearchFiltersSelectionType,
} from '@atb/travel-search-filters';

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

  const isFlexibleTransportEnabledInRemoteConfig =
    useFlexibleTransportEnabled();

  const [selectedModeOptions, setSelectedModes] = useState<
    TransportModeFilterOptionWithSelectionType[] | undefined
  >(filtersSelection.transportModes);

  const [selectedFlexibleTransportOption, setFlexibleTranportFilter] = useState<
    FlexibleTransportOptionTypeWithSelectionType | undefined
  >(filtersSelection.flexibleTransport);

  const save = () => {
    const selectedFilters = {
      transportModes: selectedModeOptions,
      flexibleTransport: selectedFlexibleTransportOption,
    };
    onSave(selectedFilters);
    if (saveFilters) {
      setFilters(selectedFilters);
    }
    close();
  };

  const allModesSelected = selectedModeOptions?.every((m) => m.selected);

  const showFlexibleTransportFilterOption =
    isFlexibleTransportEnabledInRemoteConfig && selectedFlexibleTransportOption;

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
        <Section>
          <HeaderSectionItem
            text={t(TripSearchTexts.filters.bottomSheet.modes.heading)}
          />
          <ToggleSectionItem
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
              <ToggleSectionItem
                key={option.id}
                text={text}
                leftIcon={getTransportModeSvg(
                  option.icon?.transportMode,
                  option.icon?.transportSubMode,
                )}
                subtext={description}
                value={
                  selectedModeOptions?.find(({id}) => id === option.id)
                    ?.selected
                }
                onValueChange={(checked) => {
                  setSelectedModes(
                    selectedModeOptions?.map((m) =>
                      m.id === option.id ? {...m, selected: checked} : m,
                    ),
                  );
                }}
              />
            ) : null;
          })}
        </Section>

        {showFlexibleTransportFilterOption && (
          <Section style={styles.sectionContainer}>
            <ToggleSectionItem
              text={
                getTextForLanguage(
                  selectedFlexibleTransportOption.title,
                  language,
                ) ?? ''
              }
              subtext={getTextForLanguage(
                selectedFlexibleTransportOption.description,
                language,
              )}
              label={selectedFlexibleTransportOption.label}
              value={selectedFlexibleTransportOption?.enabled}
              onValueChange={(checked) => {
                setFlexibleTranportFilter({
                  ...selectedFlexibleTransportOption,
                  enabled: checked,
                });
              }}
            />
          </Section>
        )}

        <Section style={styles.sectionContainer}>
          <GenericClickableSectionItem
            onPress={() => {
              setSaveFilters(!saveFilters);
            }}
          >
            <View style={styles.saveOptionSection}>
              <Checkbox
                checked={saveFilters}
                accessibility={{
                  accessibilityLabel: t(
                    saveFilters
                      ? TripSearchTexts.filters.bottomSheet.saveFilters.a11yHint
                          .notSave
                      : TripSearchTexts.filters.bottomSheet.saveFilters.a11yHint
                          .save,
                  ),
                }}
              />
              <ThemeText type={'body__secondary'} color={'secondary'}>
                {t(TripSearchTexts.filters.bottomSheet.saveFilters.text)}
              </ThemeText>
            </View>
          </GenericClickableSectionItem>
        </Section>
      </ScrollView>

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
  sectionContainer: {
    marginTop: theme.spacings.medium,
  },
  saveOptionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacings.xSmall,
    paddingVertical: theme.spacings.xSmall,
  },
}));
