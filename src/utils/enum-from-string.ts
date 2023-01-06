export const enumFromString = <T>(
  enumObject: {[s: string]: T},
  value?: string,
): T | undefined =>
  value
    ? (Object.values(enumObject) as unknown as string[]).includes(value)
      ? (value as T)
      : undefined
    : undefined;
