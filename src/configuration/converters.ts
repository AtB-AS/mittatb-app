import {
  FareProductTypeConfigSettings,
  FareProductTypeConfig,
  OfferEndpoint,
  ProductSelectionMode,
  TimeSelectionMode,
  TravellerSelectionMode,
  ZoneSelectionMode,
  FareProductType,
  FareProductTypeAvailability,
  FareProductTypeTimeRange,
} from '@atb/screens/Ticketing/FareContracts/utils';
import {LanguageAndTextType} from '@atb/translations/types';
import Bugsnag from '@bugsnag/react-native';
import {isArray} from 'lodash';
import {TransportModeType} from '@atb/configuration/types';
import firestore from '@react-native-firebase/firestore';

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
    return;
  }

  if (!isArray(config.name) || !isArray(config.description)) {
    Bugsnag.notify(
      `fare product of type: "${fcType}", fields "name" or "description" should be defined as an "array".`,
    );
    return;
  }

  let name = mapLanguageAndTextType(config.name);
  let description = mapLanguageAndTextType(config.description);

  if (!name || !description) {
    Bugsnag.notify(
      `fare product of type: "${fcType}", "name" or "description" should conform: "LanguageAndTextType"`,
    );
    return;
  }

  if (!isArray(config.transportModes)) {
    Bugsnag.notify(
      `fare product of type: "${fcType}", "transportModes" should be of type "array"`,
    );
    return;
  }

  const transportModes = mapTransportModeTypes(config.transportModes);

  if (!transportModes) {
    Bugsnag.notify(
      `fare product of type: "${fcType}", "transportModes" should conform: "TransportModeType"`,
    );
    return;
  }

  const configuration = mapToFareProductConfigSettings(
    fcType,
    config.configuration,
  );
  if (!configuration) return;

  // Optional!
  const availability = mapToAvailability(fcType, config);

  return {
    type: fcType,
    name,
    description,
    transportModes,
    configuration,
    availability,
  };
}

function mapToAvailability(
  fareProductType: FareProductType,
  config: any,
): FareProductTypeAvailability | undefined {
  const availabilityField = 'availability';
  if (!(availabilityField in config)) {
    return;
  }

  const availability = config.availability;
  const fields = ['alwaysEnableAt', 'enabledAt', 'disableAt'];
  if (!fields.every((f) => f in availability)) {
    Bugsnag.notify(
      `attribute "${availabilityField}" for fare product "${fareProductType}" is missing one or more of the following fields: ${fields.join(
        ',',
      )}`,
    );
    return;
  }

  if (!fields.every((f) => isArray(availability[f]))) {
    Bugsnag.notify(
      `attribute "${availabilityField}" for fare product "${fareProductType}", fields: ${fields.join(
        ',',
      )} should be of type "array"`,
    );
    return;
  }

  const timeFields = ['from', 'to'];
  if (
    !fields.every((f) =>
      availability[f].every((item: any) =>
        timeFields.every((tf) => tf in item),
      ),
    )
  ) {
    Bugsnag.notify(
      `attribute "${availabilityField}" for fare product "${fareProductType}", one or more of the following fields: ${timeFields.join(
        ',',
      )} in ${fields.join(',')} are missing`,
    );
    return;
  }

  const timestampFields = ['seconds', 'nanoseconds'];
  if (
    !fields.every((f) =>
      availability[f].every((item: any) =>
        timeFields.every((tf) =>
          timestampFields.every((tsf) => tsf in item[tf]),
        ),
      ),
    )
  ) {
    Bugsnag.notify(
      `attribute "${availabilityField}" for fare product "${fareProductType}", one or more of the following fields: ${timeFields.join(
        ',',
      )} in ${fields.join(',')} should be of type "Timestamp"`,
    );
    return;
  }

  return {
    alwaysEnableAt: mapToTimestamp(config.availability.alwaysEnableAt),
    enabledAt: mapToTimestamp(config.availability.enabledAt),
    disableAt: mapToTimestamp(config.availability.disableAt),
  } as FareProductTypeAvailability;
}

function mapToTimestamp(items: any[]) {
  return items.map(
    (item: any) =>
      ({
        from: new firestore.Timestamp(item.from.seconds, item.from.nanoseconds),
        to: new firestore.Timestamp(item.to.seconds, item.to.nanoseconds),
      } as FareProductTypeTimeRange),
  );
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

  const requiresLogin = settings.requiresLogin;
  if (requiresLogin === undefined) {
    Bugsnag.notify(
      `fare product of type: "${fareProductType}" is missing 'requiresLogin' in configuration`,
    );
    return;
  }

  return {
    zoneSelectionMode,
    travellerSelectionMode,
    timeSelectionMode,
    productSelectionMode,
    offerEndpoint,
    requiresLogin,
  };
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

function mapTransportModeTypes(transportModes: any[]) {
  if (
    !transportModes.every(
      (item: any) =>
        typeof item === 'object' &&
        'mode' in item &&
        typeof item.mode === 'string',
    )
  )
    return;

  return transportModes as TransportModeType[];
}
