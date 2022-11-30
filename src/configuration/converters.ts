import {
  FareProductTypeConfigSettings,
  FareProductTypeConfig,
  OfferEndpoint,
  ProductSelectionMode,
  TimeSelectionMode,
  TravellerSelectionMode,
  ZoneSelectionMode,
  FareProductType,
} from '@atb/screens/Ticketing/FareContracts/utils';
import {LanguageAndTextType} from '@atb/translations/types';
import {isArray} from 'lodash';

export function mapToFareProductTypeConfigs(
  config: any,
): FareProductTypeConfig[] | undefined {
  if (!isArray(config)) return;

  return config
    .map((val) => mapToFareProductTypeConfig(val))
    .filter(Boolean) as FareProductTypeConfig[];
}

function mapToFareProductTypeConfig(
  config: any,
): FareProductTypeConfig | undefined {
  const fields = [
    'type',
    'name',
    'transportModes',
    'description',
    'configuration',
  ];
  if (!fields.every((f) => f in config)) return;

  if (!isArray(config.name) || !isArray(config.description)) return;

  let name = mapLanguageAndTextType(config.name);
  let description = mapLanguageAndTextType(config.description);

  if (!name || !description) return;

  const fcType = mapToStringAlternatives<FareProductType>(config.type, [
    'single',
    'period',
    'hour24',
    'night',
  ]);
  if (!fcType) return;

  const configuration = mapToFareProductConfigSettings(config.configuration);
  if (!configuration) return;

  return {
    type: fcType,
    name,
    description,
    transportModes: config.transportModes,
    configuration,
  };
}

function mapToFareProductConfigSettings(
  settings: any,
): FareProductTypeConfigSettings | undefined {
  const zoneSelectionMode = mapToStringAlternatives<ZoneSelectionMode>(
    settings.zoneSelectionMode,
    ['single', 'multiple', 'none'],
  );
  const travellerSelectionMode =
    mapToStringAlternatives<TravellerSelectionMode>(
      settings.travellerSelectionMode,
      ['multiple', 'single', 'none'],
    );
  const timeSelectionMode = mapToStringAlternatives<TimeSelectionMode>(
    settings.timeSelectionMode,
    ['datetime', 'none'],
  );
  const productSelectionMode = mapToStringAlternatives<ProductSelectionMode>(
    settings.productSelectionMode,
    ['duration', 'product', 'none'],
  );
  const offerEndpoint = mapToStringAlternatives<OfferEndpoint>(
    settings.offerEndpoint,
    ['zones', 'authority'],
  );

  if (
    !(
      zoneSelectionMode &&
      travellerSelectionMode &&
      timeSelectionMode &&
      productSelectionMode &&
      offerEndpoint
    )
  ) {
    return;
  }

  return {
    zoneSelectionMode,
    travellerSelectionMode,
    timeSelectionMode,
    productSelectionMode,
    offerEndpoint,
  } as FareProductTypeConfigSettings;
}

function mapToStringAlternatives<T>(value: any, alternatives: string[]) {
  if (typeof value !== 'string') return;
  if (!alternatives.includes(value)) return;
  return value as T;
}

function mapLanguageAndTextType(text: any[]) {
  if (!text.every((item: any) => ['lang', 'value'].every((f) => f in item)))
    return;

  return text as LanguageAndTextType[];
}
