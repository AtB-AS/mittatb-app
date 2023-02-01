export type OperatorFragment = {id: string; name: TranslatedStringFragment};

export type PricingPlanFragment = {
  price: number;
  perKmPricing?: Array<PricingSegmentFragment>;
  perMinPricing?: Array<PricingSegmentFragment>;
};

export type PricingSegmentFragment = {
  rate: number;
  end?: number;
  interval: number;
  start: number;
};

export type TranslatedStringFragment = {
  translation: Array<TranslationFragment>;
};

export type TranslationFragment = {language: string; value: string};
