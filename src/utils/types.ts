/**
 * Produces a union of keys from `T` whose value types are assignable to `V`.
 *
 * Useful for deriving key unions based on value shape instead of hard-coding
 * property names. This keeps APIs type-safe and automatically in sync when
 * object types change.
 *
 * @typeParam T - The object type to extract keys from
 * @typeParam V - The value type that selected keys must extend
 *
 * @example
 * type Keys = KeysMatching<
 *   ConfigurableLinks,
 *   AppVersionedConfigurableLink[] | undefined
 * >;
 */
export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
