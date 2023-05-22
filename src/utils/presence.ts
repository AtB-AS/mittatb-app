type Nullable<T> = T extends null | undefined ? T : never;

export const isBlank = <T>(value: T): value is Nullable<T> =>
  value === undefined || value === null;
1;
export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;
