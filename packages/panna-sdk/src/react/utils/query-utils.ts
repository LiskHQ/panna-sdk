const MAX_LIMIT = 100;

/**
 * Creates query filters for pagination if both limit and offset are valid non-negative numbers.
 *
 * @param limit - Maximum number of items to return between 1 and MAX_LIMIT
 * @param offset - Number of items to skip between 0 and MAX_OFFSET
 * @param filterType - Name of the filter to use in the query
 * @returns Pagination filter object or undefined if parameters are invalid
 */
export const generatePaginationQueryFilter = (
  limit?: number,
  offset?: number
) => {
  const normalizedLimit = limit ?? -1;
  const isValidLimit = normalizedLimit > 0 && normalizedLimit <= MAX_LIMIT;
  const normalizedOffset = offset ?? -1;
  const isValidOffset = normalizedOffset >= 0;

  if (!isValidLimit || !isValidOffset) {
    return undefined;
  }

  return { limit, offset };
};
