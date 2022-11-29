import {
  FareProductTypeConfigSettings,
  FareProductTypeConfig,
  OfferEndpoint,
  ProductSelectionMode,
  TimeSelectionMode,
  TravellerSelectionMode,
  ZoneSelectionMode,
} from '@atb/screens/Ticketing/FareContracts/utils';
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

  const fcType = mapToStringAlternatives<OfferEndpoint>(config.type, [
    'single',
    'period',
    'hour24',
    'night',
  ]);
  if (!fcType) return;

  const configuration = mapToFareProductConfigSettings(config.configuration);

  if (!configuration) return;
  if (typeof config.description !== 'string') return;

  return {
    type: config.type,
    name: config.name,
    transportModes: config.transportModes,
    description: config.description,
    configuration: configuration,
  };
}

function mapToFareProductConfigSettings(
  settings: any,
): FareProductTypeConfigSettings | undefined {
  const zoneSelectionMode = mapToStringAlternatives<ZoneSelectionMode>(
    settings.zoneSelectionMode,
    ['single', 'two', 'none'],
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
    ['duration', 'product', 'none'],
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
