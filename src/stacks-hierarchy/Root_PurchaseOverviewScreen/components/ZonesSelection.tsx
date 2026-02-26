import {screenReaderPause, ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {FareZoneWithMetadata} from '@atb/fare-zones-selector';
import {
  GenericClickableSectionItem,
  GenericSectionItem,
  Section,
} from '@atb/components/sections';
import {getReferenceDataName} from '@atb/modules/configuration';

import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FocusRefsType} from '@atb/utils/use-focus-refs';
import {ContentHeading} from '@atb/components/heading';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {NativeButton} from '@atb/components/native-button';

type ZonesSelectionProps = {
  selection: PurchaseSelectionType;
  selectionMode: 'single' | 'multiple';
  onSelect: (selection: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export const ZonesSelection = forwardRef<FocusRefsType, ZonesSelectionProps>(
  ({selection, selectionMode, onSelect, style}: ZonesSelectionProps, ref) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    const zonesRef = useRef<typeof NativeButton>(null);
    useImperativeHandle(ref, () => ({
      zonesRef: zonesRef as any,
    }));

    if (!selection.zones) return null;

    const fromFareZone = selection.zones.from;
    const toFareZone = selection.zones.to;

    // Can select zone if there is no whitelisted zones, or there is more than 1 whitelisted zone
    const canSelectZone =
      selection.preassignedFareProduct.limitations.fareZoneRefs?.length !== 1;

    const accessibility: AccessibilityProps = {
      accessible: true,
      accessibilityRole: canSelectZone ? 'button' : 'none',
      accessibilityLabel: canSelectZone
        ? a11yLabel(fromFareZone, toFareZone, language, t) + screenReaderPause
        : t(
            PurchaseOverviewTexts.zones.zoneName(
              getReferenceDataName(fromFareZone, language),
            ),
          ),
      accessibilityHint: canSelectZone
        ? t(PurchaseOverviewTexts.zones.a11yHint)
        : undefined,
    };

    const displayAsOneZone =
      fromFareZone.id === toFareZone.id &&
      fromFareZone.venueName === toFareZone.venueName;

    const content = (
      <View style={styles.sectionContentContainer}>
        <View>
          {displayAsOneZone ? (
            <ZoneLabel fareZone={fromFareZone} />
          ) : (
            <>
              <View style={styles.fromZone}>
                <ThemeText
                  color="secondary"
                  typography="body__s"
                  style={styles.toFromLabel}
                >
                  {t(PurchaseOverviewTexts.fromToLabel.from)}
                </ThemeText>
                <ZoneLabel fareZone={fromFareZone} />
              </View>
              <View style={styles.toZone}>
                <ThemeText
                  color="secondary"
                  typography="body__s"
                  style={styles.toFromLabel}
                >
                  {t(PurchaseOverviewTexts.fromToLabel.to)}
                </ThemeText>
                <ZoneLabel fareZone={toFareZone} />
              </View>
            </>
          )}
        </View>
        {canSelectZone && <ThemeIcon svg={Edit} size="normal" />}
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
              onPress={() => onSelect(selection)}
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

const ZoneLabel = ({fareZone}: {fareZone: FareZoneWithMetadata}) => {
  const {t, language} = useTranslation();
  const zoneName = getReferenceDataName(fareZone, language);
  const zoneLabel = t(PurchaseOverviewTexts.zones.zoneName(zoneName));

  return fareZone.venueName ? (
    <ThemeText style={{flexShrink: 1}} testID="selectedStationAndZone">
      <ThemeText typography="body__m__strong" testID="selectedStation">
        {fareZone.venueName + ' '}
      </ThemeText>
      ({zoneLabel})
    </ThemeText>
  ) : (
    <ThemeText typography="body__m__strong" testID="selectedZone">
      {zoneLabel}
    </ThemeText>
  );
};

const a11yLabel = (
  from: FareZoneWithMetadata,
  to: FareZoneWithMetadata,
  language: Language,
  t: TranslateFunction,
): string => {
  const displayAsOneZone = from.id === to.id && from.venueName === to.venueName;

  const getZoneText = (tz: FareZoneWithMetadata) => {
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
