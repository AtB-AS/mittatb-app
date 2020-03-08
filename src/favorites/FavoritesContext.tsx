import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {getFavorites, addFavorite} from './storage';
import {UserFavorites, LocationFavorite} from './types';

type AppState = {
  isLoading: boolean;
  favorites: UserFavorites | null;
};

type FavoriteReducerAction =
  | {type: 'LOAD_FAVORITES'; favorites: UserFavorites | null}
  | {type: 'SET_FAVORITES'; favorites: UserFavorites};

type FavoriteContextState = AppState & {
  addFavorite(location: LocationFavorite): void;
};
const AppContext = createContext<FavoriteContextState | undefined>(undefined);

type AppReducer = (
  prevState: AppState,
  action: FavoriteReducerAction,
) => AppState;

const appReducer: AppReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAD_FAVORITES':
      return {
        ...prevState,
        favorites: action.favorites,
        isLoading: false,
      };
    case 'SET_FAVORITES':
      return {
        ...prevState,
        favorites: action.favorites,
      };
  }
};

const defaultAppState: AppState = {
  isLoading: true,
  favorites: null,
};

const FavoritesContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<AppReducer>(appReducer, defaultAppState);
  async function populateFavorites() {
    const favorites = await getFavorites();
    dispatch({
      type: 'LOAD_FAVORITES',
      favorites: favorites ?? null,
    });
  }

  useEffect(() => {
    populateFavorites();
  }, []);

  const addFavoriteInternal = useCallback(
    async (location: LocationFavorite) => {
      await addFavorite(location);
      await populateFavorites();
    },
    [],
  );

  return (
    <AppContext.Provider value={{...state, addFavorite: addFavoriteInternal}}>
      {children}
    </AppContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      'useFavorites must be used within a FavoritesContextProvider',
    );
  }
  return context;
}

export default FavoritesContextProvider;
