import {translation as _} from '../../commons';
const FavoriteListTexts = {
  header: {
    title: _('Favorittsteder', 'Favourite locations'),
  },
  noFavorites: _(
    'Du har ingen favorittsteder. Du kan legg til et nå ved å trykke på knappen under.',
    'No favourites added yet. Tap the button below to get started',
  ),
  favoriteItem: {
    a11yHint: _('Aktivér for å redigere', 'Activate to edit'),
  },
  buttons: {
    changeOrder: _('Endre rekkefølge', 'Re-arrange favourites'),
    addFavorite: _('Legg til favorittsted', 'Add favourite location'),
  },
  sortableScreen: {
    title: _('Endre rekkefølge', 'Reorder favourites'),
    messages: {
      error: _(
        'Ooops. Fikk ikke til å lagre favoritter. Prøv igjen er du snill. 🤞',
        'Whoops. We were unable to save your favourites. Please try again. 🤞',
      ),
    },
    buttons: {
      cancel: _('Avbryt', 'Cancel'),
      save: _('Lagre', 'Save'),
    },
  },
};
export default FavoriteListTexts;
