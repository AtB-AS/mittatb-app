import {translation as _} from '../../commons';
const FavoriteListTexts = {
  header: {
    title: _('Favorittsteder', 'Favourite locations', 'Favorittstadar'),
  },
  noFavorites: _(
    'Du har ingen favorittsteder. Du kan legg til et nå ved å trykke på knappen under.',
    'No favourites added yet. Tap the button below to get started',
    'Du har ingen favorittstadar. Trykk på knappen under for å leggje til ein.',
  ),
  favoriteItem: {
    a11yHint: _(
      'Aktivér for å redigere',
      'Activate to edit',
      'Aktivér for å redigere',
    ),
  },
  buttons: {
    changeOrder: _(
      'Endre rekkefølge',
      'Re-arrange favourites',
      'Endre rekkefølge',
    ),
    addFavorite: _(
      'Legg til favorittsted',
      'Add favourite location',
      'Legg til favorittstad',
    ),
  },
  sortableScreen: {
    title: _('Endre rekkefølge', 'Reorder favourites', 'Endre rekkefølge'),
    messages: {
      error: _(
        'Ooops. Fikk ikke til å lagre favoritter. Prøv igjen er du snill. 🤞',
        'Whoops. We were unable to save your favourites. Please try again. 🤞',
        'Oi, noko gjekk gale med å lagre favorittane dine. Prøv igjen er du snill. 🤞',
      ),
    },
    buttons: {
      cancel: _('Avbryt', 'Cancel', 'Avbryt'),
      save: _('Lagre', 'Save', 'Lagre'),
    },
  },
};
export default FavoriteListTexts;
