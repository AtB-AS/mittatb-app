import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  getTextForLanguage,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {TransportationIconBox} from '@atb/components/icon-box';
import {StyleSheet} from '@atb/theme';
import {
  TransportModeFilterOptionWithSelectionType,
  TravelSearchFiltersSelectionType,
  useFiltersContext,
} from '@atb/modules/travel-search-filters';
import {ThemeText} from '@atb/components/text';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';
import {TravelSearchPreference} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/TravelSearchPreference';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet-v2';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {BottomSheetModal as GorhamBottomSheetModal} from '@gorhom/bottom-sheet';

export const TravelSearchFiltersBottomSheet = ({
  filtersSelection,
  onSave,
  bottomSheetModalRef,
  onCloseFocusRef,
}: {
  filtersSelection: TravelSearchFiltersSelectionType;
  onSave: (t: TravelSearchFiltersSelectionType) => void;
  bottomSheetModalRef: React.RefObject<GorhamBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const {setFilters} = useFiltersContext();

  const {isFlexibleTransportEnabled} = useFeatureTogglesContext();

  const [selectedModeOptions, setSelectedModes] = useState<
    TransportModeFilterOptionWithSelectionType[] | undefined
  >(filtersSelection.transportModes);

  const [selectedTravelSearchPreferences, setSelectedTravelSearchPreferences] =
    useState<TravelSearchPreferenceWithSelectionType[]>(
      filtersSelection.travelSearchPreferences ?? [],
    );

  useEffect(() => {
    setSelectedModes(filtersSelection.transportModes);
    setSelectedTravelSearchPreferences(
      filtersSelection.travelSearchPreferences ?? [],
    );
  }, [
    filtersSelection.transportModes,
    filtersSelection.travelSearchPreferences,
  ]);

  const save = useCallback(() => {
    const selectedFilters = {
      transportModes: selectedModeOptions,
      travelSearchPreferences: selectedTravelSearchPreferences,
    };
    onSave(selectedFilters);

    // Saves only the travel search preferences in storage, while other filters
    // are reset on the next search.
    setFilters({
      travelSearchPreferences: selectedTravelSearchPreferences,
    });
  }, [
    onSave,
    selectedModeOptions,
    selectedTravelSearchPreferences,
    setFilters,
  ]);

  const allModesSelected = selectedModeOptions?.every((m) => m.selected);

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(TripSearchTexts.filters.bottomSheet.title)}
      bottomSheetHeaderType={BottomSheetHeaderType.Confirm}
      closeCallback={() => {
        if (
          filtersSelection.transportModes !== selectedModeOptions ||
          filtersSelection.travelSearchPreferences !==
            selectedTravelSearchPreferences
        ) {
          save();
        }
        giveFocus(onCloseFocusRef);
      }}
    >
      <View
        style={styles.filtersContainer}
        testID="filterView"
        accessible={false}
        importantForAccessibility="no"
      >
        <ThemeText
          style={styles.headingText}
          typography="body__s"
          accessibilityRole="header"
        >
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
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  filtersContainer: {
    marginHorizontal: theme.spacing.medium,
  },
  travelSearchPreference: {
    marginTop: theme.spacing.medium,
  },
  headingText: {
    marginBottom: theme.spacing.medium,
  },
}));
