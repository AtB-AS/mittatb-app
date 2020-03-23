import storage from '../storage';
import {LocationFavorite, UserFavorites} from './types';

export async function getFavorites(): Promise<UserFavorites | null> {
  const userLocations = await storage.get('stored_user_locations');
  if (!userLocations) return null;

  let data = (userLocations ? JSON.parse(userLocations) : []) as UserFavorites;

  return data;
}

export async function setFavorites(
  favorites: UserFavorites,
): Promise<UserFavorites> {
  await storage.set('stored_user_locations', JSON.stringify(favorites));
  return favorites;
}

export async function addFavorite(
  favorite: LocationFavorite,
): Promise<UserFavorites> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.concat(favorite);
  return await setFavorites(favorites);
}

export async function removeFavorite(
  favorite: LocationFavorite,
): Promise<UserFavorites> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.filter(
    item =>
      item.name !== favorite.name || item.location.id !== favorite.location.id,
  );
  return await setFavorites(favorites);
}

export async function updateFavorite(
  newLocation: LocationFavorite,
  existingLocation: LocationFavorite,
): Promise<UserFavorites> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.map(item => {
    if (
      item.name !== existingLocation.name ||
      item.location.id !== existingLocation.location.id
    ) {
      return item;
    }
    return newLocation;
  });
  return await setFavorites(favorites);
}
