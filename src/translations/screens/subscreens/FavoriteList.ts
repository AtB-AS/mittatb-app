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
        'Vi fikk ikke til å lagre favoritter. Prøv igjen, eller kontakt kundeservice for hjelp.',
        'We were unable to save your favourites. Please try again or contact customer service for assistance.',
        'Vi fekk ikkje til å lagra favorittar. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
    },
    buttons: {
      cancel: _('Avbryt', 'Cancel', 'Avbryt'),
      save: _('Lagre', 'Save', 'Lagre'),
    },
  },
};
export default FavoriteListTexts;
