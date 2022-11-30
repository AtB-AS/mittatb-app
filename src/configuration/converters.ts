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
import Bugsnag from '@bugsnag/react-native';
import {isArray} from 'lodash';

export function mapToFareProductTypeConfigs(
  config: any,
): FareProductTypeConfig[] | undefined {
  if (!isArray(config)) {
    Bugsnag.notify(`fare product configurations should be of type "array"`);
    return;
  }

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
  if (!fields.every((f) => f in config)) {
    Bugsnag.notify(
      `fare product is missing one or more of the following fields: ${fields}`,
    );
    return;
  }

  const fcTypes = ['single', 'period', 'hour24', 'night', 'carnet'];
  const fcType = mapToStringAlternatives<FareProductType>(config.type, fcTypes);
  if (!fcType) {
    notifyWrongConfigurationType(config.type, 'type', fcTypes);
    return;
  }

  if (!isArray(config.name) || !isArray(config.description)) {
    Bugsnag.notify(
      `fare product type: "${fcType}", fields "name" or "description" should be defined as an "array".`,
    );
    return;
  }

  let name = mapLanguageAndTextType(config.name);
  let description = mapLanguageAndTextType(config.description);

  if (!name || !description) {
    Bugsnag.notify(
      `fare product type: "${fcType}", "name" or "description" should conform: "LanguageAndTextType"`,
    );
    return;
  }

  if (!isArray(config.transportModes)) {
    Bugsnag.notify(
      `fare product type: "${fcType}", "transportModes" should be of type "array"`,
    );
    return;
  }
  if (!config.transportModes.every((value: any) => typeof value === 'string')) {
    Bugsnag.notify(
      `fare product type: "${fcType}", one or more of the "transportModes" values is not of type "string"`,
    );
    return;
  }

  const configuration = mapToFareProductConfigSettings(
    fcType,
    config.configuration,
  );
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
  fareProductType: FareProductType,
  settings: any,
): FareProductTypeConfigSettings | undefined {
  const zoneSelectionModeTypes = ['single', 'multiple', 'none'];
  const zoneSelectionMode = mapToStringAlternatives<ZoneSelectionMode>(
    settings.zoneSelectionMode,
    zoneSelectionModeTypes,
  );
  if (!zoneSelectionMode) {
    notifyWrongConfigurationType(
      fareProductType,
      'zoneSelectionMode',
      zoneSelectionModeTypes,
    );
    return;
  }

  const travellerSelectionModeTypes = ['multiple', 'single', 'none'];
  const travellerSelectionMode =
    mapToStringAlternatives<TravellerSelectionMode>(
      settings.travellerSelectionMode,
      travellerSelectionModeTypes,
    );
  if (!travellerSelectionMode) {
    notifyWrongConfigurationType(
      fareProductType,
      'travellerSelectionMode',
      travellerSelectionModeTypes,
    );
    return;
  }

  const timeSelectionModeTypes = ['datetime', 'none'];
  const timeSelectionMode = mapToStringAlternatives<TimeSelectionMode>(
    settings.timeSelectionMode,
    timeSelectionModeTypes,
  );
  if (!timeSelectionMode) {
    notifyWrongConfigurationType(
      fareProductType,
      'timeSelectionMode',
      timeSelectionModeTypes,
    );
    return;
  }

  const productSelectionModeTypes = ['duration', 'product', 'none'];
  const productSelectionMode = mapToStringAlternatives<ProductSelectionMode>(
    settings.productSelectionMode,
    productSelectionModeTypes,
  );
  if (!productSelectionMode) {
    notifyWrongConfigurationType(
      fareProductType,
      'productSelectionMode',
      productSelectionModeTypes,
    );
    return;
  }

  const offerEndpointTypes = ['zones', 'authority'];
  const offerEndpoint = mapToStringAlternatives<OfferEndpoint>(
    settings.offerEndpoint,
    offerEndpointTypes,
  );
  if (!offerEndpoint) {
    notifyWrongConfigurationType(
      fareProductType,
      'offerEndpoint',
      offerEndpointTypes,
    );
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

function notifyWrongConfigurationType(
  fareProductType: string,
  field: string,
  types: string[],
) {
  Bugsnag.notify(
    `fare product of type: "${fareProductType}", the "${field}" field, does not belong to any of the following types: "${types}"`,
  );
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
