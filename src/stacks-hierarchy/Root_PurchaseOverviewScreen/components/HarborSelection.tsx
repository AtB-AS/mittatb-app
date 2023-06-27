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
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {StopPlace} from '@atb/api/types/stopPlaces';

export type StopPlaceProps = {
  fromHarbor?: StopPlace;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
};

type StopPlaceSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlace;
  toHarbor?: StopPlace;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (t: StopPlaceProps) => void;
  style?: StyleProp<ViewStyle>;
};

export function HarborSelection({
  fareProductTypeConfig,
  fromHarbor,
  toHarbor,
  preassignedFareProduct,
  onSelect,
  style,
}: StopPlaceSelectionProps) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: a11yLabel(language, t, fromHarbor, toHarbor),
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
              <HarborLabel harbor={fromHarbor} />
            </View>
          </>
        </GenericClickableSectionItem>
        <GenericClickableSectionItem
          onPress={() =>
            fromHarbor &&
            onSelect({
              fromHarbor,
              fareProductTypeConfig,
              preassignedFareProduct,
            })
          }
          testID="selectHarborsButton"
        >
          <View style={styles.toHarbor}>
            <ThemeText
              color={!!fromHarbor ? 'secondary' : 'disabled'}
              type="body__secondary"
              style={styles.toFromLabel}
            >
              {t(PurchaseOverviewTexts.zones.label.to)}
            </ThemeText>
            <HarborLabel harbor={toHarbor} disabled={!fromHarbor} />
          </View>
        </GenericClickableSectionItem>
      </Section>
    </View>
  );
}

const HarborLabel = ({
  harbor,
  disabled = false,
}: {
  harbor?: StopPlace;
  disabled?: boolean;
}) => {
  const harborName = harbor?.name;

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
  from?: StopPlace,
  to?: StopPlace,
): string => {
  const getHarborText = (harbor?: StopPlace) => {
    const venueName = harbor?.name ? `${harbor.name}, ` : '';
    const zoneName = harbor?.name;
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
