import {getFilterWhichAlsoHidesSelectedFeature} from '@atb-as/mapbox-shared';

type FilterExpression = ReturnType<
  typeof getFilterWhichAlsoHidesSelectedFeature
>;

/**
 * Extends a layer filter with a condition that only shows stop places and
 * quays with an id in visibleIds. Other features, like parking, are not
 * affected. If visibleIds is undefined, the filter is returned unchanged.
 *
 * @param filter - existing filter, must be an array with 'all' as the first element
 * @param visibleIds - ids (from properties) of the stop places and quays to show
 */
export const getFilterWhichOnlyShowsVisibleIds = (
  filter: FilterExpression,
  visibleIds: string[] | undefined,
): FilterExpression =>
  visibleIds
    ? [
        ...filter,
        [
          'any',
          [
            '!',
            [
              'match',
              ['get', 'entityType'],
              ['StopPlace', 'Quay'],
              true,
              false,
            ],
          ],
          ['in', ['get', 'id'], ['literal', visibleIds]],
        ],
      ]
    : filter;
