import {FareProductTypeConfig} from '@atb-as/config-specs';
import {
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import type {
  TransportIconModeType,
  TransportModeFilterOptionType,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {LanguageAndTextType} from '@atb/translations/types';
import {enumFromString} from '@atb/utils/enum-from-string';
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
  const typeConfigPotential = FareProductTypeConfig.safeParse(config);

  if (!typeConfigPotential.success) {
    Bugsnag.notify('fare product mapping issue', function (event) {
      event.addMetadata('decode_errors', {
        issues: typeConfigPotential.error.issues,
      });
    });
    return;
  }
  return typeConfigPotential.data;
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

export function mapLanguageAndTextType(text?: any) {
  if (!text) return;
  if (!text.every((item: any) => ['lang', 'value'].every((f) => f in item)))
    return;

  return text as LanguageAndTextType[];
}
