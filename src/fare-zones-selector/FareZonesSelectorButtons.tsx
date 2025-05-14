import {ButtonSectionItem, Section} from '@atb/components/sections';
import {
  Language,
  FareZonesTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Location} from '@atb/assets/svg/mono-icons/places';
import React from 'react';
import {getReferenceDataName} from '@atb/modules/configuration';
import {FareZoneWithMetadata} from './types';
import {ViewStyle} from 'react-native';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

type Props = {
  selection: PurchaseSelectionType;
  selectNext: 'from' | 'to';
  isApplicableOnSingleZoneOnly: boolean;
  onVenueSearchClick: (fromOrTo: 'from' | 'to') => void;
  style?: ViewStyle;
};

const FareZonesSelectorButtons = ({
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
            ? t(FareZonesTexts.location.singleZone.label)
            : t(FareZonesTexts.location.zonePicker.labelFrom)
        }
        value={departurePickerValue(selection.zones?.from, language, t)}
        accessibilityLabel={departurePickerAccessibilityLabel(
          selection.zones?.from,
          language,
          t,
        )}
        accessibilityHint={t(FareZonesTexts.location.zonePicker.a11yHintFrom)}
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
          label={t(FareZonesTexts.location.zonePicker.labelTo)}
          value={destinationPickerValue(selection.zones?.to, language, t)}
          accessibilityLabel={destinationPickerAccessibilityLabel(
            selection.zones?.to,
            language,
            t,
          )}
          accessibilityHint={t(FareZonesTexts.location.zonePicker.a11yHintTo)}
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
  fromFareZone: FareZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!fromFareZone) return undefined;
  if (fromFareZone.venueName)
    return t(
      FareZonesTexts.location.zonePicker.a11yLabelFrom.withVenue(
        getReferenceDataName(fromFareZone, language),
        fromFareZone.venueName,
      ),
    );
  else {
    return t(
      FareZonesTexts.location.zonePicker.a11yLabelFrom.noVenue(
        getReferenceDataName(fromFareZone, language),
      ),
    );
  }
};

const destinationPickerAccessibilityLabel = (
  toFareZone: FareZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!toFareZone) return undefined;
  if (toFareZone.venueName)
    return t(
      FareZonesTexts.location.zonePicker.a11yLabelTo.withVenue(
        getReferenceDataName(toFareZone, language),
        toFareZone.venueName,
      ),
    );
  else {
    return t(
      FareZonesTexts.location.zonePicker.a11yLabelTo.noVenue(
        getReferenceDataName(toFareZone, language),
      ),
    );
  }
};

const departurePickerValue = (
  fromFareZone: FareZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!fromFareZone) return undefined;
  if (fromFareZone.venueName)
    return t(
      FareZonesTexts.location.zonePicker.value.withVenue(
        getReferenceDataName(fromFareZone, language),
        fromFareZone.venueName,
      ),
    );
  else {
    return t(
      FareZonesTexts.location.zonePicker.value.noVenue(
        getReferenceDataName(fromFareZone, language),
      ),
    );
  }
};

const destinationPickerValue = (
  toFareZone: FareZoneWithMetadata | undefined,
  language: Language,
  t: TranslateFunction,
): string | undefined => {
  if (!toFareZone) return undefined;
  if (toFareZone.venueName) {
    return t(
      FareZonesTexts.location.zonePicker.value.withVenue(
        getReferenceDataName(toFareZone, language),
        toFareZone.venueName,
      ),
    );
  } else {
    return t(
      FareZonesTexts.location.zonePicker.value.noVenue(
        getReferenceDataName(toFareZone, language),
      ),
    );
  }
};

export {FareZonesSelectorButtons};
