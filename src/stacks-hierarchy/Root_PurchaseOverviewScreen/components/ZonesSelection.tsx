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
import {
  GenericClickableSectionItem,
  GenericSectionItem,
  Section,
} from '@atb/components/sections';
import {PreassignedFareProduct, getReferenceDataName} from '@atb/configuration';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {FocusRefsType} from '@atb/utils/use-focus-refs';
import {ContentHeading} from '@atb/components/heading';

type ZonesSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  selectionMode: 'single' | 'multiple';
  onSelect: (params: Root_PurchaseTariffZonesSearchByMapScreenParams) => void;
  style?: StyleProp<ViewStyle>;
};

export const ZonesSelection = forwardRef<FocusRefsType, ZonesSelectionProps>(
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

    const zonesRef = useRef<TouchableOpacity>(null);
    useImperativeHandle(ref, () => ({
      zonesRef,
    }));

    // Can select zone if there is no whitelisted zones, or there is more than 1 whitelisted zone
    const canSelectZone =
      preassignedFareProduct.limitations.tariffZoneRefs?.length !== 1;

    const accessibility: AccessibilityProps = {
      accessible: true,
      accessibilityRole: canSelectZone ? 'button' : 'none',
      accessibilityLabel: canSelectZone
        ? a11yLabel(fromTariffZone, toTariffZone, language, t) +
          screenReaderPause
        : t(
            PurchaseOverviewTexts.zones.zoneName(
              getReferenceDataName(fromTariffZone, language),
            ),
          ),
      accessibilityHint: canSelectZone
        ? t(PurchaseOverviewTexts.zones.a11yHint)
        : undefined,
    };

    const displayAsOneZone =
      fromTariffZone.id === toTariffZone.id &&
      fromTariffZone.venueName === toTariffZone.venueName;

    const content = (
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
        {canSelectZone && <ThemeIcon svg={Edit} size="medium" />}
      </View>
    );

    return (
      <View style={style}>
        <ContentHeading
          text={t(
            PurchaseOverviewTexts.zones.title[
              canSelectZone ? selectionMode : 'none'
            ].text,
          )}
          accessibilityLabel={t(
            PurchaseOverviewTexts.zones.title[
              canSelectZone ? selectionMode : 'none'
            ].a11yLabel,
          )}
        />
        <Section {...accessibility}>
          {canSelectZone ? (
            <GenericClickableSectionItem
              ref={zonesRef}
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
              {content}
            </GenericClickableSectionItem>
          ) : (
            <GenericSectionItem>{content}</GenericSectionItem>
          )}
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
    <ThemeText style={{flexShrink: 1}} testID="selectedStationAndZone">
      <ThemeText type="body__primary--bold" testID="selectedStation">
        {tariffZone.venueName + ' '}
      </ThemeText>
      ({zoneLabel})
    </ThemeText>
  ) : (
    <ThemeText type="body__primary--bold" testID="selectedZone">
      {zoneLabel}
    </ThemeText>
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
    paddingTop: theme.spacing.xSmall,
  },
  sectionText: {
    marginBottom: theme.spacing.medium,
  },
  fromZone: {
    flexDirection: 'row',
  },
  toZone: {
    flexDirection: 'row',
    marginTop: theme.spacing.small,
  },
  toFromLabel: {
    minWidth: 40,
    marginRight: theme.spacing.small,
  },
  sectionContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
