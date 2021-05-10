import {translation as _} from '../../commons';
const AddEditFavoriteTexts = {
  header: {
    title: _('Legg til favorittsted', 'Add a favourite location'),
    titleEdit: _('Endre favorittsted', 'Edit favourite location'),
  },
  fields: {
    location: {
      label: _('Sted', 'Place'),
      placeholder: _(
        'Søk etter adresse eller stoppested',
        'Search for an address or location',
      ),
      header: _(
        'Søk etter adresse eller stoppested',
        'Search for an address or location',
      ),
    },
    name: {
      label: _('Navn', 'Name'),
      placeholder: _('Legg til navn', 'Add name'),
      a11yHint: _('Navn for favoritten', 'Favourite name'),
    },
    icon: {
      label: _('Ikon', 'Icon'),
      a11yHint: _(
        'Ikon som skal vises for denne favoritten. ',
        'Icon to display for this favourite. ',
      ),
      mapPoint: _('kartnål', 'map point'),
    },
  },
  save: {
    label: _('Lagre favorittsted', 'Save location as favourite'),
    notSelectedFromError: _(
      'Du må velge et sted du vil ha som favoritt',
      'Please select a location for your favourite',
    ),
  },
  delete: {
    label: _('Slett favorittsted', 'Delete favourite location'),
    confirmWarning: _(
      'Er du sikker på at du vil slette favorittstedet ditt?',
      'Sure you want to delete this favourite?',
    ),
  },
  cancel: {
    label: _('Avbryt', 'Cancel'),
  },
  removeIcon: {
    label: _('Fern ikon', 'Remove icon'),
    a11yHint: _(
      'Fjern ikonet for denne favoritten',
      'Remove the icon for this favourite',
    ),
  },
};
export default AddEditFavoriteTexts;
