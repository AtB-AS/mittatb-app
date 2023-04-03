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
import {getReferenceDataName} from '@atb/reference-data/utils';
import {
  TariffZoneSelection,
  TariffZoneWithMetadata,
} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {TariffZonesSelectorButtonsProps} from '@atb/tariff-zones-selector/navigation-types';

const TariffZonesSelectorButtons = ({
  toTariffZone,
  fromTariffZone,
  onVenueSearchClick,
  isApplicableOnSingleZoneOnly,
}: TariffZonesSelectorButtonsProps) => {
  const selectedZones: TariffZoneSelection = {
    from: fromTariffZone,
    to: toTariffZone,
    selectNext: isApplicableOnSingleZoneOnly ? 'from' : 'to',
  };

  const {t, language} = useTranslation();

  return (
    <Section withPadding>
      <ButtonSectionItem
        label={
          isApplicableOnSingleZoneOnly
            ? t(TariffZonesTexts.location.singleZone.label)
            : t(TariffZonesTexts.location.zonePicker.labelFrom)
        }
        value={departurePickerValue(selectedZones.from, language, t)}
        accessibilityLabel={departurePickerAccessibilityLabel(
          selectedZones.from,
          language,
          t,
        )}
        accessibilityHint={t(TariffZonesTexts.location.zonePicker.a11yHintFrom)}
        onPress={() => onVenueSearchClick('fromTariffZone')}
        icon={
          selectedZones.from.resultType === 'geolocation' ? (
            <ThemeIcon svg={Location} />
          ) : undefined
        }
        highlighted={selectedZones.selectNext === 'from'}
        testID="searchFromButton"
      />
      {!isApplicableOnSingleZoneOnly && (
        <ButtonSectionItem
          label={t(TariffZonesTexts.location.zonePicker.labelTo)}
          value={destinationPickerValue(
            selectedZones.from,
            selectedZones.to,
            language,
            t,
          )}
          accessibilityLabel={destinationPickerAccessibilityLabel(
            selectedZones.to,
            language,
            t,
          )}
          accessibilityHint={t(TariffZonesTexts.location.zonePicker.a11yHintTo)}
          onPress={() => onVenueSearchClick('toTariffZone')}
          icon={
            selectedZones.to.resultType === 'geolocation' ? (
              <ThemeIcon svg={Location} />
            ) : undefined
          }
          highlighted={selectedZones.selectNext === 'to'}
          testID="searchToButton"
        />
      )}
    </Section>
  );
};

const departurePickerAccessibilityLabel = (
  fromTariffZone: TariffZoneWithMetadata,
  language: Language,
  t: TranslateFunction,
): string => {
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
  toTariffZone: TariffZoneWithMetadata,
  language: Language,
  t: TranslateFunction,
): string => {
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
  fromTariffZone: TariffZoneWithMetadata,
  language: Language,
  t: TranslateFunction,
): string => {
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
  fromTariffZone: TariffZoneWithMetadata,
  toTariffZone: TariffZoneWithMetadata,
  language: Language,
  t: TranslateFunction,
): string => {
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
