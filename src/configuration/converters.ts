import {
  FareProductTypeConfig,
  FlexibleTransportOptionType,
  TransportModeFilterOptionType,
} from '@atb-as/config-specs';
import {LanguageAndTextType} from '@atb/translations/types';
import Bugsnag from '@bugsnag/react-native';
import {isArray} from 'lodash';
import {isDefined} from '@atb/utils/presence';
import {MobilityOperator} from '@atb-as/config-specs/lib/mobility-operators';
import {FareProductGroup, FareProductGroupType} from '@atb/configuration/types';

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
    // Reject configuration that does not match the current Zod schema.
    // Can happen when products are added later which the current version
    // of the app doesn't know how to handle. This is normal and expected.
    return;
  }
  return typeConfigPotential.data;
}

export function mapToFareProductGroups(
  config: any,
): FareProductGroupType[] | undefined {
  if (!isArray(config)) {
    Bugsnag.notify(`fare product groups should be of type "array"`);
    return;
  }

  return config
    .map((val) => mapToFareProductGroup(val))
    .filter(Boolean) as FareProductGroupType[];
}

function mapToFareProductGroup(config: any): FareProductGroupType | undefined {
  const parseResult = FareProductGroup.safeParse(config);

  if (!parseResult.success) {
    return;
  }
  return parseResult.data;
}

export const mapToFlexibleTransportOption = (
  filter: any,
): FlexibleTransportOptionType | undefined => {
  const safeParseReturnObject =
    filter && FlexibleTransportOptionType.safeParse(filter);

  if (!safeParseReturnObject) {
    return undefined;
  }

  if (!safeParseReturnObject.success) {
    return undefined;
  }

  return safeParseReturnObject.data;
};

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
  const typeConfigPotential = TransportModeFilterOptionType.safeParse(filter);

  if (!typeConfigPotential.success) {
    return;
  }
  return typeConfigPotential.data;
};

export function mapLanguageAndTextType(text?: any) {
  if (!text) return;
  if (!text.every((item: any) => ['lang', 'value'].every((f) => f in item)))
    return;

  return text as LanguageAndTextType[];
}

export function mapToMobilityOperators(operators?: any) {
  if (!operators) return;
  if (!Array.isArray(operators)) return;
  return operators
    .map((operator) => {
      const parseResult = MobilityOperator.safeParse(operator);
      if (!parseResult.success) {
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}
