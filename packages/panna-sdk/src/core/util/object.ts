/**
 * Removes keys with `undefined` values from an object
 *
 * @param obj - The object to filter
 * @returns A new object with undefined values removed
 *
 * @example
 * ```typescript
 * const input = { a: 1, b: undefined, c: 'hello', d: null };
 * const result = removeUndefined(input);
 * // result: { a: 1, c: 'hello', d: null }
 * ```
 */
export function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}
