import {screenReaderPause, ThemeText} from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {StyleSheet} from '@atb/theme';
import {
  PurchaseOverviewTexts,
  TariffZonesTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  tariffZonesDescription,
  tariffZonesSummary,
  TariffZoneWithMetadata,
} from '../../Root_PurchaseTariffZonesSearchByMapScreen';

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
  const itemStyle = useStyles();
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
        style={itemStyle.sectionText}
        accessibilityLabel={t(
          PurchaseOverviewTexts.zones.label[selectionMode].a11yLabel,
        )}
      >
        {t(PurchaseOverviewTexts.zones.label[selectionMode].text)}
      </ThemeText>
      <Sections.Section {...accessibility}>
        <Sections.ButtonSectionItem
          label={t(TariffZonesTexts.zoneTitle)}
          value={tariffZonesDescription(
            fromTariffZone,
            toTariffZone,
            language,
            t,
          )}
          highlighted={true}
          inlineValue={false}
          onPress={() => {
            onSelect({
              fromTariffZone,
              toTariffZone,
              fareProductTypeConfig,
            });
          }}
          testID="selectZonesButton"
        />
      </Sections.Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  subtitleStyle: {
    paddingTop: theme.spacings.xSmall,
  },
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
}));
