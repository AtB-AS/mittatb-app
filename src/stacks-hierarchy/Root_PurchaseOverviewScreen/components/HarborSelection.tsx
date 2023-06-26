import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {BoatStopPoint, PreassignedFareProduct} from '@atb/reference-data/types';

type DockSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromBoatStopPoint?: BoatStopPoint;
  toBoatStopPoint?: BoatStopPoint;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (t: {
    fromBoatStopPoint?: BoatStopPoint;
    toBoatStopPoint?: BoatStopPoint;
    fareProductTypeConfig: FareProductTypeConfig;
    preassignedFareProduct: PreassignedFareProduct;
  }) => void;
  style?: StyleProp<ViewStyle>;
};

export function HarborSelection({
  fareProductTypeConfig,
  fromBoatStopPoint,
  toBoatStopPoint,
  preassignedFareProduct,
  onSelect,
  style,
}: DockSelectionProps) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: a11yLabel(
      language,
      t,
      fromBoatStopPoint,
      toBoatStopPoint,
    ),
    accessibilityHint: t(PurchaseOverviewTexts.zones.a11yHint),
  };

  return (
    <View style={style}>
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
      <Section {...accessibility}>
        <GenericClickableSectionItem
          onPress={() =>
            onSelect({
              fareProductTypeConfig,
              preassignedFareProduct,
            })
          }
          testID="selectHarborsButton"
        >
          <>
            <View style={styles.fromHarbor}>
              <ThemeText
                color="secondary"
                type="body__secondary"
                style={styles.toFromLabel}
              >
                {t(PurchaseOverviewTexts.zones.label.from)}
              </ThemeText>
              <HarborLabel boatStopPoint={fromBoatStopPoint} />
            </View>
          </>
        </GenericClickableSectionItem>
        <GenericClickableSectionItem
          onPress={() =>
            fromBoatStopPoint &&
            onSelect({
              fromBoatStopPoint,
              fareProductTypeConfig,
              preassignedFareProduct,
            })
          }
          testID="selectHarborsButton"
        >
          <View style={styles.toHarbor}>
            <ThemeText
              color={!!fromBoatStopPoint ? 'secondary' : 'disabled'}
              type="body__secondary"
              style={styles.toFromLabel}
            >
              {t(PurchaseOverviewTexts.zones.label.to)}
            </ThemeText>
            <HarborLabel
              boatStopPoint={toBoatStopPoint}
              disabled={!fromBoatStopPoint}
            />
          </View>
        </GenericClickableSectionItem>
      </Section>
    </View>
  );
}

const HarborLabel = ({
  boatStopPoint,
  disabled = false,
}: {
  boatStopPoint?: BoatStopPoint;
  disabled?: boolean;
}) => {
  const harborName = boatStopPoint?.name;

  return harborName ? (
    <ThemeText type="body__primary--bold">{harborName}</ThemeText>
  ) : (
    <ThemeText
      style={{flexShrink: 1}}
      color={disabled ? 'disabled' : 'primary'}
    >
      {'Ingen kai valgt'}
    </ThemeText>
  );
};

const a11yLabel = (
  language: Language,
  t: TranslateFunction,
  from?: BoatStopPoint,
  to?: BoatStopPoint,
): string => {
  const getHarborText = (boatStopPoint?: BoatStopPoint) => {
    const venueName = boatStopPoint?.name ? `${boatStopPoint.name}, ` : '';
    const zoneName = boatStopPoint?.name;
    return (
      venueName +
      (zoneName ??
        t(PurchaseOverviewTexts.stopPlaces.harborSelection.noneSelected.text))
    );
  };

  const prefix = t(PurchaseOverviewTexts.zones.a11yLabelPrefixMultiple);
  const fromLabel = `${t(
    PurchaseOverviewTexts.zones.label.from,
  )} ${getHarborText(from)}`;
  const toLabel = `${t(PurchaseOverviewTexts.zones.label.to)} ${getHarborText(
    to,
  )}`;
  return `${prefix} ${fromLabel}, ${toLabel}`;
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
