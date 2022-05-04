import React from 'react';
import {View, AccessibilityProps} from 'react-native';
import ThemeText from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {OverviewNavigationProp} from '@atb/screens/Ticketing/Purchase/Overview';
import {screenReaderPause} from '@atb/components/accessible-text';
import {
  tariffZonesSummary,
  tariffZonesTitle,
  tariffZonesDescription,
  TariffZoneWithMetadata,
} from '../../TariffZones';
import {
  PurchaseOverviewTexts,
  TariffZonesTexts,
  useTranslation,
} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
export type ZoneItemProps = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
};

export default function ZoneItem({
  fromTariffZone,
  toTariffZone,
}: ZoneItemProps) {
  const itemStyle = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<OverviewNavigationProp>();
  const accessibility: AccessibilityProps = {
    accessibilityRole: 'button',
    accessibilityLabel:
      tariffZonesSummary(fromTariffZone, toTariffZone, language, t) +
      screenReaderPause,
    accessibilityHint: t(PurchaseOverviewTexts.tariffZones.a11yHint),
  };

  return (
    <View style={itemStyle.container}>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={itemStyle.sectionText}
      >
        {t(TariffZonesTexts.header.title)}
      </ThemeText>
      <Sections.Section {...accessibility}>
        <Sections.ButtonInput
          label={tariffZonesTitle(fromTariffZone, toTariffZone, language, t)}
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
            });
          }}
          testID="selectZonesButton"
        />
      </Sections.Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacings.medium,
  },
  subtitleStyle: {
    paddingTop: theme.spacings.xSmall,
  },
  sectionText: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
  },
}));
