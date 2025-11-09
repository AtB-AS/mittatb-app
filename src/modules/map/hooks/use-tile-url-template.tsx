import {useAuthContext} from '@atb/modules/auth';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useTranslation, getTextForLanguage} from '@atb/translations';

/**
 * Layers supported by the tile server.
 */
export type TileLayerName =
  | 'vehicles_clustered'
  | 'stations'
  | 'geofencing_zones_features';

/**
 * Returns a tile URL template for fetching map tiles or undefined if unavailable.
 *
 * @param {TileLayerName[]} tileLayerNames - An array of tile layer names used to build the URL.
 * @returns {string | undefined} The fully constructed tile URL template, or `undefined` if a base URL is unavailable.
 */
export const useTileUrlTemplate = (
  tileLayerNames: TileLayerName[],
): string | undefined => {
  const {language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const {userId} = useAuthContext();
  const userIdParam = !userId ? '' : '?userId=' + userId;
  const tileServerBaseUrl = getTextForLanguage(
    configurableLinks?.tileServerBaseUrl,
    language,
  );

  if (!tileServerBaseUrl || tileLayerNames.length === 0) {
    return undefined;
  } else {
    return (
      tileServerBaseUrl +
      tileLayerNames.join(',') +
      '/{z}/{x}/{y}' +
      userIdParam
    );
  }
};
