import React, {useRef} from 'react';
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
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TravellerSelectionSheet} from './TravellerSelectionSheet';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ContentHeading} from '@atb/components/heading';
import {isUserProfileSelectable} from '../utils';
import {
  type PurchaseSelectionType,
  useSelectableUserProfiles,
} from '@atb/modules/purchase-selection';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {formatToNonBreakingSpaces} from '@atb/utils/text';
import {Travellers} from '@atb/assets/svg/mono-icons/ticketing';

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
  const {theme} = useThemeContext();
  const styles = useStyles();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

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

  const travellersDetailsText = [
    ...selection.userProfilesWithCount,
    ...selection.supplementProductsWithCount,
  ]
    .map(
      (t) =>
        `${t.count > 1 ? t.count + ' ' : ''}${getReferenceDataName(t, language)}`,
    )
    .map((t) => formatToNonBreakingSpaces(t))
    .join(', ');

  const travellerCount =
    selection.userProfilesWithCount.reduce(
      (sum, current) => sum + current.count,
      0,
    ) +
    selection.supplementProductsWithCount.reduce(
      (sum, current) => sum + current.count,
      0,
    );

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
    bottomSheetModalRef.current?.present();
  };

  const content = (
    <View style={styles.sectionContentContainer}>
      <ThemeIcon svg={Travellers} />
      <View style={{flex: 1}}>
        <View style={styles.textWrapper}>
          <ThemeText typography="body__m__strong">
            {t(
              PurchaseOverviewTexts.travellerSelection.travellerCount(
                travellerCount,
              ),
            )}
          </ThemeText>
          <ThemeText typography="body__m" testID="selectedTravellers">
            ({travellersDetailsText})
          </ThemeText>
        </View>
        {!canSelectUserProfile && (
          <ThemeText typography="body__s" type="secondary">
            {travellerInfo}
          </ThemeText>
        )}
      </View>

      {canSelectUserProfile && (
        <ThemeIcon
          svg={Edit}
          size="normal"
          color={theme.color.interactive[0].default.background}
        />
      )}
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
      <TravellerSelectionSheet
        selection={selection}
        onSave={(selection) => {
          onSave(selection);
          bottomSheetModalRef.current?.dismiss();
        }}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
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
    gap: theme.spacing.small,
  },
  textWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    flexWrap: 'wrap',
  },
}));
