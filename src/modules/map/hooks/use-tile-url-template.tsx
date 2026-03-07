import {useAuthContext} from '@atb/modules/auth';
import {useAppVersionedConfigurableLink} from '@atb/utils/use-app-versioned-configurable-link';

/**
 * Layers supported by the tile server.
 */
export type TileLayerName =
  | 'vehicles_clustered'
  | 'stations_clustered'
  | 'geofencing_zones_features';

/**
 * Returns a tile URL template for fetching map tiles or undefined if unavailable.
 *
 * @param {TileLayerName[]} tileLayerNames - An array of tile layer names used to build the URL.
 * @returns {string | undefined} The fully constructed tile URL template, or `undefined` if a base URL is unavailable.
 */
export const useTileUrlTemplate = (
  tileLayerNames: TileLayerName[],
  params?: Record<string, string>,
): string | undefined => {
  const {userId} = useAuthContext();
  const userIdParam = !userId ? '' : '?userId=' + userId;
  const customParams = Object.entries(params ?? {})
    .map(([key, value]) => `&${key}=${value}`)
    .join('');

  const tileServerBaseUrl =
    useAppVersionedConfigurableLink('tileServerBaseUrls');

  if (!tileServerBaseUrl || tileLayerNames.length === 0) {
    return undefined;
  } else {
    return (
      tileServerBaseUrl +
      tileLayerNames.join(',') +
      '/{z}/{x}/{y}' +
      userIdParam +
      customParams
    );
  }
};
