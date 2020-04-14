import storage from '../storage';
import {LocationFavorite, UserFavorites} from './types';
import uuid from 'uuid/v4';

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
  favorite: Omit<LocationFavorite, 'id'>,
): Promise<UserFavorites> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.concat({...favorite, id: uuid()});
  return await setFavorites(favorites);
}

export async function removeFavorite(id: string): Promise<UserFavorites> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.filter(item => item.id !== id);
  return await setFavorites(favorites);
}

export async function updateFavorite(
  favorite: LocationFavorite,
): Promise<UserFavorites> {
  let favorites = (await getFavorites()) ?? [];
  favorites = favorites.map(item => {
    if (item.id !== favorite.id) {
      return item;
    }
    return favorite;
  });
  return await setFavorites(favorites);
}
