import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FocusRefsType} from '@atb/utils/use-focus-refs';
import {ContentHeading} from '@atb/components/heading';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';

type StopPlaceSelectionProps = {
  selection: PurchaseSelectionType;
  onSelect: (selection: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export const HarborSelection = forwardRef<
  FocusRefsType,
  StopPlaceSelectionProps
>(({selection, onSelect, style}: StopPlaceSelectionProps, ref) => {
  const {t} = useTranslation();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const fromHarborRef = useRef<typeof TouchableOpacity>(null);
  const toHarborRef = useRef<typeof TouchableOpacity>(null);
  useImperativeHandle(ref, () => ({fromHarborRef, toHarborRef}));

  if (!selection.stopPlaces) return null;

  return (
    <View style={style} accessible={false}>
      <ContentHeading
        text={t(PurchaseOverviewTexts.stopPlaces.harborSelection.select)}
      />
      <Section accessible={false}>
        <HarborSelectionItem
          fromOrTo="from"
          harbor={selection.stopPlaces.from}
          disabled={false}
          onPress={() =>
            onSelect(
              // Wipe existing stop places when selecting new from stop place
              selectionBuilder
                .fromSelection(selection)
                .fromStopPlace(undefined)
                .toStopPlace(undefined)
                .build(),
            )
          }
          ref={fromHarborRef}
        />
        <HarborSelectionItem
          fromOrTo="to"
          harbor={selection.stopPlaces.to}
          disabled={!selection.stopPlaces.from}
          onPress={() => onSelect(selection)}
          ref={toHarborRef}
        />
      </Section>
    </View>
  );
});

type HarborSelectionItemProps = {
  harbor?: StopPlaceFragment;
  disabled: boolean;
  onPress: () => void;
  fromOrTo: 'from' | 'to';
};

const HarborSelectionItem = forwardRef<
  typeof TouchableOpacity,
  HarborSelectionItemProps
>(({harbor, onPress, disabled, fromOrTo}: HarborSelectionItemProps, ref) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <GenericClickableSectionItem
      ref={ref}
      accessibilityState={{disabled}}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={t(
        PurchaseOverviewTexts.stopPlaces.harborSelection[fromOrTo].a11yLabel(
          harbor?.name,
        ),
      )}
      accessibilityHint={
        disabled
          ? undefined
          : t(
              PurchaseOverviewTexts.stopPlaces.harborSelection[fromOrTo]
                .a11yHint,
            )
      }
      radius={fromOrTo === 'from' ? 'top' : 'bottom'}
      onPress={() => !disabled && onPress()}
      testID="selectHarborsButton"
    >
      <View style={styles.sectionContent}>
        <ThemeText
          color={disabled ? 'disabled' : 'secondary'}
          typography="body__secondary"
          style={styles.toFromLabel}
        >
          {t(PurchaseOverviewTexts.fromToLabel[fromOrTo])}
        </ThemeText>
        <HarborLabel harbor={harbor} disabled={disabled} />
      </View>
    </GenericClickableSectionItem>
  );
});

const HarborLabel = ({
  harbor,
  disabled = false,
}: {
  harbor?: StopPlaceFragment;
  disabled?: boolean;
}) => {
  const harborName = harbor?.name;
  const {t} = useTranslation();
  return harborName ? (
    <ThemeText typography="body__primary--bold">{harborName}</ThemeText>
  ) : (
    <ThemeText
      style={{flexShrink: 1}}
      color={disabled ? 'disabled' : 'primary'}
    >
      {t(PurchaseOverviewTexts.stopPlaces.harborSelection.noneSelected.text)}
    </ThemeText>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionContent: {
    flexDirection: 'row',
  },
  toFromLabel: {
    minWidth: 40,
    marginRight: theme.spacing.small,
  },
}));
