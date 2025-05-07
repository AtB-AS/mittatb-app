export type DateOptionAndText<T extends string> = {
  option: T;
  text: string;
  selected?: boolean;
};
export type DateOptionAndValue<T extends string> = {
  option: T;
  date: string;
};
export const DepartureDateOptions = ['now', 'departure'] as const;
export type DepartureDateOptionType = (typeof DepartureDateOptions)[number];
export type DepartureSearchTime = DateOptionAndValue<DepartureDateOptionType>;
