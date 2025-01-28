export type DateOptionAndText<T extends string> = {
  option: T;
  text: string;
  selected?: boolean;
};
export type DateOptionAndValue<T extends string> = {
  option: T;
  date: string;
};
