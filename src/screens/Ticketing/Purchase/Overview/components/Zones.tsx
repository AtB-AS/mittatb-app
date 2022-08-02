import React from 'react';
import {View, AccessibilityProps, StyleProp, ViewStyle} from 'react-native';
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
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
type ZonesProps = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  style?: StyleProp<ViewStyle>;
  isApplicableOnSingleZoneOnly?: boolean;
};

export default function Zones({
  fromTariffZone,
  toTariffZone,
  style,
  isApplicableOnSingleZoneOnly,
}: ZonesProps) {
  const itemStyle = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<OverviewNavigationProp>();
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
          PurchaseOverviewTexts.zones.label[
            isApplicableOnSingleZoneOnly ? 'singleZone' : 'multipleZone'
          ].a11yLabel,
        )}
      >
        {t(
          PurchaseOverviewTexts.zones.label[
            isApplicableOnSingleZoneOnly ? 'singleZone' : 'multipleZone'
          ].text,
        )}
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
              isApplicableOnSingleZoneOnly: isApplicableOnSingleZoneOnly,
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
