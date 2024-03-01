import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';

import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {TravellerSelectionMode} from '@atb/configuration';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';

import {StyleSheet} from '@atb/theme';
import {getReferenceDataName} from '@atb/configuration';

import {useBottomSheet} from '@atb/components/bottom-sheet';
import {TravellerSelectionSheet} from './TravellerSelectionSheet';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {ContentHeading} from '@atb/components/heading';
import {LabelInfo} from '@atb/components/label-info';
import {useOnBehalfOf} from '@atb/on-behalf-of';
import {LabelInfoTexts} from '@atb/translations/components/LabelInfo';
import {usePopOver} from '@atb/popover';
import {useFocusEffect} from '@react-navigation/native';

type TravellerSelectionProps = {
  selectableUserProfiles: UserProfileWithCount[];
  setTravellerSelection: (
    userProfilesWithCount: UserProfileWithCount[],
  ) => void;
  style?: StyleProp<ViewStyle>;
  selectionMode: TravellerSelectionMode;
  fareProductType: string;
  setIsOnBehalfOfToggle: (onBehalfOfToggle: boolean) => void;
  isOnBehalfOfToggle: boolean;
};

export function TravellerSelection({
  setTravellerSelection,
  style,
  selectableUserProfiles,
  selectionMode,
  fareProductType,
  setIsOnBehalfOfToggle,
  isOnBehalfOfToggle,
}: TravellerSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    onCloseFocusRef,
  } = useBottomSheet();

  const isOnBehalfOfEnabled = useOnBehalfOf();

  const {addPopOver} = usePopOver();
  const onBehalfOfIndicatorRef = useRef(null);

  const [userProfilesState, setUserProfilesState] = useState<
    UserProfileWithCount[]
  >(selectableUserProfiles);

  const canSelectUserProfile = !(
    selectionMode === `single` && selectableUserProfiles.length <= 1
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fareProductType, selectionMode, userProfilesState]);

  useFocusEffect(
    useCallback(() => {
      if (isOnBehalfOfEnabled && selectionMode !== 'none') {
        addPopOver({
          oneTimeKey: 'on-behalf-of-new-feature-introduction',
          target: onBehalfOfIndicatorRef,
        });
      }
    }, [isOnBehalfOfEnabled, addPopOver, selectionMode]),
  );

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

  const newLabelAccessibility =
    isOnBehalfOfEnabled && canSelectUserProfile
      ? screenReaderPause + t(LabelInfoTexts.labels['new'])
      : '';

  const sendingToOthersAccessibility = isOnBehalfOfToggle
    ? screenReaderPause + t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)
    : '';

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: canSelectUserProfile ? 'button' : 'none',
    accessibilityLabel: canSelectUserProfile
      ? t(
          selectionMode == 'multiple'
            ? PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixMultiple
            : PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixSingle,
        )
      : t(
          PurchaseOverviewTexts.travellerSelection.a11yLabelPrefixNotSelectable,
        ) +
        ' ' +
        travellersDetailsText +
        sendingToOthersAccessibility +
        newLabelAccessibility +
        screenReaderPause,
    accessibilityHint: canSelectUserProfile
      ? t(PurchaseOverviewTexts.travellerSelection.a11yHint)
      : undefined,
  };

  const travellerSelectionOnPress = () => {
    openBottomSheet(() => (
      <TravellerSelectionSheet
        selectionMode={selectionMode}
        fareProductType={fareProductType}
        selectableUserProfilesWithCountInit={userProfilesState}
        isOnBehalfOfToggle={isOnBehalfOfToggle}
        onConfirmSelection={(
          chosenSelectableUserProfilesWithCounts?: UserProfileWithCount[],
          onBehalfOfToggle?: boolean,
        ) => {
          if (chosenSelectableUserProfilesWithCounts !== undefined) {
            setUserProfilesState(chosenSelectableUserProfilesWithCounts);
          }
          if (onBehalfOfToggle !== undefined) {
            setIsOnBehalfOfToggle(onBehalfOfToggle);
          }
          closeBottomSheet();
        }}
      />
    ));
  };

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
        <GenericClickableSectionItem
          onPress={travellerSelectionOnPress}
          disabled={!canSelectUserProfile}
          ref={onCloseFocusRef}
        >
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

              {isOnBehalfOfToggle && (
                <ThemeText type="body__secondary" color="secondary">
                  {t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)}
                </ThemeText>
              )}

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

            {/* remove new label when requested */}
            {isOnBehalfOfEnabled && canSelectUserProfile && (
              <View
                ref={onBehalfOfIndicatorRef}
                renderToHardwareTextureAndroid={true}
                collapsable={false}
              >
                <LabelInfo label="new" />
              </View>
            )}

            {canSelectUserProfile && <ThemeIcon svg={Edit} size="normal" />}
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
  sectionContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
