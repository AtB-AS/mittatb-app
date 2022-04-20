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
      a11yLabel: _('Ikon for favoritten', 'Favourite icon'),
      a11yHint: _(
        'Aktivér for å velge ikon for favoritten',
        'Activate to select favourite icon',
      ),
    },
  },
  save: {
    label: _('Lagre favorittsted', 'Save location as favourite'),
    notSelectedFromError: _(
      'Du må velge et sted du vil ha som favoritt',
      'Please select a location for your favourite',
    ),
    geopositionWithoutNameError: _(
      'Du må velge et navn om du vil bruke din nåværende posisjon som favoritt',
      'Please select a name if you want use your current location for your favourite',
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
  emojiSheet: {
    title: _('Velg emoji', 'Select emoji'),
    rightButton: _('Fjern emoji', 'Clear emoji'),
    categories: {
      smileys: _('Smilefjes', 'Smileys'),
      people: _('Personer', 'People'),
      animals: _('Dyr og natur', 'Animals and nature'),
      food: _('Mat og drikke', 'Food and drinks'),
      activities: _('Aktiviteter', 'Activities'),
      travel: _('Reise og steder', 'Travel and places'),
      objects: _('Objekter', 'Objects'),
      symbols: _('Symboler', 'Symbols'),
    },
  },
};
export default AddEditFavoriteTexts;
