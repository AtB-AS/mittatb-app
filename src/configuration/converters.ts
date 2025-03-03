import {
  FareProductTypeConfig,
  FlexibleTransportOptionType,
  HarborConnectionOverride,
  TransportModeFilterOptionType,
  MobilityOperator,
  FareProductGroup,
  FareProductGroupType,
  OperatorBenefitId,
  ScooterFaq,
  BonusProduct,
  BonusTexts,
  ScooterConsentLine,
} from './types';
import {LanguageAndTextType} from '@atb/translations/types';
import Bugsnag from '@bugsnag/react-native';
import {isArray} from 'lodash';
import {isDefined} from '@atb/utils/presence';
import {
  FlexibleTransportOption,
  NotificationConfig,
  StopSignalButtonConfig,
  type StopSignalButtonConfigType,
  TransportModeFilterOption,
  TravelSearchPreference,
} from '@atb-as/config-specs';

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
    filter && FlexibleTransportOption.safeParse(filter);

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
  const typeConfigPotential = TransportModeFilterOption.safeParse(filter);

  if (!typeConfigPotential.success) {
    return;
  }
  return typeConfigPotential.data;
};

export const mapToTravelSearchPreferences = (preferences: any) => {
  const parseResult = TravelSearchPreference.array().safeParse(preferences);
  if (!parseResult.success) {
    return;
  }
  return parseResult.data;
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

export function mapToScooterFaqs(scooterFaqs?: any) {
  if (!scooterFaqs) return;
  if (!Array.isArray(scooterFaqs)) return;
  return scooterFaqs
    .map((scooterFaq) => {
      const parseResult = ScooterFaq.safeParse(scooterFaq);
      if (!parseResult.success) {
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}

export function mapToScooterConsentLines(scooterConsentLines?: any) {
  if (!scooterConsentLines) return;
  if (!Array.isArray(scooterConsentLines)) return;
  return scooterConsentLines
    .map((scooterConsentLine) => {
      const parseResult = ScooterConsentLine.safeParse(scooterConsentLine);
      if (!parseResult.success) {
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}

export function mapToBonusProducts(bonusProducts?: any) {
  if (!bonusProducts) return;
  if (!Array.isArray(bonusProducts)) return;
  return bonusProducts
    .map((bonusProduct) => {
      const parseResult = BonusProduct.safeParse(bonusProduct);
      if (!parseResult.success) {
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}

export function mapToBonusTexts(bonusTexts?: any) {
  if (!bonusTexts) return;
  const parseResult = BonusTexts.safeParse(bonusTexts);
  if (!parseResult.success) {
    return;
  }
  return parseResult.data;
}

export function mapToBenefitIdsRequiringValueCode(
  benefitIdsRequiringValueCode?: any,
) {
  if (!benefitIdsRequiringValueCode) return;
  if (!Array.isArray(benefitIdsRequiringValueCode)) return;
  return benefitIdsRequiringValueCode
    .map((benefitIdRequiringValueCode) => {
      const parseResult = OperatorBenefitId.safeParse(
        benefitIdRequiringValueCode,
      );
      if (!parseResult.success) {
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}

export function mapToHarborConnectionOverride(overrides?: any) {
  if (!overrides) return;
  if (!Array.isArray(overrides)) return;
  return overrides
    .map((override) => {
      const parseResult = HarborConnectionOverride.safeParse(override);
      if (!parseResult.success) {
        return;
      }
      return parseResult.data;
    })
    .filter(isDefined);
}

export function mapToNotificationConfig(config?: any) {
  if (!config) return;
  if (!(typeof config === 'object')) return;
  const parseResult = NotificationConfig.safeParse(config);
  if (!parseResult.success) {
    return;
  }
  return parseResult.data;
}

export const mapToStopSignalButtonConfig = (
  config?: any,
): StopSignalButtonConfigType => {
  const parseResult = StopSignalButtonConfig.safeParse(config);
  return parseResult.success
    ? parseResult.data
    : StopSignalButtonConfig.parse({});
};
