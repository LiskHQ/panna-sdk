const MAX_LIMIT = 100;
const MAX_OFFSET = 1000;

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
  const isValidLimit = (limit ?? -1) > 0 && (limit ?? -1) <= MAX_LIMIT;
  const isValidOffset = (offset ?? -1) >= 0 && (offset ?? -1) <= MAX_OFFSET;

  if (!isValidLimit || !isValidOffset) {
    return undefined;
  }

  return { limit, offset };
};
