import {FareProductTypeConfig} from '@atb-as/config-specs';
import {TravelSearchTransport} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
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
): TravelSearchTransport[] | undefined => {
  if (!isArray(filters)) {
    Bugsnag.notify(`Transport mode filters should be of type "array"`);
    return;
  }

  return filters
    .map(mapToTransportModeFilterOption)
    .filter((f): f is TravelSearchTransport => !!f?.modes);
};

const mapToTransportModeFilterOption = (
  filter: any,
): TravelSearchTransport | undefined => {
  const typeConfigPotential = TravelSearchTransport.safeParse(filter);

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
