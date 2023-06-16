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
import {PassengerSelectionSheet} from './PassengerSelectionSheet';

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
      'Todo: Some label in the correct language here' + screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.zones.a11yHint),
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

  let numberOfPassengerCategoriesSelectedFrom = 0;
  const totalPassengersCount = selectableUserProfilesWithCount.reduce(
    (acc, sUPWC) => {
      if (sUPWC.count > 0) {
        numberOfPassengerCategoriesSelectedFrom += 1;
      }
      return acc + sUPWC.count;
    },
    0,
  );

  const multiplePassengerCategoriesSelectedFrom =
    numberOfPassengerCategoriesSelectedFrom > 1;

  const multiplePassengersDetailsText =
    totalPassengersCount == 0
      ? t(PurchaseOverviewTexts.travellerSelection.no_passengers_selected)
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

  const passengerSelectionOnPress = () => {
    openBottomSheet(() => (
      <PassengerSelectionSheet
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
        <GenericClickableSectionItem onPress={passengerSelectionOnPress}>
          <View style={styles.sectionContentContainer}>
            <View>
              <ThemeText type="body__primary--bold">
                {multiplePassengerCategoriesSelectedFrom
                  ? t(
                      PurchaseOverviewTexts.travellerSelection.passengers_title(
                        totalPassengersCount,
                      ),
                    )
                  : multiplePassengersDetailsText}
              </ThemeText>

              {multiplePassengerCategoriesSelectedFrom && (
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.multiplePassengersDetails}
                >
                  {multiplePassengersDetailsText}
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
  multiplePassengersDetails: {
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
