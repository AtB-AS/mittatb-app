type ObjKeyof<T> = T extends object ? keyof T : never;
type KeyofKeyof<T> = ObjKeyof<T> | {[K in keyof T]: ObjKeyof<T[K]>}[keyof T];
type StripNever<T> = Pick<
  T,
  {[K in keyof T]: [T[K]] extends [never] ? never : K}[keyof T]
>;
type Lookup<T, K> = T extends any ? (K extends keyof T ? T[K] : never) : never;
export type Flattened<T> = T extends object
  ? StripNever<{
      [K in KeyofKeyof<T>]:
        | Exclude<K extends keyof T ? T[K] : never, object>
        | {[P in keyof T]: Lookup<T[P], K>}[keyof T];
    }>
  : T;

/**
 * An object of any shape, where each leaf node is a value of type T.
 */
export type Nested<T> = T | {[key: string]: Nested<T>};

/**
 * Make specific field(s) in T required.
 *
 * @example
 * type A = { a: number, b?: string, c: boolean | undefined};
 * type B = RequireValue<A, 'b' | 'c'>;
 * // B is { a: number, b: string, c: boolean }
 */
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific field(s) in T optional.
 *
 * @example
 * type A = { a: number, b: string, c: boolean };
 * type B = PartialField<A, 'b' | 'c'>;
 * // B is { a: number, b?: string, c?: boolean }
 */
export type PartialField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Flatten an object, non-recursively
 *
 * E.g.
 *   flattenObject({ a: 1, b: { ba: 2, bb: {bba: 0}} })
 * Returns:
 *   { a: 1, ba: 2, bb: {bba: 0} }
 */
export function flattenObject<T extends object>(obj: T): Flattened<T> {
  const flattened: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof typeof obj];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, value);
    } else {
      flattened[key] = value;
    }
  });
  return flattened as Flattened<T>;
}

export function hasProp<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> {
  return obj != null && typeof obj === 'object' && key in obj;
}

/**
 * Attempts to parse any data as a JSON string into an object. If the result is
 * not a valid object, it returns undefined.
 */
export function jsonStringToObject(data?: any): object | undefined {
  try {
    const result = JSON.parse(data);

    // If the result is null, return undefined
    if (!result) return undefined;

    // If the result is not an object, return undefined
    if (typeof result !== 'object') return undefined;

    return result;
  } catch (e) {}
}
