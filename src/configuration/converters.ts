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
import type {
  TransportIconModeType,
  TransportModeFilterOptionType,
} from '@atb/screens/Dashboard/types';
import {
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {enumFromString} from '@atb/utils/enum-from-string';

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

export const mapToTransportModeFilterOptions = (
  filters: any,
): TransportModeFilterOptionType[] | undefined => {
  if (!isArray(filters)) {
    Bugsnag.notify(`Transport mode filters should be of type "array"`);
    return;
  }

  return filters
    .map(mapToTransportModeFilterOption)
    .filter((f): f is TransportModeFilterOptionType => !!f?.modes);
};

const mapToTransportModeFilterOption = (
  filter: any,
): TransportModeFilterOptionType | undefined => {
  const fields = ['id', 'text', 'icon', 'modes'];
  if (!fields.every((f) => f in filter)) {
    Bugsnag.notify(
      `Transport mode filter is missing one or more of the following mandatory fields: ${fields}`,
    );
    return;
  }

  const text = mapLanguageAndTextType(filter.text);
  const description = mapLanguageAndTextType(filter.description);

  if (!text) {
    Bugsnag.notify(
      `Transport mode filter with id: "${filter.id}", "text": "LanguageAndTextType"`,
    );
    return;
  }

  const icon = mapIconMode(filter.icon);

  if (!icon) {
    Bugsnag.notify(
      `Transport mode filter with id: "${
        filter.id
      }", Unknown icon config "${JSON.stringify(filter.icon)}"`,
    );
    return;
  }

  const modes = filter.modes.map(mapToTransportModes);
  if (modes.includes(undefined)) {
    // Already notified Bugsnag in mapping function
    return;
  }

  return {
    ...filter,
    icon,
    text,
    description,
    modes: modes as TransportModes[],
  };
};

const mapIconMode = (raw: any): TransportIconModeType | undefined => {
  if (!raw) return undefined;
  const mappedMode = enumFromString(TransportMode, raw.transportMode);
  if (!mappedMode) return undefined;
  const mappedSubMode = enumFromString(TransportSubmode, raw.transportSubMode);
  return {
    transportMode: mappedMode,
    transportSubMode: mappedSubMode,
  };
};

const mapToTransportModes = (raw: any): TransportModes | undefined => {
  const mappedMode = enumFromString(TransportMode, raw.transportMode);
  if (!mappedMode) {
    Bugsnag.notify('Unknown transport mode: ' + raw.transportMode);
    return undefined;
  }
  const newSubModes = raw.transportSubModes?.map((sm: any) => {
    const mappedSubMode = enumFromString(TransportSubmode, sm);
    if (!mappedSubMode) {
      Bugsnag.notify('Unknown transport mode: ' + raw.transportMode);
      return undefined;
    }
    return mappedSubMode;
  });

  if (newSubModes && newSubModes.includes(undefined)) {
    return undefined;
  }

  return {
    transportMode: mappedMode,
    transportSubModes: newSubModes as TransportSubmode[],
  };
};

function mapToStringAlternatives<T>(value: any, alternatives: string[]) {
  if (typeof value !== 'string') return;
  if (!alternatives.includes(value)) return;
  return value as T;
}

function mapLanguageAndTextType(text?: any[]) {
  if (!text) return;
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
