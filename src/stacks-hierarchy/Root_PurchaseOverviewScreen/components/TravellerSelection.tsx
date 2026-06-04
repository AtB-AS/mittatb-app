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
  ToggleSectionItem,
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
  usePurchaseSelectionBuilder,
  useSelectableUserProfiles,
} from '@atb/modules/purchase-selection';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {formatToNonBreakingSpaces} from '@atb/utils/text';
import {Travellers} from '@atb/assets/svg/mono-icons/ticketing';
import {useOnBehalfOf} from '../use-on-behalf-of';

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
  const builder = usePurchaseSelectionBuilder();

  const selectionMode =
    selection.fareProductTypeConfig.configuration.travellerSelectionMode;

  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );

  const {isAllowed: isOnBehalfOfAllowed} = useOnBehalfOf(selection);
  const canSelectUserProfile = isUserProfileSelectable(
    selectionMode,
    selectableUserProfiles,
  );

  if (selectionMode === 'none' && !isOnBehalfOfAllowed) {
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
      {canSelectUserProfile && <ThemeIcon svg={Travellers} />}
      <View style={styles.textDescriptionWrapper}>
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

  const heading = (() => {
    if (selectionMode === 'none') {
      return t(PurchaseOverviewTexts.onBehalfOf.sectionTitle);
    }
    return selectionMode == 'multiple'
      ? t(PurchaseOverviewTexts.travellerSelection.titleMultiple)
      : t(PurchaseOverviewTexts.travellerSelection.titleSingle);
  })();

  return (
    <View style={style}>
      <ContentHeading text={heading} />
      <Section {...accessibility}>
        {selectionMode === 'none' ? undefined : canSelectUserProfile ? (
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
        <ToggleSectionItem
          text={t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)}
          value={selection.isOnBehalfOf}
          onValueChange={(newValue) => {
            const newSelection = builder
              .fromSelection(selection)
              .isOnBehalfOf(newValue)
              .build();
            onSave(newSelection);
          }}
          testID="onBehalfOfToggle"
          type="slim"
        />
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
  textDescriptionWrapper: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
  textWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    flexWrap: 'wrap',
  },
}));
