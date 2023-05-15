import {screenReaderPause, ThemeText} from '@atb/components/text';
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
import {TariffZoneWithMetadata} from '../../Root_PurchaseTariffZonesSearchByMapScreen';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';

type ZonesSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (t: {
    fromTariffZone: TariffZoneWithMetadata;
    toTariffZone: TariffZoneWithMetadata;
    fareProductTypeConfig: FareProductTypeConfig;
    preassignedFareProduct: PreassignedFareProduct;
  }) => void;
  style?: StyleProp<ViewStyle>;
};

export function ZonesSelection({
  fareProductTypeConfig,
  fromTariffZone,
  toTariffZone,
  preassignedFareProduct,
  onSelect,
  style,
}: ZonesSelectionProps) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel:
      a11yLabel(fromTariffZone, toTariffZone, language, t) + screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.zones.a11yHint),
  };

  let selectionMode = fareProductTypeConfig.configuration.zoneSelectionMode;

  if (selectionMode === 'none') {
    return null;
  }

  // Only support multiple/single zone in app for now. Stop place is built into selector.
  if (selectionMode == 'multiple-stop' || selectionMode == 'multiple-zone') {
    selectionMode = 'multiple';
  }
  if (
    preassignedFareProduct.zoneSelectionMode?.includes('single') ||
    selectionMode == 'single-stop' ||
    selectionMode == 'single-zone'
  ) {
    selectionMode = 'single';
  }

  const displayAsOneZone =
    fromTariffZone.id === toTariffZone.id &&
    fromTariffZone.venueName === toTariffZone.venueName;

  return (
    <View style={style}>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={styles.sectionText}
        accessibilityLabel={t(
          PurchaseOverviewTexts.zones.title[selectionMode].a11yLabel,
        )}
      >
        {t(PurchaseOverviewTexts.zones.title[selectionMode].text)}
      </ThemeText>
      <Section {...accessibility}>
        <GenericClickableSectionItem
          onPress={() =>
            onSelect({
              fromTariffZone,
              toTariffZone,
              fareProductTypeConfig,
              preassignedFareProduct,
            })
          }
          testID="selectZonesButton"
        >
          {displayAsOneZone ? (
            <ZoneLabel tariffZone={fromTariffZone} />
          ) : (
            <>
              <View style={styles.fromZone}>
                <ThemeText
                  color="secondary"
                  type="body__secondary"
                  style={styles.toFromLabel}
                >
                  {t(PurchaseOverviewTexts.zones.label.from)}
                </ThemeText>
                <ZoneLabel tariffZone={fromTariffZone} />
              </View>
              <View style={styles.toZone}>
                <ThemeText
                  color="secondary"
                  type="body__secondary"
                  style={styles.toFromLabel}
                >
                  {t(PurchaseOverviewTexts.zones.label.to)}
                </ThemeText>
                <ZoneLabel tariffZone={toTariffZone} />
              </View>
            </>
          )}
        </GenericClickableSectionItem>
      </Section>
    </View>
  );
}

const ZoneLabel = ({tariffZone}: {tariffZone: TariffZoneWithMetadata}) => {
  const {t, language} = useTranslation();
  const zoneName = getReferenceDataName(tariffZone, language);
  const zoneLabel = t(PurchaseOverviewTexts.zones.zoneName(zoneName));

  return tariffZone.venueName ? (
    <ThemeText style={{flexShrink: 1}}>
      <ThemeText type="body__primary--bold">
        {tariffZone.venueName + ' '}
      </ThemeText>
      ({zoneLabel})
    </ThemeText>
  ) : (
    <ThemeText type="body__primary--bold">{zoneLabel}</ThemeText>
  );
};

const a11yLabel = (
  from: TariffZoneWithMetadata,
  to: TariffZoneWithMetadata,
  language: Language,
  t: TranslateFunction,
): string => {
  const displayAsOneZone = from.id === to.id && from.venueName === to.venueName;

  const getZoneText = (tz: TariffZoneWithMetadata) => {
    const venueName = tz.venueName ? `${tz.venueName}, ` : '';
    const zoneName = getReferenceDataName(tz, language);
    return venueName + t(PurchaseOverviewTexts.zones.zoneName(zoneName));
  };

  if (displayAsOneZone) {
    const prefix = t(PurchaseOverviewTexts.zones.a11yLabelPrefixSingle);
    return `${prefix} ${getZoneText(from)}`;
  } else {
    const prefix = t(PurchaseOverviewTexts.zones.a11yLabelPrefixMultiple);
    const fromLabel = `${t(
      PurchaseOverviewTexts.zones.label.from,
    )} ${getZoneText(from)}`;
    const toLabel = `${t(PurchaseOverviewTexts.zones.label.to)} ${getZoneText(
      to,
    )}`;
    return `${prefix} ${fromLabel}, ${toLabel}`;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  subtitleStyle: {
    paddingTop: theme.spacings.xSmall,
  },
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
  fromZone: {
    flexDirection: 'row',
  },
  toZone: {
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  toFromLabel: {
    minWidth: 40,
    marginRight: theme.spacings.small,
  },
}));
