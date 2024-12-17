import {MAPBOX_API_TOKEN} from '@env';
import axios, {AxiosResponse} from 'axios';
import {MapboxStyle, MapboxStyleSchema} from './types/mapbox';
import {ZodError} from 'zod';

const mapboxStylesBaseUrl = 'https://api.mapbox.com/styles/v1/';

/**
 * Both using Mapbox Studio Sprites and MapboxGL.Images had some challenges.
 * Mapbox Studio:
 *  - Manual sync job per image upload for each OMS partner.
 *  - White background not working when using Figma components. Hack without components exists, but this is bad with a high number of icons.
 *  - Shadows don't work.
 * MapboxGL.Images:
 *  - Lots of individual images have to be added to the design system.
 *  - Mapbox has no way of saying when the images are ready, and if data is received before they are ready, icons wil be missing.
 *    A possible workaround for this is to have two different iconNames for every image, and toggle between them repeatedly for long enough to be sure.
 *
 * Therefore, this option is used instead: Download the style with Mapbox API,
 * which allows for a custom sprite to be set before sending in as styleJSON.
 * This solution has been found to be solid.
 * Sprites can easily be created with Martin Tile Server.
 *
 * @param {string} styleUrl - The Mapbox style URL (e.g., `mapbox://styles/username/styleId`) to fetch and validate.
 * @returns {Promise<MapboxStyle>} A promise that resolves to a validated `MapboxStyle` object.
 * @throws {ZodError} If the response data fails validation against `MapboxStyleSchema`.
 * @throws {AxiosError} If the HTTP request fails.
 * @throws {Error} For any other unexpected errors.
 */
export async function getMapboxStyle(styleUrl: string): Promise<MapboxStyle> {
  const stylePath = styleUrl.split('mapbox://styles/')?.[1] || '';
  const url = `${mapboxStylesBaseUrl}${stylePath}`;
  try {
    const response: AxiosResponse<any> = await axios.get(url, {
      params: {
        access_token: MAPBOX_API_TOKEN,
      },
    });

    const validatedData = MapboxStyleSchema.parse(response.data);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error.errors);
    } else if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
