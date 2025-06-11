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
import {TransportationIconBox} from '@atb/components/icon-box';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {StyleSheet} from '@atb/theme';
import {
  TransportModeFilterOptionWithSelectionType,
  TravelSearchFiltersSelectionType,
  useFiltersContext,
} from '@atb/modules/travel-search-filters';
import {ThemeText} from '@atb/components/text';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';
import {TravelSearchPreference} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/TravelSearchPreference';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const TravelSearchFiltersBottomSheet = forwardRef<
  any,
  {
    filtersSelection: TravelSearchFiltersSelectionType;
    onSave: (t: TravelSearchFiltersSelectionType) => void;
  }
>(({filtersSelection, onSave}, focusRef) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {close} = useBottomSheetContext();

  const {setFilters} = useFiltersContext();
  const [saveFilters, setSaveFilters] = useState(false);

  const {isFlexibleTransportEnabled} = useFeatureTogglesContext();

  const [selectedModeOptions, setSelectedModes] = useState<
    TransportModeFilterOptionWithSelectionType[] | undefined
  >(filtersSelection.transportModes);

  const [selectedTravelSearchPreferences, setSelectedTravelSearchPreferences] =
    useState<TravelSearchPreferenceWithSelectionType[]>(
      filtersSelection.travelSearchPreferences ?? [],
    );

  const save = () => {
    const selectedFilters = {
      transportModes: selectedModeOptions,
      travelSearchPreferences: selectedTravelSearchPreferences,
    };
    onSave(selectedFilters);
    if (saveFilters) {
      setFilters(selectedFilters);
    }
    close();
  };

  const allModesSelected = selectedModeOptions?.every((m) => m.selected);

  return (
    <BottomSheetContainer
      maxHeightValue={0.9}
      title={t(TripSearchTexts.filters.bottomSheet.title)}
    >
      <ScrollView
        style={styles.filtersContainer}
        ref={focusRef}
        testID="filterView"
      >
        <ThemeText style={styles.headingText} typography="body__secondary">
          {t(TripSearchTexts.filters.bottomSheet.heading)}
        </ThemeText>
        <Section>
          <ToggleSectionItem
            text={t(TripSearchTexts.filters.bottomSheet.modesAll)}
            value={allModesSelected}
            onValueChange={(checked) => {
              setSelectedModes(
                filtersSelection.transportModes?.map((m) => ({
                  ...m,
                  selected: checked,
                })),
              );
            }}
            testID="allModesToggle"
          />
          {filtersSelection.transportModes
            ?.filter(
              ({id}) =>
                id !== 'flexibleTransport' || isFlexibleTransportEnabled,
            )
            .map((option) => {
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
                    <TransportationIconBox
                      mode={option.icon?.transportMode}
                      subMode={option.icon?.transportSubMode}
                      isFlexible={
                        isFlexibleTransportEnabled &&
                        option.id === 'flexibleTransport'
                      }
                    />
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
                  testID={`${option.id}Toggle`}
                />
              ) : null;
            })}
        </Section>

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
                testID="saveFilter"
              />
              <ThemeText typography="body__secondary" color="secondary">
                {t(TripSearchTexts.filters.bottomSheet.saveFilters.text)}
              </ThemeText>
            </View>
          </GenericClickableSectionItem>
        </Section>
      </ScrollView>

      <FullScreenFooter>
        <Button
          expanded={true}
          text={t(TripSearchTexts.filters.bottomSheet.use)}
          onPress={save}
          rightIcon={{svg: Confirm}}
          testID="confirmButton"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  filtersContainer: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  sectionContainer: {
    marginTop: theme.spacing.medium,
  },
  travelSearchPreference: {
    marginTop: theme.spacing.medium,
  },
  saveOptionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xSmall,
    paddingVertical: theme.spacing.xSmall,
  },
  saveOptionSectionCheckbox: {
    marginRight: theme.spacing.small,
  },
  headingText: {
    marginBottom: theme.spacing.medium,
  },
}));
