import React, {useCallback, useRef} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {
  FareProductTypeConfig,
  getReferenceDataName,
  TravellerSelectionMode,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {
  GenericClickableSectionItem,
  GenericSectionItem,
  Section,
} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {TravellerSelectionSheet} from './TravellerSelectionSheet';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {ContentHeading} from '@atb/components/heading';
import {usePopOver} from '@atb/popover';
import {useFocusEffect} from '@react-navigation/native';
import {isUserProfileSelectable} from '../utils';
import {useAuthState} from '@atb/auth';
import {useFeatureToggles} from '@atb/feature-toggles';
import {getSelectableUserProfiles} from '@atb/purchase-selection';
import {PreassignedFareProduct} from '@atb-as/config-specs';

type TravellerSelectionProps = {
  userProfilesWithCount: UserProfileWithCount[];
  setUserProfilesWithCount: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  selectionMode: TravellerSelectionMode;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  setIsOnBehalfOfToggle: (onBehalfOfToggle: boolean) => void;
  isOnBehalfOfToggle: boolean;
};

export function TravellerSelection({
  setUserProfilesWithCount,
  style,
  userProfilesWithCount,
  selectionMode,
  fareProductTypeConfig,
  preassignedFareProduct,
  setIsOnBehalfOfToggle,
  isOnBehalfOfToggle,
}: TravellerSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {authenticationType} = useAuthState();
  const {userProfiles} = useFirestoreConfiguration();

  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const isOnBehalfOfEnabled =
    useFeatureToggles().isOnBehalfOfEnabled &&
    fareProductTypeConfig.configuration.onBehalfOfEnabled;

  const isLoggedIn = authenticationType === 'phone';

  const isOnBehalfOfAllowed = isOnBehalfOfEnabled && isLoggedIn;

  const {addPopOver} = usePopOver();
  const onBehalfOfIndicatorRef = useRef(null);

  const selectableUserProfiles = getSelectableUserProfiles(
    userProfiles,
    preassignedFareProduct,
  );

  const userProfilesWithCountToShow = selectableUserProfiles.map((u) => ({
    ...u,
    count: userProfilesWithCount.find(({id}) => id === u.id)?.count ?? 0,
  }));

  const canSelectUserProfile = isUserProfileSelectable(
    selectionMode,
    userProfilesWithCountToShow,
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

  const selectedUserProfiles = userProfilesWithCountToShow.filter(
    ({count}) => count,
  );
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

  const sendingToOthersAccessibility = isOnBehalfOfToggle
    ? screenReaderPause + t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)
    : '';

  const travellerInfo = !canSelectUserProfile
    ? getTextForLanguage(
        userProfilesWithCount[0].alternativeDescriptions,
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
    openBottomSheet(() => (
      <TravellerSelectionSheet
        selectionMode={selectionMode}
        fareProductTypeConfig={fareProductTypeConfig}
        selectableUserProfilesWithCountInit={userProfilesWithCountToShow}
        isOnBehalfOfToggle={isOnBehalfOfToggle}
        onConfirmSelection={(
          chosenSelectableUserProfilesWithCounts?: UserProfileWithCount[],
          onBehalfOfToggle?: boolean,
        ) => {
          if (chosenSelectableUserProfilesWithCounts !== undefined) {
            setUserProfilesWithCount(
              chosenSelectableUserProfilesWithCounts.filter((u) => u.count),
            );
          }
          if (onBehalfOfToggle !== undefined) {
            setIsOnBehalfOfToggle(onBehalfOfToggle);
          }
          closeBottomSheet();
        }}
      />
    ));
  };

  const content = (
    <View style={styles.sectionContentContainer}>
      <View style={{flex: 1}}>
        <ThemeText type="body__primary--bold" testID="selectedTravellers">
          {multipleTravellerCategoriesSelectedFrom
            ? t(
                PurchaseOverviewTexts.travellerSelection.travellers_title(
                  totalTravellersCount,
                ),
              )
            : travellersDetailsText}
        </ThemeText>
        {!canSelectUserProfile && (
          <ThemeText type="body__secondary" color="secondary">
            {travellerInfo}
          </ThemeText>
        )}
        {isOnBehalfOfToggle && canSelectUserProfile && (
          <ThemeText type="body__secondary" color="secondary">
            {t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)}
          </ThemeText>
        )}

        {multipleTravellerCategoriesSelectedFrom && (
          <ThemeText
            type="body__secondary"
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
            // ref={onCloseFocusRef}
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
