import React, {useEffect, useState} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';

import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {TravellerSelectionMode} from '@atb/configuration';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';

import {StyleSheet} from '@atb/theme';
import {getReferenceDataName} from '@atb/reference-data/utils';

import {useBottomSheet} from '@atb/components/bottom-sheet';
import {TravellerSelectionSheet} from './TravellerSelectionSheet';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {UserProfileWithCount} from '@atb/fare-contracts';

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

  const [userProfilesState, setUserProfilesState] = useState<
    UserProfileWithCount[]
  >(selectableUserProfiles);

  useEffect(() => {
    setUserProfilesState((prevState) => {
      const updatedState = selectableUserProfiles.map((u) => ({
        ...u,
        count: prevState.find((p) => u.id === p.id)?.count || 0,
      }));

      return updatedState.some(({count}) => count)
        ? updatedState
        : selectableUserProfiles;
    });
  }, [selectableUserProfiles]);

  useEffect(() => {
    const filteredSelection = userProfilesState.filter((u) =>
      selectableUserProfiles.find((i) => i.id === u.id),
    );
    setTravellerSelection(filteredSelection);
  }, [fareProductType, selectionMode, userProfilesState]);

  if (selectionMode === 'none') {
    return null;
  }

  const selectedUserProfiles = userProfilesState.filter(({count}) => count);
  const totalTravellersCount = selectedUserProfiles.reduce(
    (acc, {count}) => acc + count,
    0,
  );
  const multipleTravellerCategoriesSelectedFrom =
    selectedUserProfiles.length > 1;

  const travellersDetailsText =
    selectionMode == 'single'
      ? getReferenceDataName(selectedUserProfiles?.[0], language)
      : selectedUserProfiles
          .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
          .join(', ');

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel:
      t(
        selectionMode == 'multiple'
          ? PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixMultiple
          : PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixSingle,
      ) +
      ' ' +
      travellersDetailsText +
      screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.travellerSelection.a11yHint),
  };

  const travellerSelectionOnPress = () => {
    openBottomSheet(() => (
      <TravellerSelectionSheet
        selectionMode={selectionMode}
        fareProductType={fareProductType}
        selectableUserProfilesWithCountInit={userProfilesState}
        close={(
          chosenSelectableUserProfilesWithCounts?: UserProfileWithCount[],
        ) => {
          if (chosenSelectableUserProfilesWithCounts !== undefined) {
            setUserProfilesState(chosenSelectableUserProfilesWithCounts);
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
            <View style={{flex: 1}}>
              <ThemeText type="body__primary--bold">
                {multipleTravellerCategoriesSelectedFrom
                  ? t(
                      PurchaseOverviewTexts.travellerSelection.travellers_title(
                        totalTravellersCount,
                      ),
                    )
                  : travellersDetailsText}
              </ThemeText>

              {multipleTravellerCategoriesSelectedFrom && (
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.multipleTravellersDetails}
                >
                  {travellersDetailsText}
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
