import {ScrollView, View} from 'react-native';
import React, {forwardRef, useState} from 'react';
import {
  getTextForLanguage,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {StyleSheet} from '@atb/theme';
import {
  FlexibleTransportOptionTypeWithSelectionType,
  TransportModeFilterOptionWithSelectionType,
  TravelSearchFiltersSelectionType,
  useFilters,
} from '@atb/travel-search-filters';
import {ThemeText} from '@atb/components/text';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  HeaderSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {useFlexibleTransportEnabled} from '../use-flexible-transport-enabled';
import {TravelSearchPreferenceWithSelectionType} from '@atb/travel-search-filters/types';
import {TravelSearchPreference} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/TravelSearchPreference';

export const TravelSearchFiltersBottomSheet = forwardRef<
  any,
  {
    filtersSelection: TravelSearchFiltersSelectionType;
    onSave: (t: TravelSearchFiltersSelectionType) => void;
  }
>(({filtersSelection, onSave}, focusRef) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {close} = useBottomSheet();

  const {setFilters} = useFilters();
  const [saveFilters, setSaveFilters] = useState(false);

  const [isFlexibleTransportEnabledInRemoteConfig, _] =
    useFlexibleTransportEnabled();

  const [selectedModeOptions, setSelectedModes] = useState<
    TransportModeFilterOptionWithSelectionType[] | undefined
  >(filtersSelection.transportModes);

  const [selectedFlexibleTransportOption, setSelectedFlexibleTransportOption] =
    useState<FlexibleTransportOptionTypeWithSelectionType | undefined>(
      filtersSelection.flexibleTransport,
    );

  const [selectedTravelSearchPreferences, setSelectedTravelSearchPreferences] =
    useState<TravelSearchPreferenceWithSelectionType[]>(
      filtersSelection.travelSearchPreferences ?? [],
    );

  const save = () => {
    const selectedFilters = {
      transportModes: selectedModeOptions,
      flexibleTransport: selectedFlexibleTransportOption,
      travelSearchPreferences: selectedTravelSearchPreferences,
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
    <BottomSheetContainer
      maxHeightValue={0.9}
      title={t(TripSearchTexts.filters.bottomSheet.heading)}
    >
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
                leftImage={
                  getTransportModeSvg(
                    option.icon?.transportMode,
                    option.icon?.transportSubMode,
                  ).svg
                }
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
                setSelectedFlexibleTransportOption({
                  ...selectedFlexibleTransportOption,
                  enabled: checked,
                });
              }}
            />
          </Section>
        )}

        {selectedTravelSearchPreferences.map((preference) => (
          <TravelSearchPreference
            key={preference.type}
            style={styles.travelSearchPreference}
            preference={preference}
            onPreferenceChange={(changedPreference) =>
              setSelectedTravelSearchPreferences((previousPreferences) =>
                previousPreferences.map((pref) =>
                  pref.type === changedPreference.type
                    ? changedPreference
                    : pref,
                ),
              )
            }
          />
        ))}

        <Section style={styles.sectionContainer}>
          <GenericClickableSectionItem
            onPress={() => {
              setSaveFilters(!saveFilters);
            }}
          >
            <View style={styles.saveOptionSection}>
              <Checkbox
                style={styles.saveOptionSectionCheckbox}
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
              <ThemeText type="body__secondary" color="secondary">
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
  travelSearchPreference: {
    marginTop: theme.spacings.medium,
  },
  saveOptionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacings.xSmall,
    paddingVertical: theme.spacings.xSmall,
  },
  saveOptionSectionCheckbox: {
    marginRight: theme.spacings.small,
  },
}));
