import {translation as _} from '../../commons';
const FavoriteDeparturesTexts = {
  header: {
    title: _('Favorittavganger', 'Favourite departures'),
  },
  noFavorites: _(
    'Du har ingen favorittavganger. Du kan legge til med å stjernemarkere i Avganger-visningen.',
    'You don´t have any favourite departures. Add one by clicking a start in the Departures view',
  ),
  favoriteItemDelete: {
    a11yHint: _(
      'Aktivér for å fjerne favorittavgang',
      'Activate to delete favourite departure',
    ),
  },
  delete: {
    label: _('Fjerne avgang?', 'Delete departure?'),
    confirmWarning: _(
      'Sikker på at du vil fjerne favorittavgang?',
      'Sure you want to delete this favourite?',
    ),
    cancel: _('Avbryt', 'Cancel'),
    delete: _('Slett', 'Delete'),
  },
};
export default FavoriteDeparturesTexts;
