import {translation as _} from '../../commons';
const FavoriteDeparturesTexts = {
  header: {
    title: _('Favorittavganger', 'Favourite departures'),
  },
  favoriteItemDelete: {
    a11yHint: _(
      'Aktivér for å fjerne favorittavgang',
      'Activate to delete favourite departure',
    ),
  },
  favoriteItemAdd: {
    label: _('Legg til favorittavgang', 'Add favorite departure'),
    a11yHint: _(
      'Aktiver for å legge til favorittavganger',
      'Activate to add favourite departures',
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
