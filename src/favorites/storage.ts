import storage from '../storage';
import {LocationFavorite, UserLocations, UserFavorites} from './types';

function isLegacyUserLocations(
  obj: UserLocations | UserFavorites,
): obj is UserLocations {
  return 'home' in obj;
}

function convertLegacyToNewStore(userLocations?: UserLocations) {
  return Object.entries(userLocations ?? {}).map(([key, item]) => ({
    emoji: key === 'home' ? '🏠' : '🏢',
    name: key,
    location: item,
  }));
}

export async function getFavorites(): Promise<UserFavorites | null> {
  const userLocations = await storage.get('stored_user_locations');
  if (!userLocations) return null;

  const data = (userLocations ? JSON.parse(userLocations) : []) as
    | UserLocations
    | UserFavorites;

  return isLegacyUserLocations(data) ? convertLegacyToNewStore(data) : data;
}
export function setFavorites(favorites: UserFavorites): Promise<void> {
  return storage.set('stored_user_locations', JSON.stringify(favorites));
}

export async function addFavorite(favorite: LocationFavorite): Promise<void> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.concat(favorite);
  return setFavorites(favorites);
}

/**
 * Used to update favorites to new model if doing onboarding again.
 *
 * @deprecated
 */
export async function setFavorites__legacy(
  data: UserLocations | UserFavorites,
): Promise<UserFavorites> {
  const favorites = isLegacyUserLocations(data)
    ? convertLegacyToNewStore(data)
    : data;
  await storage.set('stored_user_locations', JSON.stringify(favorites));
  return favorites;
}
