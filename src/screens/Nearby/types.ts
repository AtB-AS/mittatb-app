export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};
