import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FromToRefType} from '../Root_PurchaseOverviewScreen';

type StopPlaceSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlaceFragment;
  toHarbor?: StopPlaceFragment;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (params: Root_PurchaseHarborSearchScreenParams) => void;
  style?: StyleProp<ViewStyle>;
};

export const HarborSelection = forwardRef<
  FromToRefType,
  StopPlaceSelectionProps
>(
  (
    {
      fareProductTypeConfig,
      fromHarbor,
      toHarbor,
      preassignedFareProduct,
      onSelect,
      style,
    }: StopPlaceSelectionProps,
    ref,
  ) => {
    const styles = useStyles();
    const {t} = useTranslation();

    const fromRef = useRef<TouchableOpacity>(null);
    const toRef = useRef<TouchableOpacity>(null);
    useImperativeHandle(ref, () => ({fromRef, toRef}));

    return (
      <View style={style} accessible={false}>
        <ThemeText
          type="body__secondary"
          color="secondary"
          style={styles.sectionText}
          accessibilityLabel={t(
            PurchaseOverviewTexts.stopPlaces.harborSelection.select.a11yLabel,
          )}
        >
          {t(PurchaseOverviewTexts.stopPlaces.harborSelection.select.text)}
        </ThemeText>

        <Section accessible={false}>
          <HarborSelectionItem
            fromOrTo="from"
            harbor={fromHarbor}
            disabled={false}
            onPress={() =>
              onSelect({
                fareProductTypeConfig,
                preassignedFareProduct,
              })
            }
            ref={fromRef}
          />
          <HarborSelectionItem
            fromOrTo="to"
            harbor={toHarbor}
            disabled={!fromHarbor}
            onPress={() =>
              onSelect({
                fromHarbor,
                fareProductTypeConfig,
                preassignedFareProduct,
              })
            }
            ref={toRef}
          />
        </Section>
      </View>
    );
  },
);

type HarborSelectionItemProps = {
  harbor?: StopPlaceFragment;
  disabled: boolean;
  onPress: () => void;
  fromOrTo: 'from' | 'to';
};

const HarborSelectionItem = forwardRef<
  TouchableOpacity,
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
      onPress={() => !disabled && onPress()}
      testID="selectHarborsButton"
    >
      <View style={fromOrTo === 'from' ? styles.fromHarbor : styles.toHarbor}>
        <ThemeText
          color={disabled ? 'disabled' : 'secondary'}
          type="body__secondary"
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
    <ThemeText type="body__primary--bold">{harborName}</ThemeText>
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
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
  fromHarbor: {
    flexDirection: 'row',
  },
  toHarbor: {
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  toFromLabel: {
    minWidth: 40,
    marginRight: theme.spacings.small,
  },
}));
