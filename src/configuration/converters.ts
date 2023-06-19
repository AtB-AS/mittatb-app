import {
  FareProductTypeConfig,
  FlexibleTransportOptionType,
} from '@atb-as/config-specs';
import {TransportModeFilterOptionType} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {LanguageAndTextType} from '@atb/translations/types';
import Bugsnag from '@bugsnag/react-native';
import {isArray} from 'lodash';
import {isDefined} from '@atb/utils/presence';
import {MobilityOperator} from '@atb-as/config-specs/lib/mobility-operators';

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

export const mapToFlexibleTransportOption = (
  filter: any,
): FlexibleTransportOptionType | undefined => {
  const safeParseReturnObject =
    filter && FlexibleTransportOptionType.safeParse(filter);

  if (!safeParseReturnObject) {
    return undefined;
  }

  if (!safeParseReturnObject.success) {
    Bugsnag.notify('flexible transport filter mapping issue', function (event) {
      event.addMetadata('decode_errors', {
        issues: safeParseReturnObject.error.issues,
      });
    });

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
    Bugsnag.notify('transport mode filter mapping issue', function (event) {
      event.addMetadata('decode_errors', {
        issues: typeConfigPotential.error.issues,
      });
    });
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
        Bugsnag.notify('Mobility operator mapping issue', function (event) {
          event.addMetadata('decode_errors', {
            issues: parseResult.error.issues,
          });
        });
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}
