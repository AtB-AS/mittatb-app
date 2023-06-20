import React, {useEffect, useState} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {UserProfileWithCount} from './Travellers/use-user-count-state';

import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {TravellerSelectionMode} from '@atb/configuration';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ThemeText, screenReaderPause} from '@atb/components/text';

import {StyleSheet} from '@atb/theme';
import {getReferenceDataName} from '@atb/reference-data/utils';

import {useBottomSheet} from '@atb/components/bottom-sheet';
import {TravellerSelectionSheet} from './TravellerSelectionSheet';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';

type TravellerSelectionProps = {
  selectableUserProfiles: UserProfileWithCount[];
  setTravellerSelection: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  selectionMode: TravellerSelectionMode;
  fareProductType: string;
};

export function TravellerSelection({
  setTravellerSelection,
  style,
  selectableUserProfiles,
  selectionMode,
  fareProductType,
}: TravellerSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel:
      t(
        selectionMode == 'multiple'
          ? PurchaseOverviewTexts.travellerSelection.title_multiple
          : PurchaseOverviewTexts.travellerSelection.title_single,
      ) + screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.travellerSelection.a11yHint),
  };

  const [selectableUserProfilesWithCount, setSelectableUserProfilesWithCount] =
    useState<UserProfileWithCount[]>(selectableUserProfiles);

  useEffect(() => {
    const filteredSelection = selectableUserProfilesWithCount.filter((u) =>
      selectableUserProfiles.find((i) => i.id === u.id),
    );
    setTravellerSelection(filteredSelection);
  }, [fareProductType, selectionMode, selectableUserProfilesWithCount]);

  if (selectionMode === 'none') {
    return <></>;
  }

  let activeTravellerCategoryCount = 0;
  const totalTravellersCount = selectableUserProfilesWithCount.reduce(
    (acc, sUPWC) => {
      if (sUPWC.count > 0) {
        activeTravellerCategoryCount += 1;
      }
      return acc + sUPWC.count;
    },
    0,
  );

  const multipleTravellerCategoriesSelectedFrom =
    activeTravellerCategoryCount > 1;

  const multipleTravellersDetailsText =
    totalTravellersCount == 0
      ? t(PurchaseOverviewTexts.travellerSelection.no_travellers_selected)
      : selectableUserProfilesWithCount.reduce((acc, sUPWC) => {
          if (sUPWC.count > 0) {
            if (selectionMode == 'single') {
              return getReferenceDataName(sUPWC, language);
            }
            if (acc !== '') {
              acc += ', ';
            }
            return (
              acc + sUPWC.count + ' ' + getReferenceDataName(sUPWC, language) // plural name values not ideal atm?
            );
          } else {
            return acc;
          }
        }, '');

  const travellerSelectionOnPress = () => {
    openBottomSheet(() => (
      <TravellerSelectionSheet
        selectionMode={selectionMode}
        fareProductType={fareProductType}
        selectableUserProfilesWithCountInit={selectableUserProfilesWithCount}
        close={(
          chosenSelectableUserProfilesWithCounts?: UserProfileWithCount[],
        ) => {
          if (chosenSelectableUserProfilesWithCounts !== undefined) {
            setSelectableUserProfilesWithCount(
              chosenSelectableUserProfilesWithCounts,
            );
          }
          closeBottomSheet();
        }}
      />
    ));
  };

  return (
    <View style={style}>
      <View style={styles.sectionTitleContainer}>
        <ThemeText type="body__secondary" color="secondary">
          {selectionMode == 'multiple'
            ? t(PurchaseOverviewTexts.travellerSelection.title_multiple)
            : t(PurchaseOverviewTexts.travellerSelection.title_single)}
        </ThemeText>
      </View>
      <Section {...accessibility}>
        <GenericClickableSectionItem onPress={travellerSelectionOnPress}>
          <View style={styles.sectionContentContainer}>
            <View>
              <ThemeText type="body__primary--bold">
                {multipleTravellerCategoriesSelectedFrom
                  ? t(
                      PurchaseOverviewTexts.travellerSelection.travellers_title(
                        totalTravellersCount,
                      ),
                    )
                  : multipleTravellersDetailsText}
              </ThemeText>

              {multipleTravellerCategoriesSelectedFrom && (
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.multipleTravellersDetails}
                >
                  {multipleTravellersDetailsText}
                </ThemeText>
              )}
            </View>

            <ThemeIcon svg={Edit} size="normal" />
          </View>
        </GenericClickableSectionItem>
      </Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  multipleTravellersDetails: {
    marginTop: theme.spacings.small,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacings.medium,
    alignItems: 'center',
  },
  sectionContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
