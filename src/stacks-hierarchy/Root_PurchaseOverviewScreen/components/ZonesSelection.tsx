import {screenReaderPause, ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  AccessibilityProps,
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {FromToRefType} from '../Root_PurchaseOverviewScreen';

type ZonesSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  selectionMode: 'single' | 'multiple';
  onSelect: (params: Root_PurchaseTariffZonesSearchByMapScreenParams) => void;
  style?: StyleProp<ViewStyle>;
};

export const ZonesSelection = forwardRef<FromToRefType, ZonesSelectionProps>(
  (
    {
      fareProductTypeConfig,
      fromTariffZone,
      toTariffZone,
      preassignedFareProduct,
      selectionMode,
      onSelect,
      style,
    }: ZonesSelectionProps,
    ref,
  ) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    const fromToRef = useRef<TouchableOpacity>(null);
    useImperativeHandle(ref, () => ({
      fromToRef,
    }));

    const accessibility: AccessibilityProps = {
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel:
        a11yLabel(fromTariffZone, toTariffZone, language, t) +
        screenReaderPause,
      accessibilityHint: t(PurchaseOverviewTexts.zones.a11yHint),
    };

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
            ref={fromToRef}
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
            <View style={styles.sectionContentContainer}>
              <View>
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
                        {t(PurchaseOverviewTexts.fromToLabel.from)}
                      </ThemeText>
                      <ZoneLabel tariffZone={fromTariffZone} />
                    </View>
                    <View style={styles.toZone}>
                      <ThemeText
                        color="secondary"
                        type="body__secondary"
                        style={styles.toFromLabel}
                      >
                        {t(PurchaseOverviewTexts.fromToLabel.to)}
                      </ThemeText>
                      <ZoneLabel tariffZone={toTariffZone} />
                    </View>
                  </>
                )}
              </View>
              <ThemeIcon svg={Edit} size="normal" />
            </View>
          </GenericClickableSectionItem>
        </Section>
      </View>
    );
  },
);

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
      PurchaseOverviewTexts.fromToLabel.from,
    )} ${getZoneText(from)}`;
    const toLabel = `${t(PurchaseOverviewTexts.fromToLabel.to)} ${getZoneText(
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
  sectionContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
