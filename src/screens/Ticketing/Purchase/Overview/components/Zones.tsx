import {screenReaderPause} from '@atb/components/accessible-text';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {PreassignedFareProductZoneSelectionMode} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {
  PurchaseOverviewTexts,
  TariffZonesTexts,
  useTranslation,
} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  tariffZonesDescription,
  tariffZonesSummary,
  TariffZoneWithMetadata,
} from '../../TariffZones';
import {OverviewNavigationProps} from '../types';

type ZonesProps = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  style?: StyleProp<ViewStyle>;
  selectionMode: Exclude<PreassignedFareProductZoneSelectionMode, 'none'>;
};

export default function Zones({
  fromTariffZone,
  toTariffZone,
  style,
  selectionMode,
}: ZonesProps) {
  const itemStyle = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<OverviewNavigationProps>();
  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel:
      tariffZonesSummary(fromTariffZone, toTariffZone, language, t) +
      screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.tariffZones.a11yHint),
  };

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
        <Sections.ButtonInput
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
            navigation.push('TariffZones', {
              fromTariffZone,
              toTariffZone,
              selectionMode,
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
