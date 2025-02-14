import {ButtonSectionItem, Section} from '@atb/components/sections';
import {
  Language,
  TariffZonesTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Location} from '@atb/assets/svg/mono-icons/places';
import React from 'react';
import {getReferenceDataName} from '@atb/configuration';
import {TariffZoneWithMetadata} from './types';
import {ViewStyle} from 'react-native';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

type Props = {
  selection: PurchaseSelectionType;
  selectNext: 'from' | 'to';
  isApplicableOnSingleZoneOnly: boolean;
  onVenueSearchClick: (fromOrTo: 'from' | 'to') => void;
  style?: ViewStyle;
};

const TariffZonesSelectorButtons = ({
  selection,
  selectNext,
  onVenueSearchClick,
  isApplicableOnSingleZoneOnly,
  style,
}: Props) => {
  const {t, language} = useTranslation();

  return (
    <Section style={style}>
      <ButtonSectionItem
        label={
          isApplicableOnSingleZoneOnly
            ? t(TariffZonesTexts.location.singleZone.label)
            : t(TariffZonesTexts.location.zonePicker.labelFrom)
        }
        value={departurePickerValue(selection.zones?.from, language, t)}
        accessibilityLabel={departurePickerAccessibilityLabel(
          selection.zones?.from,
          language,
          t,
        )}
        accessibilityHint={t(TariffZonesTexts.location.zonePicker.a11yHintFrom)}
        onPress={() => onVenueSearchClick('from')}
        icon={
          selection.zones?.from.resultType === 'geolocation' ? (
            <ThemeIcon svg={Location} />
          ) : undefined
        }
        highlighted={selectNext === 'from'}
        testID="searchFromButton"
      />
      {!isApplicableOnSingleZoneOnly && (
        <ButtonSectionItem
          label={t(TariffZonesTexts.location.zonePicker.labelTo)}
          value={destinationPickerValue(selection.zones?.to, language, t)}
          accessibilityLabel={destinationPickerAccessibilityLabel(
            selection.zones?.to,
            language,
            t,
          )}
          accessibilityHint={t(TariffZonesTexts.location.zonePicker.a11yHintTo)}
          onPress={() => onVenueSearchClick('to')}
          icon={
            selection.zones?.to.resultType === 'geolocation' ? (
              <ThemeIcon svg={Location} />
            ) : undefined
          }
          highlighted={selectNext === 'to'}
          testID="searchToButton"
        />
      )}
    </Section>
  );
};

const departurePickerAccessibilityLabel = (
  fromTariffZone: TariffZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!fromTariffZone) return undefined;
  if (fromTariffZone.venueName)
    return t(
      TariffZonesTexts.location.zonePicker.a11yLabelFrom.withVenue(
        getReferenceDataName(fromTariffZone, language),
        fromTariffZone.venueName,
      ),
    );
  else {
    return t(
      TariffZonesTexts.location.zonePicker.a11yLabelFrom.noVenue(
        getReferenceDataName(fromTariffZone, language),
      ),
    );
  }
};

const destinationPickerAccessibilityLabel = (
  toTariffZone: TariffZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!toTariffZone) return undefined;
  if (toTariffZone.venueName)
    return t(
      TariffZonesTexts.location.zonePicker.a11yLabelTo.withVenue(
        getReferenceDataName(toTariffZone, language),
        toTariffZone.venueName,
      ),
    );
  else {
    return t(
      TariffZonesTexts.location.zonePicker.a11yLabelTo.noVenue(
        getReferenceDataName(toTariffZone, language),
      ),
    );
  }
};

const departurePickerValue = (
  fromTariffZone: TariffZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!fromTariffZone) return undefined;
  if (fromTariffZone.venueName)
    return t(
      TariffZonesTexts.location.zonePicker.value.withVenue(
        getReferenceDataName(fromTariffZone, language),
        fromTariffZone.venueName,
      ),
    );
  else {
    return t(
      TariffZonesTexts.location.zonePicker.value.noVenue(
        getReferenceDataName(fromTariffZone, language),
      ),
    );
  }
};

const destinationPickerValue = (
  toTariffZone: TariffZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!toTariffZone) return undefined;
  if (toTariffZone.venueName) {
    return t(
      TariffZonesTexts.location.zonePicker.value.withVenue(
        getReferenceDataName(toTariffZone, language),
        toTariffZone.venueName,
      ),
    );
  } else {
    return t(
      TariffZonesTexts.location.zonePicker.value.noVenue(
        getReferenceDataName(toTariffZone, language),
      ),
    );
  }
};

export {TariffZonesSelectorButtons};
