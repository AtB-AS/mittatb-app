import React, {RefObject, useCallback, useRef} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {getReferenceDataName} from '@atb/configuration';
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
import {UserProfileWithCount} from '@atb/fare-contracts';
import {ContentHeading} from '@atb/components/heading';
import {usePopOverContext} from '@atb/popover';
import {useFocusEffect} from '@react-navigation/native';
import {isUserProfileSelectable} from '../utils';
import {useAuthContext} from '@atb/auth';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {
  useSelectableUserProfiles,
  type PurchaseSelectionType,
} from '@atb/purchase-selection';

type TravellerSelectionProps = {
  selection: PurchaseSelectionType;
  isOnBehalfOfToggle: boolean;
  onSave: (
    userProfilesWithCount: UserProfileWithCount[],
    onBehalfOfToggle: boolean,
  ) => void;
  style?: StyleProp<ViewStyle>;
};

export function TravellerSelection({
  selection,
  isOnBehalfOfToggle,
  onSave,
  style,
}: TravellerSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {authenticationType} = useAuthContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();

  const isOnBehalfOfEnabled =
    useFeatureTogglesContext().isOnBehalfOfEnabled &&
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;
  const isOnBehalfOfAllowed =
    isOnBehalfOfEnabled && authenticationType === 'phone';

  const {addPopOver} = usePopOverContext();
  const onBehalfOfIndicatorRef = useRef(null);

  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );

  const canSelectUserProfile = isUserProfileSelectable(
    selectionMode,
    selectableUserProfiles,
  );

  useFocusEffect(
    useCallback(() => {
      if (isOnBehalfOfAllowed && canSelectUserProfile) {
        addPopOver({
          oneTimeKey: 'on-behalf-of-new-feature-introduction',
          target: onBehalfOfIndicatorRef,
        });
      }
    }, [isOnBehalfOfAllowed, addPopOver, canSelectUserProfile]),
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
      ? getReferenceDataName(selection.userProfilesWithCount?.[0], language)
      : selection.userProfilesWithCount
          .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
          .join(', ');

  const sendingToOthersAccessibility = isOnBehalfOfToggle
    ? screenReaderPause + t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)
    : '';

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
      sendingToOthersAccessibility +
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
          isOnBehalfOfToggle={isOnBehalfOfToggle}
          onSave={(
            userProfilesWithCounts: UserProfileWithCount[],
            onBehalfOfToggle: boolean,
          ) => {
            onSave(userProfilesWithCounts, onBehalfOfToggle);
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
        <ThemeText typography="body__primary--bold" testID="selectedTravellers">
          {multipleTravellerCategoriesSelectedFrom
            ? t(
                PurchaseOverviewTexts.travellerSelection.travellers_title(
                  totalTravellersCount,
                ),
              )
            : travellersDetailsText}
        </ThemeText>
        {!canSelectUserProfile && (
          <ThemeText typography="body__secondary" color="secondary">
            {travellerInfo}
          </ThemeText>
        )}
        {isOnBehalfOfToggle && canSelectUserProfile && (
          <ThemeText typography="body__secondary" color="secondary">
            {t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)}
          </ThemeText>
        )}

        {multipleTravellerCategoriesSelectedFrom && (
          <ThemeText
            typography="body__secondary"
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
          canSelectUserProfile
            ? t(
                selectionMode == 'multiple'
                  ? PurchaseOverviewTexts.travellerSelection.titleMultiple
                  : PurchaseOverviewTexts.travellerSelection.titleSingle,
              )
            : t(PurchaseOverviewTexts.travellerSelection.titleNotSelectable)
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
