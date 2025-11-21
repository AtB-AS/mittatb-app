import React, {RefObject, useRef} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/modules/configuration';
import {
  GenericClickableSectionItem,
  GenericSectionItem,
  Section,
} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {TravellerSelectionSheet} from './TravellerSelectionSheet';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ContentHeading} from '@atb/components/heading';
import {isUserProfileSelectable} from '../utils';
import {
  type PurchaseSelectionType,
  useSelectableUserProfiles,
} from '@atb/modules/purchase-selection';

type TravellerSelectionProps = {
  selection: PurchaseSelectionType;
  onSave: (selection: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export function TravellerSelection({
  selection,
  onSave,
  style,
}: TravellerSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );

  const canSelectUserProfile = isUserProfileSelectable(
    selectionMode,
    selectableUserProfiles,
  );

  if (selectionMode === 'none') {
    return null;
  }

  const totalTravellersCount = selection.userProfilesWithCount.reduce(
    (acc, {count}) => acc + count,
    0,
  );
  const multipleTravellerCategoriesSelectedFrom =
    selection.userProfilesWithCount.length > 1;

  const travellersDetailsText =
    selectionMode == 'single'
      ? [getReferenceDataName(selection.userProfilesWithCount?.[0], language)]
      : selection.userProfilesWithCount
          .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
          .concat(
            selection.baggageProductsWithCount.map(
              (s) => `${s.count} ${getReferenceDataName(s, language)}`,
            ),
          )
          .join(', ');

  const travellerInfo = !canSelectUserProfile
    ? getTextForLanguage(
        selection.userProfilesWithCount[0].alternativeDescriptions,
        language,
      )
    : '';

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: canSelectUserProfile ? 'button' : 'none',
    accessibilityLabel:
      (canSelectUserProfile
        ? t(
            selectionMode == 'multiple'
              ? PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixMultiple
              : PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixSingle,
          )
        : t(
            PurchaseOverviewTexts.travellerSelection
              .a11yLabelPrefixNotSelectable,
          )) +
      ' ' +
      travellersDetailsText +
      travellerInfo +
      screenReaderPause,
    accessibilityHint: canSelectUserProfile
      ? t(PurchaseOverviewTexts.travellerSelection.a11yHint)
      : undefined,
  };

  const travellerSelectionOnPress = () => {
    openBottomSheet(
      () => (
        <TravellerSelectionSheet
          selection={selection}
          onSave={(selection) => {
            onSave(selection);
            closeBottomSheet();
          }}
        />
      ),
      onCloseFocusRef,
    );
  };

  const content = (
    <View style={styles.sectionContentContainer}>
      <View style={{flex: 1}}>
        <ThemeText typography="body__m__strong" testID="selectedTravellers">
          {multipleTravellerCategoriesSelectedFrom
            ? t(
                PurchaseOverviewTexts.travellerSelection.travellers_title(
                  totalTravellersCount,
                ),
              )
            : travellersDetailsText}
        </ThemeText>
        {!canSelectUserProfile && (
          <ThemeText typography="body__s" color="secondary">
            {travellerInfo}
          </ThemeText>
        )}

        {multipleTravellerCategoriesSelectedFrom && (
          <ThemeText
            typography="body__s"
            color="secondary"
            style={styles.multipleTravellersDetails}
            testID="selectedTravellers"
          >
            {travellersDetailsText}
          </ThemeText>
        )}
      </View>

      {canSelectUserProfile && <ThemeIcon svg={Edit} size="normal" />}
    </View>
  );

  return (
    <View style={style}>
      <ContentHeading
        text={
          selectionMode == 'multiple'
            ? t(PurchaseOverviewTexts.travellerSelection.titleMultiple)
            : t(PurchaseOverviewTexts.travellerSelection.titleSingle)
        }
      />
      <Section {...accessibility}>
        {canSelectUserProfile ? (
          <GenericClickableSectionItem
            onPress={travellerSelectionOnPress}
            ref={onCloseFocusRef}
            testID="selectTravellerButton"
          >
            {content}
          </GenericClickableSectionItem>
        ) : (
          <GenericSectionItem>{content}</GenericSectionItem>
        )}
      </Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  multipleTravellersDetails: {
    marginTop: theme.spacing.small,
  },
  sectionContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
