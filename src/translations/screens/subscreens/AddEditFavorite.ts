import {translation as _} from '../../commons';
const AddEditFavoriteTexts = {
  header: {
    title: _(
      'Legg til favorittstad',
      'Add a favourite location',
      'Legg til ein favorittstad',
    ),
    titleEdit: _(
      'Endre favorittstad',
      'Edit favourite location',
      'Endre ein favorittstad',
    ),
  },
  fields: {
    location: {
      label: _('Stad', 'Place', 'Stad'),
      placeholder: _(
        'Søk etter adresse eller stoppestad',
        'Search for an address or location',
        'Søk etter ein adresse eller stoppestad',
      ),
      header: _(
        'Søk etter adresse eller stoppestad',
        'Search for an address or location',
        'Søk etter ein adresse eller ein stoppestad',
      ),
    },
    name: {
      label: _('Namn', 'Name', 'Namn'),
      placeholder: _('Legg til namn', 'Add name', 'Legg til eit namn'),
      a11yHint: _(
        'Namn for favoritten',
        'Favourite name',
        'Namn for favoritten',
      ),
    },
    icon: {
      label: _('Ikon', 'Icon', 'Ikon'),
      a11yLabel: _(
        'Ikon for favoritten',
        'Favourite icon',
        'Ikon for favoritten',
      ),
      a11yHint: _(
        'Aktivér for å velge ikon for favoritten',
        'Activate to select favourite icon',
        'Aktiver for å velje eit ikon for favoritten',
      ),
    },
  },
  save: {
    label: _(
      'Lagre favorittstad',
      'Save location as favourite',
      'Lagre ein favorittstad',
    ),
    notSelectedFromError: _(
      'Du må velge ein stad du vil ha som favoritt',
      'Please select a location for your favourite',
      'Du må velje ein stad for din favoritt',
    ),
    geopositionWithoutNameError: _(
      'Du må velge eit namn om du vil bruke din noverande posisjon som favoritt',
      'Please select a name if you want use your current location for your favourite',
      'Du må velje eit namn dersom du vil bruke noverande posisjon som favoritt',
    ),
  },
  delete: {
    label: _(
      'Slett favorittstad',
      'Delete favourite location',
      'Slett ein favorittstad',
    ),
    confirmWarning: _(
      'Er du sikker på at du vil slette favorittstaden din?',
      'Sure you want to delete this favourite?',
      'Er du sikker på at du vil slette denne favorittstaden?',
    ),
  },
  cancel: {
    label: _('Avbryt', 'Cancel', 'Avbryt'),
  },
  emojiSheet: {
    title: _('Velg emoji', 'Select emoji', 'Vel emoji'),
    rightButton: _('Fjern emoji', 'Clear emoji', 'Fjern emoji'),
    categories: {
      smileys: _('Smilefjes', 'Smileys', 'Smilefjes'),
      people: _('Personar', 'People', 'Personar'),
      animals: _('Dyr og natur', 'Animals and nature', 'Dyr og natur'),
      food: _('Mat og drikke', 'Food and drinks', 'Mat og drikke'),
      activities: _('Aktivitetar', 'Activities', 'Aktivitetar'),
      travel: _('Reise og stader', 'Travel and places', 'Reise og stadar'),
      objects: _('Objekt', 'Objects', 'Objekt'),
      symbols: _('Symbol', 'Symbols', 'Symbol'),
    },
  },
};
export default AddEditFavoriteTexts;
