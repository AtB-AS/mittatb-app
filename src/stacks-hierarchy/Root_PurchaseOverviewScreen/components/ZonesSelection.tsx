import {screenReaderPause, ThemeText} from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  tariffZonesSummary,
  TariffZoneWithMetadata,
} from '../../Root_PurchaseTariffZonesSearchByMapScreen';
import {getReferenceDataName} from '@atb/reference-data/utils';

type ZonesSelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  onSelect: (t: {
    fromTariffZone: TariffZoneWithMetadata;
    toTariffZone: TariffZoneWithMetadata;
    fareProductTypeConfig: FareProductTypeConfig;
  }) => void;
  style?: StyleProp<ViewStyle>;
};

export default function ZonesSelection({
  fareProductTypeConfig,
  fromTariffZone,
  toTariffZone,
  onSelect,
  style,
}: ZonesSelectionProps) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel:
      tariffZonesSummary(fromTariffZone, toTariffZone, language, t) +
      screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.tariffZones.a11yHint),
  };

  const selectionMode = fareProductTypeConfig.configuration.zoneSelectionMode;

  if (selectionMode === 'none') {
    return <></>;
  }

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
      <Sections.Section {...accessibility}>
        <Sections.GenericClickableSectionItem
          onPress={() =>
            onSelect({
              fromTariffZone,
              toTariffZone,
              fareProductTypeConfig,
            })
          }
          testID="selectZonesButton"
        >
          {selectionMode === 'single' ? (
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
        </Sections.GenericClickableSectionItem>
      </Sections.Section>
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
    minWidth: 36,
    marginRight: theme.spacings.small,
  },
}));
